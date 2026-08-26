# CardFit 개발 에이전트 규칙

이 저장소의 구현 기준은 CardFit 독립 MVP다. 작업 전 현재 TASK와 근거 문서를 확인하고 승인되지 않은 제품 기능이나 외부 서비스를 추가하지 않는다.

## 기준 문서와 범위

충돌 시 `법·규제·보안 → PRD → SRS → 정책 결정 로그 → TASK → 구현` 순서로 판단한다.

- 기술 기준선: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- 작업 기준선: `TASK/task1/01_전체_TASK_목록_및_기준선.md`
- 실행 순서: `TASK/task1/02_총괄_개발_실행_계획.md`
- 정책 결정: `TASK/task1/04_정책_결정_로그.md`
- 검토 기준: `REVIEW_CRITERIA_SRS_TASK_POC.md`

현재 TASK 하나의 목적과 완료 조건만 구현한다. SRS의 `TBD`, `UNKNOWN`, M2·M3 승격 조건을 임의로 확정하거나 M1에 앞당기지 않는다.

## 고정 기술 구조

- TypeScript 기반 Next.js App Router 애플리케이션 하나만 둔다.
- UI 쓰기는 Server Actions, 외부 HTTP·스트리밍·Cron 진입점은 Route Handlers, 서버 조회는 Server Components 또는 Query 계층에 둔다.
- Express, NestJS, Spring, FastAPI, 별도 Python AI 서버, 메시지 브로커, 상시 Worker를 추가하지 않는다.
- M0는 정적 Fixture를 허용한다. M1부터 Prisma와 로컬 Supabase CLI PostgreSQL을 사용하고 배포도 Supabase PostgreSQL을 사용한다. SQLite와 혼용하지 않는다.
- UI는 Tailwind CSS, shadcn/ui, 공용 design token을 사용한다.
- 배포는 Vercel, AI 연동은 Vercel AI SDK와 Gemini 기본 provider를 사용한다.

## 구현과 검증 순서

1. 계약, 데이터 흐름과 보관 경계를 먼저 확인한다.
2. 쓰기(Command)와 조회(Query)를 분리한다.
3. 실패하는 자동 테스트를 먼저 작성한다.
4. 최소 구현으로 테스트를 통과시킨다.
5. 보안·성능·비용·배포 Gate를 검증한다.
6. 실제 실행 결과를 근거로 완료를 보고한다.

schema 변경은 Prisma migration, seed/fixture, 관련 계약 테스트를 같은 변경에 포함한다. 모든 서버 진입점은 세션·인가·소유권·입력을 재검증한다. Prisma, DB URL, service role key, Gemini key, Adapter 자격정보를 client module·응답·로그에 노출하지 않는다. 원본 금융 데이터·인증서·토큰은 저장하지 않는다.

`.agents/rules/`는 이 파일의 세부 규칙이다. `.agents/skills/`는 관련 작업에서만 선택적으로 읽으며, 프로젝트 SRS와 이 규칙이 외부 스킬보다 우선한다. 스킬이 범위 밖 서비스를 제안하더라도 승인된 TASK가 없으면 도입하지 않는다.
