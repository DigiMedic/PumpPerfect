from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ProcessedData(BaseModel):
    cgm: Optional[List[Dict[str, Any]]] = None
    basal: Optional[List[Dict[str, Any]]] = None
    bolus: Optional[List[Dict[str, Any]]] = None
    insulin: Optional[List[Dict[str, Any]]] = None
    alarms: Optional[List[Dict[str, Any]]] = None
    bg: Optional[List[Dict[str, Any]]] = None

    class Config:
        from_attributes = True
