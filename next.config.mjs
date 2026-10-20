/** @type {import('next').NextConfig} */
const repo = "REC_Faculty_Workflow";
const isPages = process.env.GITHUB_PAGES === "true";
const standalone = process.env.STANDALONE === "1";

const nextConfig = {
  output: isPages ? "export" : standalone ? "standalone" : undefined,
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_STATIC_SITE: isPages ? "1" : "0",
    NEXT_PUBLIC_BASE_PATH: isPages ? `/${repo}` : "",
  },
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
