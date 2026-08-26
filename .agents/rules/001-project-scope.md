# 프로젝트 목표와 범위

CardFit은 미래 지출과 제약을 입력받아 결정론적 규칙으로 카드 조합의 순혜택과 근거를 제시하는 독립 검증 MVP다.

- M0: TypeScript 계약, JSON Fixture, 계산·게이팅·배분·근거와 자동 테스트.
- M1: Prisma·Supabase 저장, Mock Adapter, 스냅샷과 핵심 UX.
- M2: 승격 조건을 통과한 선택적 Gemini 설명, Cron, 관측과 비용 Guardrail.
- M3: 승인된 Production Adapter의 계약·보안·네트워크 준비도.

승인되지 않은 내부 API 구조를 추정하거나 AI를 계산·추천 결정자로 사용하지 않는다. 실제 카드 발급·해지·금융 거래, 추가 SaaS·자체 호스팅·별도 인프라는 범위 밖이다. `TBD`와 `UNKNOWN`은 결정 로그의 승인 전까지 유지한다. 구현은 TASK ID, SRS 요구사항, 자동 검증 항목으로 역추적할 수 있어야 한다.
