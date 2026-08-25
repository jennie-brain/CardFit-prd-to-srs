---
name: CardFit Query Task
about: 계산 결과·근거·단계 전환 제안 조회
title: "[Query] QUERY-002: 계산 결과·근거·단계 제안 조회"
labels: 'query, calculation, evidence, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — QUERY-002 계산 결과·근거·단계 제안 조회

## Summary
- 목적: 세 시나리오 결과, 차액, 배분, 근거와 선택적 단계 제안을 소유권 검증 후 제공한다.
- REQ: REQ-FUNC-005·007·011

## References (Spec & Context)
- 계약: DATA-002, API-003
- 선행: COMMAND-003

## Scope
- LOW·BASE·HIGH 결과와 BASE 기본 표시
- 근거 ≥6, 미반영 비용, 기준일, Rule 버전
- Could 단계 제안 정렬
- 선택적 AI 설명은 별도 상태로 합성하되 계산을 변경하지 않음

## Task Breakdown
- [ ] 계산 소유권·성공·만료 상태를 검증한다.
- [ ] 결과 ViewModel과 Evidence DTO를 조립한다.
- [ ] 근거 수를 검증하고 미달 시 거부한다.
- [ ] 카드별 기여 순혜택 정렬을 적용한다.
- [ ] AI unavailable 시 정형 설명 fallback을 반환한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 결과
- Given: 성공 계산이 있다.
- When: 조회한다.
- Then: 세 시나리오·원 단위 차액·배분을 추가 계산 없이 반환한다.
### Scenario 2: 근거 공개
- Given: 근거가 6개 이상이다.
- When: 펼친다.
- Then: 제외조건·기준일·Rule 버전·미반영 비용을 누락 없이 반환한다.
### Scenario 3: 근거 미달
- Given: 근거가 6개 미만이다.
- When: 조회한다.
- Then: p95 500ms 이내 거부하고 불완전 근거를 노출하지 않는다.
### Scenario 4: 단계 제안 동률
- Given: 카드별 기여 순혜택이 같다.
- When: 정렬한다.
- Then: 확정된 동률 규칙을 적용하거나 미확정이면 기능을 활성화하지 않는다.

## Technical & Non-Functional Constraints
- Query는 계산 결과를 수정하지 않는다.
- AI 장애가 결과·근거 가용성을 낮추지 않는다.
- 타 사용자 calculation 조회 0건이다.

## Definition of Done
- [ ] TEST-003 근거·AI·정렬 테스트가 통과한다.
- [ ] TEST-005 소유권 테스트가 통과한다.
- [ ] TEST-006 M1 결과 E2E가 통과한다.
- [ ] NFR-001 evidence 성능 기준을 충족한다.

## Dependencies & Interactions
- Depends on: DATA-002, API-003, COMMAND-003
- Blocks: 결과·근거 UI, COMMAND-004
- 변경 전파: API-003·MOCK-001·TEST-003·006·NFR-001

## Open Decisions
- REQ-FUNC-011 동률 처리, AI 캐시 TTL

## 결론
사용자에게 계산 결론뿐 아니라 재현 가능한 근거와 조건부 제안을 읽기 전용으로 전달한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

