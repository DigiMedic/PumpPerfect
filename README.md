# DigiHealth Analytics

## Instalace a spuštění

### Prerekvizity
- Python 3.12+
- Node.js 18+
- npm nebo yarn

### Backend (Python/Flask)
```bash
# Vytvoření virtuálního prostředí
python -m venv venv

# Aktivace virtuálního prostředí
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalace závislostí
pip install -r requirements.txt

# Spuštění serveru
python server.py
```

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
python server.py
```

### Frontend
```bash
# Spuštění s debugováním
npm run dev
```