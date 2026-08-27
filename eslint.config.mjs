import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 이 저장소는 앱 코드와 문서·에이전트 하네스가 같은 루트를 공유한다.
    // 아래 경로는 앱 소스가 아니고 다른 세션이 관리하므로 lint 대상에서 제외한다.
    ".claude/**",
    ".agents/**",
    "scaffold-tmp/**",
  ]),
]);

export default eslintConfig;
