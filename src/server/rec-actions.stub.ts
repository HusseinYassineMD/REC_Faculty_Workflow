/** No-op stubs for static export (forms that import actions are not used on Pages). */

type Saved = { error: string } | { ok: true };
type IntakeResult = { error: string } | { href: string };

export async function updateScholarRecord(_id: number, _formData: FormData): Promise<Saved> {
  return { error: "Not available on the static demo site." };
}

export async function deleteScholarRecord(_id: number): Promise<Saved> {
  return { error: "Not available on the static demo site." };
}

export async function updateFacultyRecord(_id: number, _formData: FormData): Promise<Saved> {
  return { error: "Not available on the static demo site." };
}

export async function deleteFacultyRecord(_id: number): Promise<Saved> {
  return { error: "Not available on the static demo site." };
}

export async function updateProgramRecord(_id: number, _formData: FormData): Promise<Saved> {
  return { error: "Not available on the static demo site." };
}

export async function deleteProgramRecord(_id: number): Promise<Saved> {
  return { error: "Not available on the static demo site." };
}

export async function saveIntake(_formData: FormData): Promise<IntakeResult> {
  return { error: "Not available on the static demo site." };
}

export async function saveScholar(_formData: FormData) {
  throw new Error("Not available on static demo site");
}

export async function saveFaculty(_formData: FormData) {
  throw new Error("Not available on static demo site");
}

export async function saveProgram(_formData: FormData) {
  throw new Error("Not available on static demo site");
}

export async function exportCsvAction() {
  throw new Error("Not available on static demo site");
}

export async function syncDashboardAction() {
  throw new Error("Not available on static demo site");
}

export async function saveReportSnapshot(_formData: FormData) {
  throw new Error("Not available on static demo site");
}
