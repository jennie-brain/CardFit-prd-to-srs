---
name: CardFit Test Task
about: 세 시나리오 계산·Net Benefit·배분의 결정론적 회귀
title: "[Test] TEST-002: 계산·게이팅·배분 회귀 테스트"
labels: 'test, calculation, regression, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — TEST-002 계산·게이팅·배분 회귀 테스트

## Summary
- 목적: 계산 정확성·결정성·게이팅·배분 불변조건과 Rule 최신성 경계를 200개 이상 사례로 증명한다.
- REQ: REQ-FUNC-004~006, REQ-NF-003·006, REQ-GR-005

## References (Spec & Context)
- 계약: DATA-002, API-003, MOCK-001
- 로직: COMMAND-003·007

## Scope
- In: 순수 계산, 세 시나리오, 게이팅, 배분, Rule 회귀·최신성과 결과 hash
- Out: UI 시각 검증, 미승인 계산 정책의 임의 expected 값

## Task Breakdown
- [ ] golden vector와 expected hash를 정의한다.
- [ ] LOW·BASE·HIGH 독립 결과·BASE 기본값을 테스트한다.
- [ ] 실적구간·한도·연회비·제외항목 경계를 200건 이상 생성한다.
- [ ] 임계값 직전·동일·직후 게이팅을 테스트한다.
- [ ] 배분 합계와 Rule 변경 후보 만료를 테스트한다.
- [ ] fake clock으로 Rule 갱신 7일·30일 경계와 새 Rule 활성화 후 복구를 테스트한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 결정론
- Given: 같은 입력·Rule·clock이다.
- When: 반복 계산한다.
- Then: 결과 hash 일치율 100%다.
### Scenario 2: 유지 게이트
- Given: 순혜택이 임계 미달이다.
- When: 계산한다.
- Then: 유지 반환 100%, 변경 제안 0건이다.
### Scenario 3: 배분 오류
- Given: 합계가 원본과 다른 변형 결과다.
- When: 검증한다.
- Then: 공개를 거부한다.
### Scenario 4: Rule 회귀
- Given: 새 Rule version이다.
- When: 200개 이상 회귀를 실행한다.
- Then: 오류율 ≤0.1%, 불일치 0건이어야 활성화 가능하다.
### Scenario 5: Rule 최신성
- Given: Rule 갱신 지연이 7일 또는 30일 경계에 있다.
- When: 계산 가능성을 평가한다.
- Then: 7일 초과에는 경고하고 30일 초과에는 해당 카드를 계산에서 제외하며 경고 누락은 0건이다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: DATA-002, API-003/005, COMMAND-003/007 계산·Rule 계약
- Writes: 테스트 전용 계산 결과와 golden vector artifact
- Side Effects: 없음
- Transaction Boundary: 각 golden vector 실행은 독립 fixture transaction
- Idempotency: input hash·rule version 기준 동일 결과 보장
- Retry Policy: 계산 테스트는 자동 재시도하지 않음

## Verification Gates
- Test Gate: 결정론·게이팅·배분·Rule freshness 200건 이상 suite 통과
- NFR Gate: NFR-002 재현성·오차 기준, NFR-006 Rule freshness 검증
- Evidence Location: golden vector, expected hash, fake-clock report

- Gemini·네트워크 없이 순수 함수로 실행 가능해야 한다.
- 미확정 SRS 8.5 값에는 승인 전 expected 결과를 만들지 않는다.

## Definition of Done
- [ ] TC-FUNC-004~006·TC-AC-A-01~03·TC-AC-GATE-01이 매핑됐다.
- [ ] 200건 이상 경계 suite와 실패 재현 seed가 저장됐다.
- [ ] 회귀 결과를 Rule 변경 PR/Issue에 첨부할 수 있다.
- [ ] Rule 최신성 경계와 복구 결과가 REQ-NF-006·REQ-GR-005에 추적된다.

## Dependencies & Interactions
- Depends on: DATA-001·002, API-003·005, MOCK-001, 승인된 계산·Rule 최신성 정책
- Blocks: COMMAND-003·007 DoD, NFR-002, TEST-006
- 변경 전파: 계산 정책·Rule·Fixture·expected hash

## Open Decisions
- Golden vector 승인자와 오류율 산식

## 결론
CardFit의 가장 중요한 계산 주장을 반복 가능한 증거로 만든다.

## 출처

## Decision Log
- 2026-08-26: Step 3 AC를 golden vector·fake clock 기반 회귀 테스트로 변환하고 정책 미확정값은 expected로 임의 고정하지 않음.
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
