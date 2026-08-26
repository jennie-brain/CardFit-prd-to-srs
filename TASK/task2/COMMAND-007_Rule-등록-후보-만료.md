---
name: CardFit Command Task
about: 카드 혜택 Rule 버전 등록과 후보 무효화
title: "[Command] COMMAND-007: Rule 등록·후보 만료"
labels: 'command, admin, rule, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-007 Rule 등록·후보 만료

## Summary
- 목적: 승인된 BenefitRule을 버전으로 등록하고 영향받는 후보를 만료시킨다.
- REQ: REQ-FUNC-005~007, REQ-NF-006

## References (Spec & Context)
- 계약: DATA-001·002, API-005
- SRS: 6.2.2, 6.3, 8.10

## Scope
- 관리자 인가, Rule 유효기간·중복·회귀 선검증
- 새 버전 저장과 기존 후보 만료
- 변경 감사 이벤트
- 약관 크롤러는 범위 밖

## Task Breakdown
- [ ] 관리자와 입력 schema를 검증한다.
- [ ] Rule 중복·기간 겹침·필수 항목을 검사한다.
- [ ] Rule 등록과 후보 만료를 transaction으로 처리한다.
- [ ] 변경 전 200건 회귀 실행 결과를 연결한다.
- [ ] Rule 기준일로 최신성 상태를 산출하고 7일 초과 경고·30일 초과 계산 제외를 적용한다.
- [ ] 검증된 새 Rule 활성화 시 경고를 해제하고 기존 후보는 만료 상태로 유지한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 등록
- Given: 권한자와 검증된 새 Rule이 있다.
- When: 등록한다.
- Then: 새 버전과 감사 이벤트가 저장되고 영향 후보가 만료된다.
### Scenario 2: 회귀 실패
- Given: 새 Rule이 오류율 기준을 초과한다.
- When: 활성화를 시도한다.
- Then: 활성화·후보 만료를 수행하지 않는다.
### Scenario 3: 권한 없음
- Given: 관리자가 아니다.
- When: 변경한다.
- Then: 거부하고 DB 변경은 0건이다.
### Scenario 4: 오래된 Rule
- Given: Rule 갱신 지연이 30일을 초과한다.
- When: 계산 가능 상태를 갱신한다.
- Then: 해당 Rule을 사용하는 카드를 계산 대상에서 제외하고 기준일과 사유를 기록한다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: DATA-002 Rule 후보, 만료시각·동의 상태
- Writes: 만료 상태와 RuleFreshness 이벤트
- Side Effects: 운영 알림 이벤트
- Transaction Boundary: 만료 판정과 상태 변경을 원자 처리
- Idempotency: rule candidate ID와 evaluation timestamp bucket
- Retry Policy: transient DB 오류만 재시도

## Verification Gates
- Test Gate: TEST-002/007 만료 경계와 재실행 시나리오 통과
- NFR Gate: NFR-004 감사·마스킹 및 NFR-006 스케줄 지연 검증
- Evidence Location: scheduler run log와 expiry fixture

- 변경은 하위 호환 migration과 감사 가능성을 유지한다.
- 7일·30일 최신성 상태를 산출할 수 있어야 한다.

## Definition of Done
- [ ] TEST-002 Rule 회귀가 통과한다.
- [ ] TEST-005 관리자 인가가 통과한다.
- [ ] NFR-002와 REQ-NF-006 최신성 기준을 충족한다.

## Dependencies & Interactions
- Depends on: DATA-001·002, API-005, TEST-002·005 실패 기준선
- Blocks: COMMAND-003, QUERY-004
- 변경 전파: Rule schema·계산 Fixture·TEST-002·QUERY-004·NFR-002·006

## Open Decisions
- 관리자 역할 제공 주체, Rule 승인 워크플로

## 결론
Rule 변경을 계산 결과와 분리하지 않고 회귀·만료까지 하나의 운영 Command로 묶는다.

## 출처

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. 만료 판정은 스케줄러 재실행에도 멱등적으로 동작.
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
