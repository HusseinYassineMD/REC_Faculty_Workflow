# REC Faculty & RPPR Workflow

Next.js dashboard for REC scholars, trainees, faculty, and training programs — with timeline fields for annual RPPR tables.

**Public repo:** https://github.com/HusseinYassineMD/REC_Faculty_Workflow  

**Live app (full forms + saves):** https://rec-faculty-workflow.onrender.com/  

(GitHub Pages URL redirects there.) The hosted app uses SQLite on a persistent disk and seeds from `src/data/demo-roster.json` on first boot. You can add and edit records in the browser.

**Local dev:** same codebase with `data/rec_workflow.sqlite` on your machine (gitignored).

## Run

```bash
git clone https://github.com/HusseinYassineMD/REC_Faculty_Workflow.git
cd REC_Faculty_Workflow
npm install
npm run dev
```

Open **http://127.0.0.1:8766/**

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
