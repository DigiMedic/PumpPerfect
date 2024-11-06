import pandas as pd
from fastapi import UploadFile
from typing import List, Dict, Any
import json
from datetime import datetime
from src.core.config import settings
from src.utils.redis_client import redis_client
from src.utils.file_validators import validate_file_structure
from io import StringIO
import logging
import numpy as np

logger = logging.getLogger(__name__)

class FileProcessor:
    def __init__(self):
        self.file_structures = {
            'cgm_data': {
                'columns': ['Timestamp', 'CGM Glucose Value (mmol/l)', 'Serial Number'],
                'date_columns': ['Timestamp']
            },
            'insulin_data': {
                'columns': ['Timestamp', 'Total Bolus (U)', 'Total Insulin (U)', 
                           'Total Basal (U)', 'Serial Number'],
                'date_columns': ['Timestamp']
            },
            'basal_data': {
                'columns': ['Timestamp', 'Insulin Type', 'Duration (minutes)', 
                           'Percentage (%)', 'Rate', 'Insulin Delivered (U)', 
                           'Serial Number'],
                'date_columns': ['Timestamp']
            },
            'bolus_data': {
                'columns': ['Timestamp', 'Insulin Type', 'Blood Glucose Input (mmol/l)', 
                           'Carbs Input (g)', 'Carbs Ratio', 'Insulin Delivered (U)', 
                           'Initial Delivery (U)', 'Extended Delivery (U)', 
                           'Serial Number'],
                'date_columns': ['Timestamp']
            }
        }

        self.required_columns = {
            'cgm': ['timestamp', 'cgm glucose value (mmol/l)'],
            'basal': ['timestamp', 'rate'],
            'bolus': ['timestamp', 'insulin delivered (u)']
        }

    def identify_file_type(self, filename: str) -> str:
        """Identifikuje typ souboru podle názvu"""
        filename = filename.lower()
        if 'cgm' in filename:
            return 'cgm'
        elif 'basal' in filename:
            return 'basal'
        elif 'bolus' in filename:
            return 'bolus'
        return None

    def clean_numeric_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Vyčistí numerická data pro JSON serializaci"""
        for column in df.select_dtypes(include=[np.number]).columns:
            # Nahrazení inf a -inf hodnotami None
            df[column] = df[column].replace([np.inf, -np.inf], None)
            # Konverze float32/64 na běžné float
            if df[column].dtype in [np.float32, np.float64]:
                df[column] = df[column].astype(float)
                # Omezení na rozumný rozsah
                df[column] = df[column].apply(lambda x: float(x) if -1e308 < x < 1e308 else None)
            # Nahrazení NaN hodnotami None
            df[column] = df[column].where(pd.notnull(df[column]), None)
        return df

    def json_safe_encode(self, data: List[Dict]) -> str:
        """Bezpečná serializace do JSONu"""
        def clean_value(v):
            if isinstance(v, float):
                if np.isnan(v) or np.isinf(v):
                    return None
                if abs(v) > 1e308:  # Maximální hodnota pro JSON
                    return None
                return float(v)
            return v

        cleaned_data = []
        for record in data:
            cleaned_record = {k: clean_value(v) for k, v in record.items()}
            cleaned_data.append(cleaned_record)
        
        return json.dumps(cleaned_data, default=str)

    async def process_csv_file(self, file: UploadFile) -> Dict[str, Any]:
        """Zpracování jednotlivého CSV souboru"""
        try:
            content = await file.read()
            content_str = content.decode('utf-8')
            
            # Přeskočit metadata řádky
            data_start = 0
            lines = content_str.split('\n')
            for i, line in enumerate(lines):
                if any(col.lower() in line.lower() for col in ['timestamp', 'time']):
                    data_start = i
                    break
            
            # Načtení dat
            df = pd.read_csv(
                StringIO(content_str),
                skiprows=data_start,
                on_bad_lines='skip'
            )
            
            # Identifikace typu souboru
            file_type = self.identify_file_type(file.filename)
            if not file_type:
                raise ValueError(f"Neznámý typ souboru: {file.filename}")
            
            # Standardizace názvů sloupců
            df.columns = df.columns.str.strip().str.lower()
            
            # Validace povinných sloupců
            required_cols = self.required_columns[file_type]
            missing_cols = [col for col in required_cols if col not in df.columns]
            if missing_cols:
                raise ValueError(f"Chybí povinné sloupce pro {file_type}: {', '.join(missing_cols)}")
            
            # Čištění dat
            df = df.dropna(subset=required_cols)
            
            # Přejmenování sloupců pro konzistenci s frontendem
            column_mapping = {
                'timestamp': 'Timestamp',
                'cgm glucose value (mmol/l)': 'CGM Glucose Value (mmol/l)',
                'rate': 'Rate',
                'insulin delivered (u)': 'Insulin Delivered (U)'
            }
            df = df.rename(columns=column_mapping)
            
            # Konverze časových údajů
            if 'Timestamp' in df.columns:
                df['Timestamp'] = pd.to_datetime(df['Timestamp']).dt.strftime('%Y-%m-%dT%H:%M:%S')
            
            # Čištění numerických dat pro JSON
            df = self.clean_numeric_data(df)
            
            return {
                'type': file_type,
                'data': df.to_dict('records')
            }
            
        except Exception as e:
            logger.error(f"Chyba při zpracování souboru {file.filename}: {str(e)}")
            raise ValueError(f"Chyba při zpracování souboru {file.filename}: {str(e)}")

    async def process_files(self, files: List[UploadFile]) -> str:
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        processed_files = []
        required_types = {'basal', 'bolus', 'cgm'}
        found_types = set()

        for file in files:
            try:
                if not file.filename.endswith('.csv'):
                    continue

                processed_data = await self.process_csv_file(file)
                if processed_data and processed_data['type'] in required_types:
                    found_types.add(processed_data['type'])
                    
                    # Použití bezpečné serializace
                    try:
                        json_data = self.json_safe_encode(processed_data['data'])
                        # Uložení do Redis s expirací 24 hodin
                        redis_client.setex(
                            f"{session_id}:{processed_data['type']}_data",
                            86400,
                            json_data
                        )
                        processed_files.append(processed_data['type'])
                    except Exception as e:
                        logger.error(f"JSON serialization error for {file.filename}: {str(e)}")
                        raise ValueError(f"Chyba při serializaci dat pro {file.filename}: {str(e)}")
                    
            except Exception as e:
                logger.error(f"Chyba při zpracování souboru {file.filename}: {e}")
                continue

        if not processed_files:
            raise ValueError("Žádné soubory nebyly úspěšně zpracovány")

        missing_types = required_types - found_types
        if missing_types:
            raise ValueError(f"Chybí požadované typy souborů: {', '.join(missing_types)}")

        return session_id
