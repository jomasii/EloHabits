import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/", "migrations/", "knexfile.cjs"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: { "no-console": "error" } },
);
