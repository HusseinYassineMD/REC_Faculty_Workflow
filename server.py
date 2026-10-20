#!/usr/bin/env python3
"""Local hub: serve REC Faculty Workflow UI and read/write canonical REC CSVs."""

from __future__ import annotations

import csv
import json
import mimetypes
import subprocess
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
CPBH = ROOT.parent
CLINICAL_CORE = CPBH / "CORES" / "ClinicalCore_Aim1"
REC_DIR = CLINICAL_CORE / "data" / "reference" / "rec"
SPEAKER_SERIES = CPBH / "REC_Database" / "REC_SpeakerSeries"
ROSTER_JSON = CLINICAL_CORE / "src" / "data" / "recRoster.json"
AGGREGATE_SCRIPT = CLINICAL_CORE / "scripts" / "aggregate_rec_roster.py"
PORT = int(__import__("os").environ.get("REC_WORKFLOW_PORT", "8765"))

DATASETS: dict[str, tuple[str, list[str]]] = {
    "scholars-trainees": (
        "scholars-trainees.csv",
        [
            "id",
            "last_name",
            "first_name",
            "current_or_past",
            "scholar_or_trainee",
            "training_level",
            "research_area",
            "progress",
            "adrc_affiliated",
            "adrd_field",
            "notes",
        ],
    ),
    "faculty": (
        "faculty.csv",
        [
            "id",
            "last_name",
            "first_name",
            "title",
            "institution_department",
            "theme",
            "research_area",
            "executive_committee",
        ],
    ),
    "training-programs": (
        "training-programs.csv",
        [
            "id",
            "program",
            "trainees_per_year",
            "minority_researchers",
            "focus",
            "preceptor",
            "notes",
        ],
    ),
    "meeting-attendance": (
        "meeting-attendance.csv",
        ["session_date", "attendees", "reported_by", "reported_at"],
    ),
}


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    if not path.is_file():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return [{k: (v or "").strip() for k, v in row.items()} for row in rows]


def write_csv_rows(path: Path, fieldnames: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: (row.get(k) or "").strip() for k in fieldnames})


def dataset_status() -> dict:
    out: dict[str, object] = {
        "recDir": str(REC_DIR),
        "clinicalCoreRoot": str(CLINICAL_CORE),
        "speakerSeriesAvailable": SPEAKER_SERIES.is_dir(),
        "datasets": {},
    }
    for key, (filename, _fields) in DATASETS.items():
        path = REC_DIR / filename
        rows = read_csv_rows(path) if path.is_file() else []
        out["datasets"][key] = {
            "filename": filename,
            "path": str(path),
            "rowCount": len(rows),
            "exists": path.is_file(),
            "modifiedAt": datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
            .strftime("%Y-%m-%dT%H:%M:%SZ")
            if path.is_file()
            else None,
        }
    if ROSTER_JSON.is_file():
        try:
            roster = json.loads(ROSTER_JSON.read_text(encoding="utf-8"))
            out["rosterSyncedAt"] = roster.get("meta", {}).get("syncedAt")
            st = roster.get("scholarsTrainees", {}).get("summary", {})
            out["summary"] = {
                "currentScholars": st.get("currentScholars"),
                "currentTrainees": st.get("currentTrainees"),
                "facultyTotal": roster.get("faculty", {}).get("summary", {}).get("total"),
                "programCount": roster.get("trainingPrograms", {})
                .get("summary", {})
                .get("totalPrograms"),
            }
        except json.JSONDecodeError:
            out["rosterSyncedAt"] = None
    else:
        out["rosterSyncedAt"] = None
    return out


class Handler(BaseHTTPRequestHandler):
    server_version = "RECWorkflow/1.0"

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _send_json(self, status: int, payload: object) -> None:
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, status: int, text: str, content_type: str = "text/plain") -> None:
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8"))

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path == "/api/status":
            self._send_json(200, dataset_status())
            return

        if path == "/api/preview/rec-roster":
            if not ROSTER_JSON.is_file():
                self._send_json(404, {"error": "recRoster.json not found; run sync:rec first"})
                return
            self._send_json(200, json.loads(ROSTER_JSON.read_text(encoding="utf-8")))
            return

        if path.startswith("/api/datasets/"):
            key = path.removeprefix("/api/datasets/").strip("/")
            if key not in DATASETS:
                self._send_json(404, {"error": f"Unknown dataset: {key}"})
                return
            filename, fields = DATASETS[key]
            csv_path = REC_DIR / filename
            self._send_json(
                200,
                {
                    "key": key,
                    "filename": filename,
                    "fields": fields,
                    "rows": read_csv_rows(csv_path),
                    "path": str(csv_path),
                },
            )
            return

        if path.startswith("/speaker-series/"):
            rel = path.removeprefix("/speaker-series/")
            target = (SPEAKER_SERIES / rel).resolve()
            if not str(target).startswith(str(SPEAKER_SERIES.resolve())):
                self._send_text(403, "Forbidden")
                return
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                self.send_error(404)
                return
            self._serve_file(target)
            return

        if path == "/":
            path = "/index.html"
        file_path = (ROOT / path.lstrip("/")).resolve()
        if not str(file_path).startswith(str(ROOT.resolve())):
            self._send_text(403, "Forbidden")
            return
        if file_path.is_dir():
            file_path = file_path / "index.html"
        if not file_path.is_file():
            self.send_error(404)
            return
        self._serve_file(file_path)

    def _serve_file(self, file_path: Path) -> None:
        ctype, _ = mimetypes.guess_type(str(file_path))
        if file_path.suffix == ".js":
            ctype = "text/javascript; charset=utf-8"
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype or "application/octet-stream")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if not path.startswith("/api/datasets/"):
            self._send_json(404, {"error": "Not found"})
            return
        key = path.removeprefix("/api/datasets/").strip("/")
        if key not in DATASETS:
            self._send_json(404, {"error": f"Unknown dataset: {key}"})
            return
        filename, fields = DATASETS[key]
        payload = self._read_json_body()
        rows = payload.get("rows")
        if not isinstance(rows, list):
            self._send_json(400, {"error": "Body must include rows: []"})
            return
        normalized: list[dict[str, str]] = []
        for row in rows:
            if not isinstance(row, dict):
                continue
            normalized.append({k: str(row.get(k, "")).strip() for k in fields})
        csv_path = REC_DIR / filename
        write_csv_rows(csv_path, fields, normalized)
        self._send_json(
            200,
            {
                "ok": True,
                "key": key,
                "rowCount": len(normalized),
                "path": str(csv_path),
            },
        )

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path != "/api/sync/rec":
            self._send_json(404, {"error": "Not found"})
            return
        if not AGGREGATE_SCRIPT.is_file():
            self._send_json(
                500,
                {"error": f"Missing aggregate script: {AGGREGATE_SCRIPT}"},
            )
            return
        try:
            proc = subprocess.run(
                [sys.executable, str(AGGREGATE_SCRIPT)],
                cwd=str(CLINICAL_CORE),
                capture_output=True,
                text=True,
                check=True,
            )
        except subprocess.CalledProcessError as exc:
            self._send_json(
                500,
                {
                    "error": "sync failed",
                    "stdout": exc.stdout,
                    "stderr": exc.stderr,
                },
            )
            return
        self._send_json(
            200,
            {
                "ok": True,
                "stdout": proc.stdout,
                "status": dataset_status(),
            },
        )


def main() -> None:
    if not REC_DIR.is_dir():
        print(f"Warning: REC CSV directory not found at {REC_DIR}", file=sys.stderr)
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"REC Faculty Workflow hub → http://127.0.0.1:{PORT}/")
    print(f"Canonical CSVs → {REC_DIR}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
