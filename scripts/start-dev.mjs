import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT || "8766";
const host = process.env.HOST || "127.0.0.1";

function killPort(p) {
  try {
    const out = execSync(`lsof -ti :${p}`, { encoding: "utf8" }).trim();
    if (!out) return;
    for (const pid of out.split("\n").filter(Boolean)) {
      try {
        process.kill(Number(pid), "SIGTERM");
      } catch {
        /* ignore */
      }
    }
    console.log(`Freed port ${p}`);
  } catch {
    /* nothing on port */
  }
}

if (!fs.existsSync(path.join(root, "node_modules"))) {
  console.log("Running npm install (first time)…");
  execSync("npm install", { cwd: root, stdio: "inherit" });
}

function cleanNextCache() {
  const nextDir = path.join(root, ".next");
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    console.log("Cleared .next cache");
  }
}

killPort(port);
try {
  execSync('pkill -f "REC_Faculty_Workflow.*next dev" 2>/dev/null || true', {
    stdio: "ignore",
    shell: true,
  });
} catch {
  /* ignore */
}

cleanNextCache();

console.log(`\nREC Faculty Workflow → http://${host}:${port}/\n`);
const child = spawn(
  "npx",
  ["next", "dev", "-p", port, "-H", host],
  { cwd: root, stdio: "inherit", env: process.env }
);

child.on("exit", (code) => process.exit(code ?? 0));
