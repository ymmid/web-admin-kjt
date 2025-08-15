// eslint.config.js (ESM)
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports"; // ⬅️ tambahkan ini

export default tseslint.config(
  // Base: target file + globals (browser + node)
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "unused-imports": unusedImports, // ⬅️ tambahkan plugin di sini
    },
    rules: {
      // ⬅️ tambahkan rules untuk hapus import tidak terpakai
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },

  // JS recommended (flat)
  js.configs.recommended,

  // TypeScript recommended (flat)
  ...tseslint.configs.recommended,

  // React recommended (flat)
  {
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  }
);
