from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from src.api.routes import router
import logging

# Konfigurace loggeru
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Nejjednodušší CORS konfigurace
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Povolí všechny origins pro vývoj
    allow_credentials=False,  # Vypneme credentials
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Logování požadavku
    logger.debug(f"Incoming {request.method} request to {request.url}")
    logger.debug(f"Request headers: {dict(request.headers)}")
    
    # Zpracování požadavku
    response = await call_next(request)
    
    # Logování odpovědi
    logger.debug(f"Response status: {response.status_code}")
    logger.debug(f"Response headers: {dict(response.headers)}")
    
    # Přidání CORS hlaviček pro všechny odpovědi
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )

# Přidání routeru
app.include_router(router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Explicitní handler pro OPTIONS požadavky
@app.options("/{path:path}")
async def options_handler(request: Request):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )
