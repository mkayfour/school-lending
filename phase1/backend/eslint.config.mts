import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off",
      "no-global-assign": "off"
    }
  },
  {
    ...tseslint.configs.recommended,
    rules: {
      ...((tseslint.configs.recommended as any).rules ?? {}),
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off",
      "no-global-assign": "off"
    }
  }
]);
