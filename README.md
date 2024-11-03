# DigiHealth Analytics - Analýza dat z inzulínové pumpy

Webová aplikace pro komplexní analýzu a vizualizaci dat z inzulínových pump a kontinuálního monitoringu glukózy (CGM).

## Funkce

### Analýza glykémií
- Průměrná glykémie a GMI (Glucose Management Indicator)
- Čas v cílovém rozmezí (Time in Range)
- Variabilita glukózy (CV - Coefficient of Variation)
- Detekce a analýza hypoglykémií

### Analýza inzulínu
- Denní profily bazálního a bolusového inzulínu
- Citlivost na inzulín
- Analýza vztahu mezi bolusy a hypoglykémiemi
- Hodinové statistiky dávkování

### Vizualizace
- Interaktivní grafy pomocí Recharts
- Přehledné statistické karty
- Časové filtry a různé typy zobrazení
- Responzivní design pro všechna zařízení

## Technologie

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui komponenty
- Recharts pro grafy

### Backend
- Python/Flask
- Pandas pro analýzu dat
- NumPy pro statistické výpočty
- Flask-CORS pro cross-origin požadavky

## Instalace

1. Klonování repozitáře:
```bash
git clone https://github.com/yourusername/digihealth.git
cd digihealth
```

2. Instalace frontend závislostí:
```bash
npm install
```

3. Instalace backend závislostí:
```bash
pip install -r requirements.txt
```

4. Vytvoření .env.local souboru:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Spuštění aplikace

1. Spuštění backend serveru:
```bash
python server.py
```

2. Spuštění frontend development serveru:
```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`

## Struktura projektu

```
digihealth/
├── app/
│   ├── components/
│   │   ├── analytics/
│   │   │   ├── GlucoseMetricsCard.tsx
│   │   │   ├── InsulinSensitivityChart.tsx
│   │   │   ├── DailyProfile.tsx
│   │   │   ├── HypoEventsTable.tsx
│   │   │   └── StatisticsGrid.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   └── tabs.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FileUploader.tsx
│   │   └── PythonData.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── analytics.ts
│   └── types/
│       └── index.ts
├── server/
│   └── server.py
└── public/
    └── assets/
```

## Analytické funkce

### Glykemické metriky
- Průměrná glykémie
- GMI (Glucose Management Indicator)
- Čas v cílovém rozmezí (3.9-10.0 mmol/L)
- Koeficient variace (CV)
- Počet a analýza hypoglykémií

### Inzulínové metriky
- Hodinové mediány bazálních a bolusových dávek
- Citlivost na inzulín (ISF)
- Analýza vztahu mezi bolusy a hypoglykémiemi
- Denní vzorce dávkování

## Konfigurace

Aplikace používá následující konfigurační parametry:

```python
HYPO_THRESHOLD = 3.9  # hranice hypoglykémie v mmol/L
HYPER_THRESHOLD = 10.0  # hranice hyperglykémie v mmol/L
TIME_WINDOW = 2  # časové okno pro analýzu po bolusu (hodiny)
```

## Vývoj

Pro přidání nové funkcionality:

1. Vytvořte novou větev
2. Implementujte změny
3. Přidejte testy
4. Vytvořte pull request

## Testování

```bash
# Frontend testy
npm test

# Backend testy
python -m pytest
```

## Licence

Distribuováno pod MIT licencí. Viz `LICENSE` pro více informací.

## Autoři

- Jméno Autora (@github_username)

## Kontakt

Email - email@example.com
Project Link: https://github.com/yourusername/digihealth
