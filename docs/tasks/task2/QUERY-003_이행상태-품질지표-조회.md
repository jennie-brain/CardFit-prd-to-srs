---
name: CardFit Query Task
about: 자기보고·관측·이행 집계의 독립 조회
title: "[Query] QUERY-003: 이행 상태·품질 지표 조회"
labels: 'query, outcome, analytics, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — QUERY-003 이행 상태·품질 지표 조회

## Summary
- 목적: 자기보고, 관측 검증, 유지 준수, 조합안 이행과 데이터 품질을 섞지 않고 조회한다.
- REQ: REQ-FUNC-010, REQ-METRIC-005·008~011

## References (Spec & Context)
- 계약: DATA-003
- 선행: COMMAND-004~006

## Scope
- 사용자별 Outcome 상태·사유·기준일 조회
- `OutcomeView`의 versioned schema와 empty·partial·unavailable·error 상태 계약
- 집계용 행동 완주율·유지 준수율·조합안 이행률
- 검증 가능률·판정 불가율·불일치율 병렬 조회
- 자동 개입·외부 알림은 범위 밖

## Task Breakdown
- [ ] 소유권 기반 상세 ViewModel을 작성한다.
- [ ] 분자·분모가 분리된 집계 Query를 작성한다.
- [ ] 유지 항목을 행동 완주율에서 제외한다.
- [ ] 판정 불가 사유와 데이터 기준일을 반환한다.
- [ ] 사용자 상세과 익명 집계의 권한별 반환 필드를 분리하고 내부 오류를 domain code로 변환한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 자기보고·관측 불일치
- Given: 자기보고 완료와 관측 INCONCLUSIVE가 병존한다.
- When: 조회한다.
- Then: 어느 한쪽도 덮어쓰지 않고 두 상태와 사유를 반환한다.
### Scenario 2: 유지 준수
- Given: VERIFIED_MAINTAINED가 있다.
- When: 집계한다.
- Then: 유지 준수율에는 포함하고 행동 완주율에는 포함하지 않는다.
### Scenario 3: 판정 불가
- Given: 부분·오래됨·약한 식별 상태가 있다.
- When: 집계한다.
- Then: 미완료가 아니라 판정 불가율에 포함한다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: COMMAND-005/006 집계, DATA-003 품질 메타데이터
- Writes: 없음
- Side Effects: 없음
- Transaction Boundary: 기간 snapshot read
- Idempotency: 동일 기간·집계버전 동일 응답
- Retry Policy: read timeout만 제한 재시도

## Verification Gates
- Test Gate: TEST-003 품질지표·누락·부분기간 시나리오 통과
- NFR Gate: NFR-001 응답시간, NFR-004 통계값 최소화 검증
- Evidence Location: KPI fixture와 결과 검산표

- M2 기능이며 개인 상세와 익명 집계 권한을 분리한다.
- 0 denominator와 미측정 기준선을 명시적으로 반환한다.
- Server Component와 Route Handler는 같은 `OutcomeView` DTO를 사용한다.

## Definition of Done
- [ ] TEST-004 상태·집계 테스트가 통과한다.
- [ ] TEST-007 M2 Outcome E2E가 통과한다.
- [ ] 유지 혼입·판정 불가 오분류가 0건이다.
- [ ] `OutcomeView` 정상·부분·실패 예시와 contract assertion이 고정됐다.

## Dependencies & Interactions
- Depends on: DATA-003, TEST-004 실패 기준선, COMMAND-004·005·006
- Blocks: 이행 UI, KPI/Guardrail 대시보드
- 변경 전파: DATA-003·TEST-004·007·NFR-006

## Open Decisions
- 코호트 기간·익명화 기준·불일치 경보 임계치

## 결론
단일 완주율로 불확실성을 숨기지 않는 조회 모델을 제공한다.

## 출처

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. 이행상태 Query는 구체 거래내역 대신 통계·품질값만 반환.
- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
