# 채택 스킬 기준선

기준일: 2026-08-26

[skills.sh](https://skills.sh/)에서 현재 기술 스택과 직접 관련되고 공급자 공식 또는 널리 검증된 스킬만 프로젝트 로컬에 설치했다. 외부 스킬은 참고 절차이며 `AGENTS.md`와 SRS를 변경하지 못한다. 충돌하면 프로젝트 규칙이 우선한다.

실체는 `.claude/skills/`에 있고 저장소에 포함된다. Claude Code는 이 경로를 추가 설정 없이 읽는다. Cursor·Antigravity가 읽는 `.agents/skills`는 `scripts/setup-harness.*`가 만드는 링크이며 git에 포함하지 않는다.

## 설치 스킬

| 스킬 | 출처 | 적용 범위 | 연결 TASK |
|---|---|---|---|
| `react-best-practices` | `vercel-labs/agent-skills` | Next.js·React 성능과 서버 병렬 조회 | UI-001~009 |
| `prisma-database-setup` | `prisma/skills` | Prisma 7·PostgreSQL 연결과 migration | DATA-001~003, INFRA-001 |
| `supabase` | `supabase/agent-skills` | Local CLI, PostgreSQL, Auth·RLS·보안 | DATA-001~003, NFR-004, SEC-001 |
| `test-driven-development` | `obra/superpowers` | 실패 테스트 우선 구현 | TEST-001~005 |
| `systematic-debugging` | `obra/superpowers` | 재현과 근본 원인 분석 | 전 구간 |
| `verification-before-completion` | `obra/superpowers` | 완료 전 최신 검증 증거 확인 | 전 구간 |
| `playwright-cli` | `microsoft/playwright-cli` | 브라우저 자동화와 E2E 작성·확인 | TEST-006, TEST-007, UI 검증 |
| `standards-spec-review` | `mattpocock/skills` | 표준·스펙 두 축 분리 리뷰 | 전 TASK의 PR |
| `resolving-merge-conflicts` | `mattpocock/skills` | 병렬 레인 충돌 해소 | 계약·schema 공유 구간 |
| `shadcn` | `shadcn-ui/ui` | 컴포넌트 추가·구성, semantic token 강제 | UI-001~009 |
| `web-design-guidelines` | `vercel-labs/agent-skills` | 접근성·UI 가이드라인 준수 리뷰 | UX-001, UI-001~009 |
| `ai-sdk` | `vercel/ai` | Vercel AI SDK 사용법과 버전별 API 확인 | COMMAND-009, API-003, TEST-003, UI-006 |

## 2026-08-26 추가분과 근거

54개 TASK를 실제 갭 기준으로 재점검해 세 개를 추가했다.

- **`playwright-cli`** — `TEST-006`(M1 E2E)과 `TEST-007`(M2 E2E)은 임계 경로 위 H 복잡도인데 E2E 스킬이 없었다. Microsoft 공식이고 npx 기반이라 TypeScript 스택과 맞는다. Python 기반 `webapp-testing`(Anthropic) 대신 선택했다 — 이 저장소는 TypeScript 단일 스택이고 Python 런타임을 추가하지 않는다.
- **`standards-spec-review`** — 한 TASK = 한 PR = 한 Issue 구조이고 모든 TASK가 SRS 요구사항으로 역추적된다. 이 스킬은 저장소 표준 축과 스펙 축을 분리해 병렬 검토하므로 이 구조와 맞는다. 원본이 참조하는 `docs/agents/issue-tracker.md`를 `.agents/issue-tracker.md`로 바꾸고 OpenAI 전용 `agents/openai.yaml`은 제거했다. Claude Code 내장 `code-review` 스킬과 이름이 충돌해 로드되지 않으므로 `standards-spec-review`로 개명했다.
- **`resolving-merge-conflicts`** — 압축 편성은 11레인 병렬이고, 같은 Prisma schema·DTO·상태 enum을 여러 레인이 건드리는 것이 실행 계획에 명시된 위험이다.

## 2026-08-26 2차 추가분과 근거

외부 제안으로 4개를 재검토해 3개를 채택했다.

- **`shadcn`**(공식, 271.7K) — `AGENTS.md`와 C-TEC-004가 shadcn/ui를 고정 스택으로 지정하는데 관련 스킬이 없었다. "semantic token만 쓰고 `bg-blue-500` 같은 raw 값을 금지"하는 이 스킬의 규칙이 `AGENTS.md`의 공용 design token 방침과 그대로 일치한다. `allowed-tools`가 shadcn CLI로만 제한돼 있어 실행 범위도 안전하다. 저장소 부피만 차지하는 `agents/openai.yml`·`assets/`·`evals/`는 제외하고 `SKILL.md`, `cli.md`, `customization.md`, `mcp.md`, `registry.md`, `rules/` 6개만 가져왔다.
- **`web-design-guidelines`**(Vercel 공식, 577.2K) — `REQ-UI-001~005`가 접근성을 요구하고 `UI-001`이 접근성 기반 TASK인데, 기존 `react-best-practices`는 성능 전용이라 접근성 리뷰 수단이 없었다.
- **`ai-sdk`**(Vercel 공식) — `COMMAND-009`·`API-003`·`TEST-003`·`UI-006`이 Vercel AI SDK와 Gemini에 걸려 있다. "기억으로 AI SDK 코드를 쓰지 말고 설치된 버전의 `node_modules` 문서를 확인하라"는 지침이 `verification-before-completion` 규율과 같은 방향이다.

## 제외 항목

- `webapp-testing`(Anthropic): Python Playwright 기반. TypeScript 단일 스택 제약과 맞지 않아 `playwright-cli`를 택했다.
- `tdd`(mattpocock): 이미 설치한 `test-driven-development`와 중복이다.
- `diagnosing-bugs`(mattpocock): 이미 설치한 `systematic-debugging`과 중복이다.
- `improve-codebase-architecture`: 아키텍처가 SRS와 `.agents/rules/002`로 이미 고정돼 있다. 임의 재구조화 제안은 범위를 넘는다.
- `git-guardrails-claude-code`: 파괴적 git 명령 제한은 Claude Code 권한 설정으로 다루는 편이 낫다.
- `prisma-postgres`: Supabase가 아닌 Prisma 관리형 Postgres 운영에 초점이 있다.
- `supabase-postgres-best-practices`: 쿼리 성능 최적화 전용. `NFR-001` 착수 시점에 재검토한다.
- `deploy-to-vercel`(Vercel 공식): **제안됐으나 채택하지 않았다.** ① `.agents/rules/005`가 배포 수단을 Vercel Git 배포로 고정했고 이 스킬이 제공하는 CLI 배포는 그 경계 밖이다. ② `INFRA-001`·`NFR-003`의 실제 요구는 migration·health·rollback **검증**이지 배포 실행이 아니다. ③ 실행 가능한 shell script와 `Archive.zip`을 포함해 쓰지도 않을 기능에 공급망 노출면을 만든다. ④ 임의 preview 배포가 "Preview가 Production DB에 쓰지 못하게 격리한다"는 규칙과 충돌할 수 있다. Vercel 프로젝트 최초 연결이 필요해지면 그때 재검토한다.
- 커뮤니티 `shadcn` 스킬(typeui.sh 등): 브랜드 색상·폰트를 규정하는 디자인 취향 가이드라. 디자인 토큰은 `UX-001`이 소유하므로 충돌한다. 공식 `shadcn-ui/ui` 스킬만 채택했다.
- 샘플 하네스의 Java/Spring·JPA/MySQL·Redis·Kafka·FastAPI·Flutter·Vite 스킬: C-TEC 기술 제약과 충돌한다.

## 추가 기준

새 스킬은 TASK와 직접 연결되고 기존 규칙·스킬로 해결할 수 없을 때만 추가한다. 설치 전 지침, 참조, 실행 스크립트, 라이선스와 네트워크·쓰기 동작을 검토하고, 프로젝트 경로·정책에 맞게 수정한 내용을 이 문서에 기록한다.

출처: [skills.sh](https://skills.sh/), [Vercel](https://github.com/vercel-labs/agent-skills), [Prisma](https://github.com/prisma/skills), [Supabase](https://github.com/supabase/agent-skills), [Superpowers](https://github.com/obra/superpowers), [Playwright CLI](https://github.com/microsoft/playwright-cli), [mattpocock/skills](https://github.com/mattpocock/skills)
