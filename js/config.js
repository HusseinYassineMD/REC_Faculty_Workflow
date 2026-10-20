/** Navigation targets and canonical data paths (see server.py). */
export const LINKS = {
  naccRppr:
    "https://www.naccdata.org/progress-reports-to-nia/",
  naccG1G2Note:
    "Supporting Documents · Tables G1 & G2: REC Scholars/Trainees and REC Events",
  clinicalCoreDev: "http://localhost:3002/#rec",
  cpbhDashboardDev: "http://localhost:3020/",
  speakerSeries: "/speaker-series/index.html",
};

export const DATASETS = {
  scholars: {
    key: "scholars-trainees",
    label: "Table 1a · REC scholars & trainees",
    rpprRef: "G1 · Summary table of REC scholars and trainees",
    filename: "scholars-trainees.csv",
    columns: [
      { key: "id", label: "ID", type: "number", width: 56 },
      { key: "last_name", label: "Last name", type: "text", required: true },
      { key: "first_name", label: "First name", type: "text", required: true },
      {
        key: "current_or_past",
        label: "Current or past",
        type: "select",
        options: ["Current", "Past"],
      },
      {
        key: "scholar_or_trainee",
        label: "Scholar or trainee",
        type: "select",
        options: ["Scholar", "Trainee"],
      },
      { key: "training_level", label: "Level of training", type: "text" },
      { key: "research_area", label: "Area of research", type: "textarea" },
      { key: "progress", label: "Progress", type: "textarea" },
      {
        key: "adrc_affiliated",
        label: "ADRC affiliated?",
        type: "yesno",
      },
      { key: "adrd_field", label: "ADRD field?", type: "yesno" },
      { key: "notes", label: "Notes", type: "text" },
    ],
  },
  faculty: {
    key: "faculty",
    label: "Participating REC faculty",
    rpprRef: "G1 · Participating REC faculty",
    filename: "faculty.csv",
    columns: [
      { key: "id", label: "ID", type: "number", width: 56 },
      { key: "last_name", label: "Last name", type: "text", required: true },
      { key: "first_name", label: "First name", type: "text", required: true },
      { key: "title", label: "Title", type: "text" },
      {
        key: "institution_department",
        label: "Institution / department",
        type: "text",
      },
      { key: "theme", label: "Theme", type: "text" },
      { key: "research_area", label: "Research area", type: "textarea" },
      {
        key: "executive_committee",
        label: "Executive committee",
        type: "yesno",
      },
    ],
  },
  programs: {
    key: "training-programs",
    label: "USC training programs (ADRD / minority scholars)",
    rpprRef: "G1 · Training programs table",
    filename: "training-programs.csv",
    columns: [
      { key: "id", label: "ID", type: "number", width: 56 },
      { key: "program", label: "Program", type: "text", required: true },
      {
        key: "trainees_per_year",
        label: "Post-doc trainees / year",
        type: "text",
      },
      {
        key: "minority_researchers",
        label: "% minority researchers",
        type: "text",
      },
      { key: "focus", label: "Focus", type: "textarea" },
      { key: "preceptor", label: "Preceptor", type: "text" },
      { key: "notes", label: "Notes", type: "text" },
    ],
  },
  attendance: {
    key: "meeting-attendance",
    label: "REC speaker series · Zoom attendance",
    rpprRef: "G2 · REC events / attendance",
    filename: "meeting-attendance.csv",
    columns: [
      { key: "session_date", label: "Session date (YYYY-MM-DD)", type: "date" },
      { key: "attendees", label: "Attendees", type: "number" },
      { key: "reported_by", label: "Reported by", type: "text" },
      { key: "reported_at", label: "Reported at", type: "date" },
    ],
  },
};

export const DATASET_LIST = [
  DATASETS.scholars,
  DATASETS.faculty,
  DATASETS.programs,
  DATASETS.attendance,
];
