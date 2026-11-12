# REC Faculty & RPPR Workflow

Next.js dashboard for REC scholars, trainees, faculty, and training programs — with timeline fields for annual RPPR tables.

**Public repo:** https://github.com/HusseinYassineMD/REC_Faculty_Workflow  

**Shareable preview:** https://husseinyassinemd.github.io/REC_Faculty_Workflow/  

Dashboard, reports, and RPPR views use demo data; intake forms are placeholders until we hook up a hosted database. **Local dev** (`npm run dev`) has full save/edit with SQLite.

## Run

```bash
git clone https://github.com/HusseinYassineMD/REC_Faculty_Workflow.git
cd REC_Faculty_Workflow
npm install
npm run dev
```

Open **http://127.0.0.1:8766/**

## Database

Local runs use a SQLite file at `data/rec_workflow.sqlite`. To share one roster, use a free [Turso](https://turso.tech/pricing) database (SQLite, no credit card). The free plan covers this app: 5 GB storage, 100 databases, and far more reads and writes than a faculty roster needs.

```bash
turso auth login
turso db create rec-faculty
turso db show rec-faculty --url
turso db tokens create rec-faculty
```

Put the URL and token in `.env` (see `.env.example`). Restart `npm run dev`. The app creates the tables and loads the current roster the first time it connects.

Leave both variables empty to keep using the local file. The GitHub Pages preview stays read-only; saving needs this app server, because the database token never goes in the browser.

## Pages

| Page | URL |
|------|-----|
| Home | `/` |
| Dashboard | `/dashboard` |
| Forms | `/forms/scholar`, `/forms/faculty`, `/forms/program` |
| Timeline reports | `/reports` |
| RPPR preview | `/rppr` |

## Data & privacy

- **SQLite:** `data/rec_workflow.sqlite` — created on first run; optional seed from local REC CSVs if present
- **Export:** dashboard buttons write CSV/JSON to your machine when you choose
- **Do not commit** `.sqlite` files or exports containing real scholar/faculty names

NACC reference: [Progress Reports to NIA](https://www.naccdata.org/progress-reports-to-nia/)
