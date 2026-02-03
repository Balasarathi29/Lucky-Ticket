
import { defineConfig, globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  {
    files: ["**/*.js", "**/*.jsx"],
    ...nextConfig,
  },
  globalIgnores([".next/**", "out/**", "build/**"]),
]);

export default eslintConfig;
