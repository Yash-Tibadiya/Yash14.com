"use client";

import { useRouter } from "@bprogress/next/app";
import { useHotkeys } from "react-hotkeys-hook";

export function KeyboardShortcuts() {
  const router = useRouter();

  const navigate = (path: string, keys: string) => {
    router.push(path);
  };

  useHotkeys("g>h", () => navigate("/", "g>h"));
  useHotkeys("g>c", () => navigate("/components", "g>c"));
  useHotkeys("g>b", () => navigate("/blocks", "g>b"));

  return null;
}
