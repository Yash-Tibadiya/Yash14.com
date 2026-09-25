// Uploads CDN-served files from public/ to the Cloudflare R2 bucket.
// Usage: pnpm cdn:upload   (run `pnpm cdn:login` once first)
import { execSync } from "node:child_process";

const BUCKET = process.env.R2_BUCKET || "yash14-assets";
const FILES = [
  "assets/yash.jpg",
  "assets/yash14-brand.zip",
  "audio/yashtimbadiya.mp3",
  "logo/crosseven.png",
  "logo/enacton.png",
];

for (const file of FILES) {
  execSync(
    `pnpm dlx --allow-build=esbuild --allow-build=workerd wrangler r2 object put "${BUCKET}/${file}" --file "public/${file}" --cache-control "public, max-age=31536000, immutable" --remote`,
    { stdio: "inherit" },
  );
}
