import { copyFile, rename, unlink } from "fs/promises";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const real = path.join(root, "src/server/rec-actions.ts");
const bak = path.join(root, "src/server/rec-actions.ts.bak");
const stub = path.join(root, "src/server/rec-actions.stub.ts");
const reportsPage = path.join(root, "src/app/reports/page.tsx");
const reportsPageBak = path.join(root, "src/app/reports/page.tsx.bak");
const reportsPageStatic = path.join(root, "src/app/reports/page.static.tsx");

async function main() {
  await rename(real, bak);
  await copyFile(stub, real);
  await rename(reportsPage, reportsPageBak);
  await copyFile(reportsPageStatic, reportsPage);
  try {
    execSync("GITHUB_PAGES=true next build", { cwd: root, stdio: "inherit" });
  } finally {
    await unlink(reportsPage);
    await rename(reportsPageBak, reportsPage);
    await unlink(real);
    await rename(bak, real);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
