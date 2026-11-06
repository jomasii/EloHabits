import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", ".expo/**", "dist/**", "babel.config.js"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: { "no-console": "error", "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }] } },
);
