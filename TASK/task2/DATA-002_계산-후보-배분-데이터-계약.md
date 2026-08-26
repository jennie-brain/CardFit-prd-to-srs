---
name: CardFit Data Task
about: CardFit 계산·조합 후보·배분의 불변 스냅샷 계약
title: "[Data] DATA-002: 계산·후보·배분 데이터 계약"
labels: 'data, prisma, calculation, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — DATA-002 계산·후보·배분 데이터 계약

## Summary

- 목적: 계산 재현성과 유지·변경 결론의 근거가 되는 `Calculation`, `PlanCandidate`, `Allocation` 계약을 정의한다.
- 사용자 가치: 같은 입력과 Rule로 같은 결과를 재현하고, 사용자가 차액·배분·근거를 확인할 수 있다.

## References (Spec & Context)

- SRS: 3.6.1~3.6.2, 4.1 `REQ-FUNC-004~007`, 6.2.1~6.4, REQ-DATA-006
- PRD: F-03·04·05·06 및 LOW·BASE·HIGH 시나리오
- 선행: DATA-001

## Scope

- `Calculation`, `PlanCandidate`, `Allocation`의 PK/FK·상태·index
- LOW·BASE·HIGH 시나리오별 독립 결과와 BASE 기본 노출을 표현하는 계약
- 입력·Rule·결과 해시와 적용 `rule_version` 불변 스냅샷
- 유지 결론과 변경 후보를 모두 정상 결과로 표현하는 구조
- 근거 6항목과 미반영 비용을 생성할 수 있는 Evidence DTO 기준
- M1 최소 저장 필드와 M2 확장 필드 구분

## Execution Contract

- Reads: DATA-001과 승인된 계산·Rule 정책
- Writes: `Calculation`, `PlanCandidate`, `Allocation` schema·migration·Fixture 계약
- Side Effects: Local schema 변경. 계산 실행과 Production 쓰기는 `None`
- Transaction Boundary: 계산·후보·배분 관계가 하나의 migration 기준선에서 함께 유효해야 한다.
- Idempotency: canonical snapshot과 hash 계약은 동일 입력에서 동일 결과를 만든다.
- Retry Policy: schema 검증 실패는 자동 재시도하지 않고 계약 수정 후 재실행한다.

## Task Breakdown

- [ ] 3개 시나리오와 후보 관계를 ERD·데이터 사전에 반영한다.
- [ ] `Calculation.status` 성공·실패·부분의 전이와 노출 가능 조건을 정의한다.
- [ ] Net Benefit 비용 구성요소와 `threshold_passed` 필드를 정의한다.
- [ ] Allocation 합계 불변조건과 category 정규화 규칙을 정의한다.
- [ ] 결과·입력·Rule hash 생성용 canonical serialization 계약을 정의한다.
- [ ] `rule_version` 변경·30일 경과 시 후보 만료 규칙을 정의한다.
- [ ] M1 저장 최소화와 M2 스냅샷 확장을 migration 단계로 분리한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 세 시나리오 결과 저장

- Given: 유효한 미래지출과 적용 가능한 Rule이 있다.
- When: LOW·BASE·HIGH 계산 결과를 저장한다.
- Then: 각 시나리오가 독립 후보·배분을 가지며 BASE가 기본 표시 대상으로 식별된다.

### Scenario 2: 배분 합계 불일치

- Given: Allocation 합계가 해당 시나리오의 미래지출 합계와 다르다.
- When: 결과 저장을 시도한다.
- Then: 저장 또는 공개를 거부하고 불일치 결과 노출은 0건이다.

### Scenario 3: 부분 계산

- Given: 세 시나리오 중 하나라도 필수 데이터가 없거나 계산에 실패한다.
- When: Calculation 상태를 확정한다.
- Then: 전체 계산을 `부분`으로 기록하고 세 탭의 추천 결과를 모두 노출하지 않는다.

### Scenario 4: Rule 변경 후 후보 만료

- Given: 기존 후보가 참조한 `rule_version`보다 새 버전이 활성화된다.
- When: 후보 유효성을 평가한다.
- Then: 기존 후보는 `만료`가 되고 선택할 수 없다.

## Technical & Non-Functional Constraints

- 계산값은 Gemini 출력이 아닌 결정론적 TypeScript 결과만 저장한다.
- 동일 입력·동일 Rule의 결과 hash 일치율은 100%다.
- M1은 계산 ID, 결과 hash, Rule 버전, 시각, 오류 코드만 보존하며 민감 입력 스냅샷 장기 저장을 금지한다.
- 금액 정밀도는 DATA-001과 동일한 계약을 사용한다.
- Evidence는 최소 6개 항목을 구성하지 못하면 공개 가능한 DTO로 생성하지 않는다.

## Verification Gates

- Test Gate: TEST-002·003의 계산·배분·Evidence 계약 검사가 통과해야 한다.
- NFR Gate: NFR-001·002의 성능·결정성 기준을 지원해야 한다.
- Evidence Location: schema·migration, canonical serialization 명세, Fixture와 hash 비교 결과

## Definition of Done

- [ ] schema·migration·관계·상태전이 검증이 통과한다.
- [ ] 세 시나리오, 유지 결론, 변경 후보, 부분 결과 Fixture를 표현할 수 있다.
- [ ] 불변 hash와 Allocation 합계 검증 방식이 문서화됐다.
- [ ] API-003이 사용할 DTO와 오류 상태가 고정됐다.
- [ ] SRS 8.5 미확정값이 schema default로 삽입되지 않았다.

## Dependencies & Interactions

- Depends on: DATA-001
- Blocks: API-002·003, MOCK-001, COMMAND-003, QUERY-002, TEST-002
- Interacts with: REQ-FUNC-004~007, REQ-NF-001~003·006
- 변경 전파: 시나리오·상태·hash 계약 변경 시 API-003, MOCK-001, TEST와 결과 UI를 갱신한다.

## Open Decisions

- [ ] SRS 8.5 Net Benefit 9개 정책 항목
- [ ] `Calculation.input_snapshot`의 M1 논리 모델 표기와 실제 최소 저장 정책 정합화
- [ ] 3개 시나리오의 배율과 사용자 범위 입력 우선순위
- [ ] Evidence를 영속 엔터티로 둘지 계산 스냅샷에서 파생할지

## 결론

DATA-002는 CardFit의 핵심 가치인 세 예상 시나리오와 유지·변경 판단을 재현 가능한 데이터 계약으로 만든다. 계산 정책이 확정되지 않은 부분은 구조적으로 수용하되 기본값을 임의로 확정하지 않는다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — 새 TASK 템플릿 적용

- 결정: DATA-002에 Execution Contract와 Verification Gates를 추가한다.
- 근거: 계산 데이터 계약의 읽기·쓰기·원자성·결정성 및 완료 증거를 기계 판독 가능하게 관리해야 한다.
- 영향: 후행 API·Logic·TEST는 DATA-002의 canonical serialization과 hash 계약을 재정의하지 않는다.
