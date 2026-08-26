# 테스트와 품질

TASK 완료 조건을 성공·실패·경계 사례로 바꾸고 실패하는 가장 작은 테스트를 먼저 작성한다. 실제 실패를 확인한 뒤 최소 구현으로 통과시키고 회귀 없이 정리한다. 구현 후 테스트를 덧붙이는 방식으로 TDD 완료를 주장하지 않는다.

- Unit: 결정론적 계산, 게이팅, 배분, 상태 전이, 금액·날짜 경계.
- Contract: Command/Query DTO, Adapter, Fixture, AI structured output.
- Integration: Route Handler·Server Action, Prisma transaction, migration·seed, 인증·소유권.
- E2E: SRS 핵심 사용자 경로와 단계별 승격 Gate.

동일 입력·동일 규칙 버전은 동일 결과를 생성해야 한다. Mock 호출 자체보다 관찰 가능한 계약과 결과를 검증한다. 관련 테스트에서 전체 회귀, lint, typecheck, build 순서로 넓혀 최신 실행 출력을 확인한다. 실패·생략·환경 제약을 숨기지 않는다.
