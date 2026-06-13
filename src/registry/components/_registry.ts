import { getRegistryItemUrl } from "@/utils/registry";
import type { Registry } from "shadcn/schema";

export const components: Registry["items"] = [
  {
    name: "icon-swap",
    type: "registry:component",
    title: "Icon Swap",
    description: "Animate icon swaps with scale, blur, and fade transitions.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/icon-swap/icon-swap.tsx",
        type: "registry:component",
        target: "@components/icon-swap.tsx",
      },
    ],
    categories: ["effects"],
    docs: "https://chanhdai.com/components/icon-swap",
  },
];
