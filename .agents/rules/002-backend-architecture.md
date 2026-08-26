# 백엔드 아키텍처

## 책임 경계

- Server Action: 폼과 UI에서 시작하는 내부 쓰기 Command.
- Route Handler: 외부 HTTP 계약, 스트리밍, webhook 또는 Vercel Cron 진입점.
- Server Component/Query: 읽기 전용 조회. 조회 중 상태를 변경하지 않는다.
- Domain: 프레임워크와 LLM에 의존하지 않는 계산·게이팅·배분 규칙.
- DAL/Adapter: Prisma와 외부 플랫폼 접근을 캡슐화한 `server-only` 모듈.

외부 입력은 진입점에서 schema, 세션, 역할, 소유권을 검증하고 검증된 타입만 도메인에 전달한다.

## 데이터

- Prisma schema와 migration을 관계형 데이터의 정본으로 사용한다.
- Local·Preview·Production은 PostgreSQL provider 하나를 쓰고 환경별 연결 정보와 데이터를 격리한다.
- runtime의 pooled `DATABASE_URL`과 migration의 direct `DIRECT_URL`을 분리한다.
- Prisma 경로는 Node.js runtime을 사용하고 요청 간 메모리 상태를 전제로 하지 않는다.
- 하나의 불변식을 구성하는 여러 쓰기는 transaction으로 묶는다.
- 재시도 가능한 외부 요청과 Cron은 idempotency와 중복 처리 테스트를 갖는다.
- Production에서 `prisma db push`를 사용하지 않는다.

## AI·외부 연결

Gemini는 Vercel AI SDK adapter 뒤에서 정형 근거의 설명만 생성한다. 계산 결과와 추천 순서는 AI 호출 전에 확정한다. timeout·429·5xx 시 설명만 `unavailable`로 처리한다. 플랫폼 연동은 같은 계약의 Mock/Production Adapter로 분리하고 M3 승인 전 Mock을 사용한다.
