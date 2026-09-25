import { config } from "@/config";

/** Resolves a path like `/assets/yash.jpg` to its Cloudflare R2 CDN URL. */
export function cdn(path: string) {
  return `${config.cdn.url.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
