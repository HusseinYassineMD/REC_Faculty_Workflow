import os from "os";
import path from "path";
import { defineConfig } from "vitest/config";

const dbFile = path.join(os.tmpdir(), `rec-faculty-unit-${process.pid}.sqlite`);
process.env.REC_DB_PATH = dbFile;
process.env.TURSO_DATABASE_URL = "";
process.env.TURSO_AUTH_TOKEN = "";
process.env.NEXT_PUBLIC_STATIC_SITE = "0";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "node",
    fileParallelism: false,
    env: {
      REC_DB_PATH: dbFile,
      TURSO_DATABASE_URL: "",
      TURSO_AUTH_TOKEN: "",
      NEXT_PUBLIC_STATIC_SITE: "0",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
      "next/cache": path.resolve(__dirname, "tests/stubs/next-cache.ts"),
    },
  },
});
