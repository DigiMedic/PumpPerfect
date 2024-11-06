import redis
from src.core.config import settings
import logging

logger = logging.getLogger(__name__)

try:
    # Pokud je nastaveno REDIS_URL, použijeme ho
    if hasattr(settings, 'REDIS_URL'):
        redis_client = redis.Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True
        )
    else:
        # Jinak sestavíme URL z jednotlivých parametrů
        redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
        if hasattr(settings, 'REDIS_PASSWORD') and settings.REDIS_PASSWORD:
            redis_url = f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
        
        redis_client = redis.Redis.from_url(
            redis_url,
            decode_responses=True
        )
except Exception as e:
    logger.error(f"Chyba při připojení k Redis: {e}")
    raise

def test_redis_connection():
    try:
        return redis_client.ping()
    except redis.ConnectionError as e:
        logger.error(f"Redis connection error: {e}")
        return False
