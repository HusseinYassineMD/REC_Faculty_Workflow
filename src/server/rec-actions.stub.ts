/** No-op stubs for static export (forms that import actions are not used on Pages). */

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
