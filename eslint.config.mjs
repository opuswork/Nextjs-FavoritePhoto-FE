import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  // 1. Next.js Core Web Vitals 규칙
  ...nextVitals,

  // 2. Prettier와 충돌하는 ESLint 규칙 비활성화
  prettier,

  // 3. Ignore 설정
  globalIgnores(['.next/**', 'out/**', 'build/**', 'node_modules/**']),
]);
