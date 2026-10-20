import path from "path";

export const WORKFLOW_ROOT = process.cwd();
export const CLINICAL_CORE_ROOT = path.join(WORKFLOW_ROOT, "../CORES/ClinicalCore_Aim1");
export const CLINICAL_REC_DIR = path.join(CLINICAL_CORE_ROOT, "data/reference/rec");
export const AGGREGATE_SCRIPT = path.join(CLINICAL_CORE_ROOT, "scripts/aggregate_rec_roster.py");
export const DB_PATH = path.join(WORKFLOW_ROOT, "data/rec_workflow.sqlite");
export const SPEAKER_SERIES_INDEX = path.join(
  WORKFLOW_ROOT,
  "../REC_Database/REC_SpeakerSeries/index.html"
);

export const LINKS = {
  naccRppr: "https://www.naccdata.org/progress-reports-to-nia/",
};
