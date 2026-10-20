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
