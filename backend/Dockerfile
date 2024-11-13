# Stage 1: Builder
FROM python:3.11-slim-buster as builder

# Nastavení pracovního adresáře
WORKDIR /app

# Instalace build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Kopírování requirements
COPY requirements.txt .

# Vytvoření virtualenv a instalace dependencies
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final
FROM python:3.11-slim-buster

# Kopírování virtualenv z builder stage
COPY --from=builder /opt/venv /opt/venv

# Nastavení pracovního adresáře
WORKDIR /app

# Nastavení PATH pro virtualenv
ENV PATH="/opt/venv/bin:$PATH"

# Kopírování zdrojového kódu
COPY src/ ./src/

# Vytvoření neprivilegovaného uživatele
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Spuštění aplikace
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
