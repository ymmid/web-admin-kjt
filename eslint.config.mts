// eslint.config.js (ESM)
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Auto hapus import tidak dipakai
      "unused-imports/no-unused-imports": "warn",

      // Auto hapus variabel tidak dipakai (termasuk argumen fungsi)
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
    ignores: ["node_modules", ".next", "dist", "build", "public"],
  },

  // Preset bawaan JS
  js.configs.recommended,

  // Preset TypeScript
  ...tseslint.configs.recommended,

  // Preset React
  {
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  },

  // ⬇️ OVERRIDE PALING TERAKHIR: pastikan rule legacy React tetap OFF
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
