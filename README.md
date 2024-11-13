# PumpPerfect

Profesionální nástroj pro analýzu dat z inzulínových pump a CGM senzorů. Pomáhá diabetikům lépe kontrolovat jejich léčbu pomocí pokročilé analýzy dat a přehledných vizualizací.

## 🚀 Funkce

- Analýza dat z inzulínové pumpy a CGM senzoru
- Vizualizace glykemických profilů
- Statistiky a metriky (TIR, GMI, variabilita)
- Analýza inzulínových dávek
- Monitoring hypoglykémií
- Přehledné reporty

## 🛠 Technologie

### Frontend
- Next.js 13+ s App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI komponenty
- Chart.js pro vizualizace
- Custom hooks pro state management

### Backend
- FastAPI (Python)
- Pandas pro analýzu dat
- Redis pro caching
- Docker

## 📦 Instalace

1. Klonování repozitáře:
\`\`\`bash
git clone https://github.com/yourusername/PumpPerfect.git
cd PumpPerfect
\`\`\`

2. Nastavení prostředí:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Spuštění pomocí Docker:
\`\`\`bash
docker-compose up -d
\`\`\`

### Manuální instalace

#### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

#### Backend
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # nebo `venv\Scripts\activate` na Windows
pip install -r requirements.txt
python src/main.py
\`\`\`

## 🔧 Vývoj

### Struktura projektu

\`\`\`
PumpPerfect/
├── frontend/                # Next.js aplikace
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # React komponenty
│   │   │   ├── analytics/  # Analytické komponenty
│   │   │   ├── ui/        # Základní UI komponenty
│   │   │   ├── navigation/ # Navigační komponenty
│   │   │   └── dashboard/  # Dashboard komponenty
│   │   ├── lib/           # Sdílené utility
│   │   │   ├── api/       # API klient
│   │   │   ├── hooks/     # Custom React hooks
│   │   │   └── utils/     # Pomocné funkce
│   │   └── types/         # TypeScript typy
│   └── ...
│
├── backend/                # FastAPI aplikace
│   ├── src/
│   │   ├── api/           # API endpointy
│   │   ├── services/      # Byznys logika
│   │   └── utils/         # Pomocné funkce
│   └── ...
│
└── docs/                  # Dokumentace
\`\`\`

### Klíčové komponenty

#### Analytics
- GlucoseChart: Vizualizace glykemických dat
- AnalyticsDashboard: Hlavní dashboard s přehledem
- StatisticsGrid: Zobrazení klíčových metrik

#### UI Components
- Button: Základní tlačítko s různými variantami
- Card: Komponenta pro zobrazení dat
- Select: Výběrové menu

### API Endpoints

#### Data Upload
- POST /api/upload - Nahrání souborů
- GET /api/analysis/{session_id} - Získání výsledků analýzy

#### Analytics
- POST /api/analyze - Spuštění analýzy
- GET /api/export/{session_id} - Export dat

## 📊 Analýza dat

### Podporované formáty dat
- CSV soubory z inzulínových pump
- Data z CGM senzorů
- Exporty z různých glukometrů

### Klíčové metriky
- Time in Range (TIR)
- Glucose Management Indicator (GMI)
- Variabilita glykémie
- Analýza bazálních a bolusových dávek
- Statistiky hypoglykémií

## 🔒 Bezpečnost

- Validace vstupních dat
- Rate limiting
- CORS ochrana
- Bezpečné zpracování souborů

## 📝 Vývoj

Projekt je aktivně vyvíjen. Aktuální plán vývoje najdete v [ROADMAP.md](ROADMAP.md).

### Přispívání

1. Fork repozitáře
2. Vytvoření feature branch
3. Commit změn
4. Push do vašeho forku
5. Vytvoření Pull requestu

## 📫 Kontakt

- Email: your.email@example.com
- GitHub Issues: Pro nahlášení chyb a návrhů na vylepšení

## ⭐️ Podpora

Pokud se vám projekt líbí, dejte mu hvězdičku na GitHubu!

## 📄 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor pro detaily.
