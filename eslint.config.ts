import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      prettier: prettierPlugin,
    },
    ...js.configs.recommended,
    rules: {
      "prettier/prettier": "error",
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["src/**/*.ts", "types/**/*.d.ts"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
    extends: [tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["eslint.config.ts", "tsup.config.ts"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
    extends: [tseslint.configs.stylistic, prettierConfig],
  },
]);
