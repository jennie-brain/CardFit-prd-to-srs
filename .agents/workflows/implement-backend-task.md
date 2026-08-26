# 백엔드 TASK 구현 워크플로

1. TASK ID, SRS 근거, 선행 TASK, 단계, 범위 밖 항목을 확인한다.
2. 저장·조회 데이터와 보존 경계를 먼저 적는다.
3. Command/Query와 Server Action/Route Handler의 책임을 나눈다.
4. schema·DTO·Adapter 계약과 Fixture를 먼저 변경한다.
5. 완료 조건을 실패하는 Unit/Contract/Integration 테스트로 만든다.
6. 최소 구현 후 보안·소유권·오류·재시도 경계를 추가한다.
7. 관련 테스트, 전체 테스트, lint, typecheck, build를 실행한다.
8. migration 재현성, secret 노출, 비용 상한을 확인한다.
9. 변경 파일, 검증 결과, 남은 `TBD`·`UNKNOWN`을 보고한다.

오류는 재현 → 증거 수집 → 원인 가설 → 최소 수정 → 회귀 테스트 순서로 처리한다.
