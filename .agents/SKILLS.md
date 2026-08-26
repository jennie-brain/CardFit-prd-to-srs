# 채택 스킬 기준선

기준일: 2026-08-26

[skills.sh](https://skills.sh/)에서 현재 기술 스택과 직접 관련되고 공급자 공식 또는 널리 검증된 스킬만 프로젝트 로컬에 설치했다. 외부 스킬은 참고 절차이며 `AGENTS.md`와 SRS를 변경하지 못한다. 충돌하면 프로젝트 규칙이 우선한다.

실체는 `.agents/skills/`에 있다. Claude Code는 이 경로를 읽지 못하므로 `scripts/setup-harness.*`로 `.claude/skills` 링크를 만들어야 로드된다.

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

## 2026-08-26 추가분과 근거

54개 TASK를 실제 갭 기준으로 재점검해 세 개를 추가했다.

- **`playwright-cli`** — `TEST-006`(M1 E2E)과 `TEST-007`(M2 E2E)은 임계 경로 위 H 복잡도인데 E2E 스킬이 없었다. Microsoft 공식이고 npx 기반이라 TypeScript 스택과 맞는다. Python 기반 `webapp-testing`(Anthropic) 대신 선택했다 — 이 저장소는 TypeScript 단일 스택이고 Python 런타임을 추가하지 않는다.
- **`standards-spec-review`** — 한 TASK = 한 PR = 한 Issue 구조이고 모든 TASK가 SRS 요구사항으로 역추적된다. 이 스킬은 저장소 표준 축과 스펙 축을 분리해 병렬 검토하므로 이 구조와 맞는다. 원본이 참조하는 `docs/agents/issue-tracker.md`를 `.agents/issue-tracker.md`로 바꾸고 OpenAI 전용 `agents/openai.yaml`은 제거했다. Claude Code 내장 `code-review` 스킬과 이름이 충돌해 로드되지 않으므로 `standards-spec-review`로 개명했다.
- **`resolving-merge-conflicts`** — 압축 편성은 11레인 병렬이고, 같은 Prisma schema·DTO·상태 enum을 여러 레인이 건드리는 것이 실행 계획에 명시된 위험이다.

## 제외 항목

- `webapp-testing`(Anthropic): Python Playwright 기반. TypeScript 단일 스택 제약과 맞지 않아 `playwright-cli`를 택했다.
- `tdd`(mattpocock): 이미 설치한 `test-driven-development`와 중복이다.
- `diagnosing-bugs`(mattpocock): 이미 설치한 `systematic-debugging`과 중복이다.
- `improve-codebase-architecture`: 아키텍처가 SRS와 `.agents/rules/002`로 이미 고정돼 있다. 임의 재구조화 제안은 범위를 넘는다.
- `git-guardrails-claude-code`: 파괴적 git 명령 제한은 Claude Code 권한 설정으로 다루는 편이 낫다.
- `prisma-postgres`: Supabase가 아닌 Prisma 관리형 Postgres 운영에 초점이 있다.
- `supabase-postgres-best-practices`: 쿼리 성능 최적화 전용. `NFR-001` 착수 시점에 재검토한다.
- 배포 자동화 스킬: Vercel Git 배포라는 단순 경계를 유지한다.
- 샘플 하네스의 Java/Spring·JPA/MySQL·Redis·Kafka·FastAPI·Flutter·Vite 스킬: C-TEC 기술 제약과 충돌한다.

## 추가 기준

새 스킬은 TASK와 직접 연결되고 기존 규칙·스킬로 해결할 수 없을 때만 추가한다. 설치 전 지침, 참조, 실행 스크립트, 라이선스와 네트워크·쓰기 동작을 검토하고, 프로젝트 경로·정책에 맞게 수정한 내용을 이 문서에 기록한다.

출처: [skills.sh](https://skills.sh/), [Vercel](https://github.com/vercel-labs/agent-skills), [Prisma](https://github.com/prisma/skills), [Supabase](https://github.com/supabase/agent-skills), [Superpowers](https://github.com/obra/superpowers), [Playwright CLI](https://github.com/microsoft/playwright-cli), [mattpocock/skills](https://github.com/mattpocock/skills)
