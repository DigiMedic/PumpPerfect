# DigiHealth Analytics

DigiHealth Analytics je aplikace pro analýzu dat z inzulinové pumpy a CGM senzoru. Cílem projektu je poskytnout uživatelům nástroje pro sledování a analýzu glykémie a inzulinu.

## Instalace a spuštění

### Prerekvizity
- Python 3.12+
- Node.js 18+
- npm nebo yarn
- Redis server

### Backend (Python/Flask)
```bash
# Klonování repozitáře
git clone <repository-url>
cd insulin-data-analysis

# Vytvoření virtuálního prostředí
python -m venv venv
source venv/bin/activate  # Linux/Mac
# nebo
venv\Scripts\activate  # Windows

# Instalace závislostí
pip install -r requirements.txt

# Spuštění Redis serveru
redis-server

# Spuštění aplikace
uvicorn src.main:app --reload
```
Aplikace bude dostupná na `http://localhost:8000`.

### Frontend (Next.js)
```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev
```

## Struktura projektu
```
digihealth/
├── app/                    # Frontend aplikace
│   ├── components/        # React komponenty
│   ├── lib/              # Utility a helpers
│   └── types/            # TypeScript typy
├── server/               # Python backend
├── public/              # Statické soubory
└── docs/               # Dokumentace
```

## Funkce backendu
- Nahrávání CSV souborů s daty z inzulinové pumpy
- Zpracování a validace dat
- Analýza glykémie, inzulinu a alarmů
- REST API pro komunikaci s frontendem
- Dočasné ukládání dat v Redis

## API Dokumentace
Po spuštění serveru je dokumentace dostupná na:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Hlavní endpointy
1. Upload souborů:
   - POST `/upload/files` - nahrání jednotlivých souborů
   - POST `/upload/folder` - nahrání celé složky
2. Analýza dat:
   - GET `/api/analysis/{session_id}/glucose-overview` - přehled glykémie
   - GET `/api/analysis/{session_id}/insulin-overview` - přehled inzulinu
   - GET `/api/analysis/{session_id}/alarms-overview` - přehled alarmů
3. Testovací endpoint:
   - GET `/test` - ověření funkčnosti API

## Formát vstupních dat

### Požadované CSV soubory
- `basal_data.csv`: Bazální dávky inzulínu
- `bolus_data.csv`: Bolusové dávky inzulínu
- `cgm_data.csv`: Data z CGM

### Struktura CSV souborů
Všechny soubory musí obsahovat:
1. První řádek: metadata (přeskočeno)
2. Druhý řádek: hlavičky sloupců
3. Od třetího řádku: data

#### Povinné sloupce:
- basal_data.csv: Timestamp, Rate
- bolus_data.csv: Timestamp, Insulin Delivered (U)
- cgm_data.csv: Timestamp, CGM Glucose Value (mmol/l)

## Zpracování souborů
Backend zpracovává CSV soubory pomocí třídy `FileProcessor`, která:
- Identifikuje typ souboru (CGM, basal, bolus) na základě názvu.
- Zpracovává jednotlivé CSV soubory, včetně validace struktury a čištění dat.
- Ukládá zpracovaná data do Redis s expirací 24 hodin.

## Řešení problémů

### Backend
1. Kontrola logů v konzoli serveru
2. Ověření formátu CSV souborů
3. Kontrola časových značek

### Frontend
1. Kontrola Network tabu v DevTools
2. Ověření dat v konzoli prohlížeče
3. Kontrola React DevTools

## Vývoj

### Backend
```bash
# Aktivace debug módu
export FLASK_DEBUG=1
uvicorn src.main:app --reload
```

### Frontend
```bash
# Spuštění s debugováním
npm run dev
```

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
