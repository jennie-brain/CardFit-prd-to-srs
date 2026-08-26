---
name: CardFit Test Task
about: 선택 기준선·자기보고·관측 판정 상태전이 테스트
title: "[Test] TEST-004: 선택·이행 상태전이 테스트"
labels: 'test, outcome, state-machine, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — TEST-004 선택·이행 상태전이 테스트

## Summary
- 목적: 선택부터 자기보고·관측·집계까지 가능한 상태 조합과 금지 전이를 fake clock으로 검증한다.
- REQ: REQ-FUNC-010

## References (Spec & Context)
- 계약: DATA-003, API-004, MOCK-001
- 로직: COMMAND-004~006, QUERY-003

## Scope
- In: 선택·자기보고·관측·집계 상태와 시간·멱등 규칙
- Out: 승인 전 실제 마이데이터 후속 관측

## Task Breakdown
- [ ] 선택 기준선 누락·만료·멱등 테스트를 작성한다.
- [ ] +30일·24시간 fake clock 사례를 작성한다.
- [ ] 명시 상태 1회·미관측 2회·부분·충돌을 테스트한다.
- [ ] 자기보고/검증 독립 조합을 parameterized test로 작성한다.
- [ ] 유지 준수와 행동 완주 집계를 분리 검증한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 기준선
- Given: 유효 후보를 선택한다.
- When: transaction이 완료된다.
- Then: 기준선·OutcomeItem 누락은 0건이다.
### Scenario 2: 단일 미관측
- Given: 명시 상태 없이 한 번 보이지 않는다.
- When: 판정한다.
- Then: 완료로 승격되지 않는다.
### Scenario 3: 상태 독립
- Given: 자기보고 완료·관측 불가다.
- When: 조회·집계한다.
- Then: 완료/UNAVAILABLE을 독립 유지한다.
### Scenario 4: 유지 분리
- Given: 유지 준수가 확인됐다.
- When: 지표를 계산한다.
- Then: 행동 완주 분자·분모에 포함되지 않는다.

## Technical & Non-Functional Constraints
- 실제 24시간·30일 대기 없이 fake clock을 사용한다.
- 모든 금지 전이는 DB 변경 0건을 assertion한다.

## Definition of Done
- [ ] TC-FUNC-010A~G·TC-AC-C-01~03이 매핑됐다.
- [ ] 상태 조합·사유코드·멱등 suite가 green이다.
- [ ] 오분류 0건을 자동 assertion한다.

## Dependencies & Interactions
- Depends on: DATA-003, API-002·004, MOCK-001, 승인된 Outcome 상태전이 정책
- Blocks: 해당 로직 DoD, TEST-007
- 변경 전파: Outcome enum·상태전이·Fixture·KPI 산식

## Open Decisions
- 실제 카드 상태 의미와 보존 정책

## 결론
관측 신뢰도가 낮을 때 실패로 단정하지 않는 핵심 품질을 상태전이 테스트로 고정한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
