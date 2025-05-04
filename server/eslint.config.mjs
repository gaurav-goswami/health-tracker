// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "dot-notation": "error",
      "no-console": "error",
      "no-unused-vars": "off",
    },
  },
  {
    ignores: ["dist", "node_modules", "eslint.config.mjs", "prisma", "docker-compose.yml"],
  }
);
