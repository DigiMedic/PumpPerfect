from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from src.services.file_processor import FileProcessor
from src.utils.redis_client import redis_client
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/upload/files")
async def upload_files(files: List[UploadFile] = File(...)):
    logger.info(f"Received {len(files)} files")
    try:
        processor = FileProcessor()
        session_id = await processor.process_files(files)
        
        logger.info(f"Files processed successfully, session_id: {session_id}")
        
        # Načtení zpracovaných dat z Redis
        processed_data = {
            'basal': json.loads(redis_client.get(f"{session_id}:basal_data") or "[]"),
            'bolus': json.loads(redis_client.get(f"{session_id}:bolus_data") or "[]"),
            'cgm': json.loads(redis_client.get(f"{session_id}:cgm_data") or "[]")
        }

        # Kontrola dat před odesláním
        if not all(processed_data.values()):
            missing = [k for k, v in processed_data.items() if not v]
            logger.error(f"Missing data for: {missing}")
            raise HTTPException(
                status_code=400,
                detail=f"Chybí data pro: {', '.join(missing)}"
            )

        return {
            "message": "Soubory úspěšně nahrány",
            "processed_data": processed_data,
            "session_id": session_id
        }
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Interní chyba serveru")

@router.get("/test")
async def test_endpoint():
    logger.info("Test endpoint called")
    return {"message": "API is working"}
