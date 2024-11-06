from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class UploadResponse(BaseModel):
    session_id: str
    status: str

class GlucoseStats(BaseModel):
    average: float
    min: float
    max: float
    readings_count: int

class GlucoseOverview(BaseModel):
    cgm: GlucoseStats
    bg: GlucoseStats
    time_in_range: Dict[str, float]

class InsulinDailyTotals(BaseModel):
    total_insulin: float
    total_bolus: float
    total_basal: float

class BolusDetails(BaseModel):
    count: int
    average_bolus: float

class BasalDetails(BaseModel):
    count: int
    average_basal: float

class InsulinOverview(BaseModel):
    daily_totals: InsulinDailyTotals
    bolus_details: BolusDetails
    basal_details: BasalDetails

class AlarmsOverview(BaseModel):
    total_alarms: int
    alarm_types: Dict[str, int]
