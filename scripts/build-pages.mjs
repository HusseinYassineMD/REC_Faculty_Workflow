import { copyFile, rename, unlink, writeFile, mkdir } from "fs/promises";
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
const reportApi = path.join(root, "src/app/api/report/route.ts");
const reportApiBak = path.join(root, "src/app/api/report/route.ts.bak");

async function main() {
  await rename(real, bak);
  await copyFile(stub, real);
  await rename(reportsPage, reportsPageBak);
  await copyFile(reportsPageStatic, reportsPage);
  let hadApi = false;
  try {
    await rename(reportApi, reportApiBak);
    hadApi = true;
  } catch {
    /* no api route */
  }
  const sha =
    process.env.GITHUB_SHA?.trim() ||
    execSync("git rev-parse HEAD", { cwd: root, encoding: "utf-8" }).trim();
  try {
    execSync(`GITHUB_PAGES=true NEXT_PUBLIC_DEPLOY_SHA=${sha} next build`, {
      cwd: root,
      stdio: "inherit",
    });
    await mkdir(path.join(root, "out"), { recursive: true });
    await writeFile(path.join(root, "out/deploy-version.txt"), `${sha}\n`);
  } finally {
    await unlink(reportsPage);
    await rename(reportsPageBak, reportsPage);
    await unlink(real);
    await rename(bak, real);
    if (hadApi) await rename(reportApiBak, reportApi);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
