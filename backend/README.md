# Insulin Data Analysis Backend

Backend systém pro analýzu dat z inzulinové pumpy a CGM senzoru.

## Funkce

- Nahrávání CSV souborů s daty z inzulinové pumpy
- Zpracování a validace dat
- Analýza glykémie, inzulinu a alarmů
- REST API pro komunikaci s frontendem
- Dočasné ukládání dat v Redis

## Požadavky

- Python 3.8+
- Redis server
- Virtuální prostředí (doporučeno)

## Instalace

1. Klonování repozitáře:
```bash
git clone <repository-url>
cd insulin-data-analysis
```

2. Vytvoření virtuálního prostředí:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# nebo
venv\Scripts\activate  # Windows
```

3. Instalace závislostí:
```bash
pip install -r requirements.txt
```

4. Konfigurace prostředí:
```bash
cp .env.example .env
# Upravte .env soubor podle potřeby
```

## Spuštění

1. Spuštění Redis serveru:
```bash
redis-server
```

2. Spuštění aplikace:
```bash
uvicorn src.main:app --reload
```

Aplikace bude dostupná na `http://localhost:8000`

## API Dokumentace

Po spuštění serveru je dokumentace dostupná na:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Hlavní endpointy

1. Upload souborů:
- POST `/api/upload/files` - nahrání jednotlivých souborů
- POST `/api/upload/folder` - nahrání celé složky

2. Analýza dat:
- GET `/api/analysis/{session_id}/glucose-overview` - přehled glykémie
- GET `/api/analysis/{session_id}/insulin-overview` - přehled inzulinu
- GET `/api/analysis/{session_id}/alarms-overview` - přehled alarmů

## Integrace s frontendem

Frontend může komunikovat s backendem pomocí REST API. Příklad použití:

```javascript
// Upload souborů
const formData = new FormData();
files.forEach(file => formData.append('files', file));

const response = await fetch('http://localhost:8000/api/upload/files', {
  method: 'POST',
  body: formData
});

const { session_id } = await response.json();

// Získání dat pro analýzu
const glucoseData = await fetch(
  `http://localhost:8000/api/analysis/${session_id}/glucose-overview`
);
```

## Struktura projektu

```
src/
├── api/
│   └── routes.py           # API endpointy
├── core/
│   ├── config.py          # Konfigurace aplikace
│   ├── dependencies.py    # Dependency injection
│   └── middleware.py      # Middleware
├── schemas/
│   └── responses.py       # Pydantic modely
├── services/
│   ├── file_processor.py  # Zpracování souborů
│   └── data_analyzer.py   # Analýza dat
├── utils/
│   ├── redis_client.py    # Redis klient
│   └── file_validators.py # Validace souborů
└── main.py               # Hlavní aplikace
```

## Bezpečnost

- CORS je nakonfigurován pro povolené origins
- Rate limiting pro API endpointy
- Validace vstupních souborů
- Dočasné ukládání dat s automatickým vymazáním

## Testování

Spuštění testů:
```bash
pytest
```

## Produkční nasazení

1. Upravte konfiguraci v `.env`
2. Nastavte produkční Redis server
3. Použijte produkční WSGI server (např. Gunicorn)
4. Nastavte HTTPS
5. Implementujte monitoring a logging

## Licence

MIT
