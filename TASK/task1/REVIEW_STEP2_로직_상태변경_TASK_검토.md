# Step 2 로직·상태 변경 TASK 검토

## 검토 범위

Step 2 대상 14개 문서(Command 10개, Query 4개)에 대해 CQRS 분리, 실행 계약, 완료 조건의 테스트 게이트, 비기능 게이트, 의존성 표현을 확인했다.

## 적용 결과

| 점검 항목 | 결과 |
|---|---|
| Command/Query 분리 | PASS |
| Reads/Writes/Side Effects 명시 | PASS |
| Transaction Boundary·Idempotency·Retry 명시 | PASS |
| Verification Gates(Test/NFR/Evidence) | PASS |
| Decision Log가 문서 말미에 위치 | PASS |
| Query의 기본 쓰기 없음 명시 | PASS |
| Step 1 계약 참조 연결 | PASS WITH OPEN DECISIONS |

## 권장 구현 순서

### M1 계약 의존 경로

1. COMMAND-001, COMMAND-002, COMMAND-007, COMMAND-008, COMMAND-010
2. QUERY-001, QUERY-004
3. COMMAND-003
4. QUERY-002
5. COMMAND-004

### M2 관측·확장 경로

6. COMMAND-005, COMMAND-009
7. COMMAND-006
8. QUERY-003

## 선택지 및 적용안

| 쟁점 | 옵션 | 권장/적용 |
|---|---|---|
| Command 멱등성 키 | 요청 ID / 도메인 hash / 둘의 조합 | 도메인별 조합 키 적용 |
| 외부 Adapter 재시도 | 무재시도 / timeout·429만 재시도 / 전체 재시도 | timeout·429만 제한 재시도 |
| Query 캐시 | 캐시 없음 / 짧은 TTL / 영속 캐시 | 기본 read-only, 캐시는 별도 TTL 메타데이터로 제한 |
| 정책 미확정 처리 | 임시 기본값 / 차단 상태 / 사용자 재입력 | 차단 상태 또는 재입력 요구 |
| 이벤트 기록 | 동기 저장 / outbox / 외부 큐 직접 전송 | 도메인 변경과 outbox 원자 기록 |

## 잔여 오픈 결정

- API-003 Net Benefit 정책
- API-004 관측 목적·동의 정책
- SPEC-002 KPI·Guardrail 산식과 소유자
- M2 관측 집계의 구체적인 스케줄 및 재처리 기준

위 항목은 구현 계약의 외부 Blocker이며, 문서 구조와 테스트 추출을 막지는 않는다. 다만 운영 활성화 전에는 확정해야 한다.

## 결론

Step 2 문서화 Gate는 통과했다. 위 순서대로 M1 로직을 구현하고, 각 TASK의 Test Gate와 NFR Gate 증거를 채운 뒤 M2 관측 경로로 진행한다.

## Decision Log

### 2026-08-26 — Step 2 문서 계약 보강

- 14개 Logic TASK에 Execution Contract, Verification Gates, Decision Log를 추가했다.
- Query는 기본적으로 쓰기·외부 부작용이 없는 snapshot 조회로 고정했다.
- 정책 미확정 값은 임의 기본값으로 대체하지 않고 차단/재입력 경로로 처리한다.
