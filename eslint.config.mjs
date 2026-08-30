import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import perfectionist from "eslint-plugin-perfectionist";

// Import sorting only. Everything else (linting, formatting) stays with Biome,
// whose organizeImports assist is disabled so the two do not fight.
export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "public/**",
      "src/registry/__index__.tsx",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    // react-hooks and @typescript-eslint are registered without enabling any
    // rules so the eslint-disable comments shipped in src/registry resolve.
    plugins: {
      perfectionist,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          type: "line-length",
          order: "asc",
          fallbackSort: { type: "alphabetical", order: "asc" },
          newlinesBetween: 1,
          groups: ["type-import", "unknown"],
        },
      ],
    },
  },
];
