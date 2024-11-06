import pandas as pd
import json
from typing import Dict, Any
from src.utils.redis_client import redis_client
from src.schemas.responses import (
    GlucoseOverview,
    InsulinOverview,
    AlarmsOverview
)

class DataAnalyzer:
    async def get_glucose_overview(self, session_id: str) -> GlucoseOverview:
        """Analýza dat glykémie"""
        cgm_data = json.loads(redis_client.get(f"{session_id}:cgm_data") or '[]')
        bg_data = json.loads(redis_client.get(f"{session_id}:bg_data") or '[]')
        
        if not cgm_data and not bg_data:
            raise ValueError("Data nejsou k dispozici")
        
        df_cgm = pd.DataFrame(cgm_data)
        df_bg = pd.DataFrame(bg_data)
        
        # Výpočet času v rozsahu pro CGM data
        time_in_range = self._calculate_time_in_range(df_cgm)
        
        return GlucoseOverview(
            cgm=self._calculate_glucose_stats(df_cgm, 'CGM Glucose Value (mmol/l)'),
            bg=self._calculate_glucose_stats(df_bg, 'Glucose Value (mmol/l)'),
            time_in_range=time_in_range
        )

    async def get_insulin_overview(self, session_id: str) -> InsulinOverview:
        """Analýza dat inzulinu"""
        insulin_data = json.loads(redis_client.get(f"{session_id}:insulin_data") or '[]')
        bolus_data = json.loads(redis_client.get(f"{session_id}:bolus_data") or '[]')
        basal_data = json.loads(redis_client.get(f"{session_id}:basal_data") or '[]')
        
        if not insulin_data:
            raise ValueError("Data nejsou k dispozici")
        
        df_insulin = pd.DataFrame(insulin_data)
        df_bolus = pd.DataFrame(bolus_data)
        df_basal = pd.DataFrame(basal_data)
        
        return InsulinOverview(
            daily_totals=self._calculate_daily_totals(df_insulin),
            bolus_details=self._calculate_bolus_details(df_bolus),
            basal_details=self._calculate_basal_details(df_basal)
        )

    async def get_alarms_overview(self, session_id: str) -> AlarmsOverview:
        """Analýza dat alarmů"""
        alarms_data = json.loads(redis_client.get(f"{session_id}:alarms_data") or '[]')
        
        if not alarms_data:
            raise ValueError("Data nejsou k dispozici")
        
        df_alarms = pd.DataFrame(alarms_data)
        
        return AlarmsOverview(
            total_alarms=len(df_alarms),
            alarm_types=df_alarms['Alarm/Event'].value_counts().to_dict()
        )

    def _calculate_glucose_stats(self, df: pd.DataFrame, value_column: str) -> Dict[str, Any]:
        """Výpočet statistik glykémie"""
        if df.empty:
            return {
                'average': 0.0,
                'min': 0.0,
                'max': 0.0,
                'readings_count': 0
            }
        
        return {
            'average': df[value_column].mean(),
            'min': df[value_column].min(),
            'max': df[value_column].max(),
            'readings_count': len(df)
        }

    def _calculate_time_in_range(self, df: pd.DataFrame) -> Dict[str, float]:
        """Výpočet času v rozsahu pro CGM data"""
        if df.empty:
            return {'low': 0, 'normal': 0, 'high': 0}
        
        total = len(df)
        ranges = {
            'low': len(df[df['CGM Glucose Value (mmol/l)'] < 3.9]),
            'normal': len(df[(df['CGM Glucose Value (mmol/l)'] >= 3.9) & 
                           (df['CGM Glucose Value (mmol/l)'] <= 10.0)]),
            'high': len(df[df['CGM Glucose Value (mmol/l)'] > 10.0])
        }
        
        return {
            key: (value / total) * 100 for key, value in ranges.items()
        }

    def _calculate_daily_totals(self, df: pd.DataFrame) -> Dict[str, float]:
        """Výpočet denních součtů inzulinu"""
        return {
            'total_insulin': df['Total Insulin (U)'].mean(),
            'total_bolus': df['Total Bolus (U)'].mean(),
            'total_basal': df['Total Basal (U)'].mean()
        }

    def _calculate_bolus_details(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Výpočet detailů bolusů"""
        if df.empty:
            return {'count': 0, 'average_bolus': 0.0}
        
        return {
            'count': len(df),
            'average_bolus': df['Insulin Delivered (U)'].mean()
        }

    def _calculate_basal_details(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Výpočet detailů bazálu"""
        if df.empty:
            return {'count': 0, 'average_basal': 0.0}
        
        return {
            'count': len(df),
            'average_basal': df['Insulin Delivered (U)'].mean()
        }
