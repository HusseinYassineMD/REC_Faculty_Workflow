# REC Faculty & RPPR Workflow

Next.js dashboard for REC scholars, trainees, faculty, and training programs — with timeline fields for annual RPPR tables.

## Run

```bash
cd /Users/aishwaryajagadish/Desktop/CPBH/REC_Faculty_Workflow
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

## Data

- **SQLite:** `data/rec_workflow.sqlite` (primary store)
- **Export CSV / roster JSON:** buttons on the dashboard (optional file export for reporting)

NACC reference: [Progress Reports to NIA](https://www.naccdata.org/progress-reports-to-nia/)
