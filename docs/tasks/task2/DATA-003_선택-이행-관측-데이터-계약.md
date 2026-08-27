---
name: CardFit Data Task
about: 추천 선택·자기보고·플랫폼 관측의 독립 증거 계약
title: "[Data] DATA-003: 선택·이행·관측 데이터 계약"
labels: 'data, outcome, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — DATA-003 선택·이행·관측 데이터 계약

## Summary

- 목적: 추천안 선택 이후 자기보고와 플랫폼 관측을 독립 저장하고 행동 완료·유지·판정 불가를 엄격히 구분한다.
- 범위: `OutcomeLog`, `SelectionBaseline`, `OutcomeItem`, `OutcomeObservation`
- 단계: M1 시간 시뮬레이터 호환, M2 자동 관측

## References (Spec & Context)

- SRS: REQ-FUNC-010, 4.5, 6.2.1~6.2.4, ADR-002·005
- PRD: F-13, US-C AC1~AC7, ADR-008
- 선행: DATA-002, API-001

## Scope

- 선택 기준선, 발급·해지·유지 항목, 자기보고, 후속 관측, 집계 상태
- `selection_id` 멱등성 및 자기보고·검증 상태 독립성
- `PENDING`, 검증 완료, 유지, 미완료, `INCONCLUSIVE`, `UNAVAILABLE` 상태와 사유 코드
- High/Medium/Low/None 신뢰도와 카드 식별 결과
- 관측 최소화·증거 hash·삭제 대상 구분

## Execution Contract

- Reads: DATA-002, API-001과 승인된 관측·보존 정책
- Writes: Outcome 4개 엔터티의 schema·migration·Fixture 계약
- Side Effects: Local schema 변경. Production 자동 관측은 `None`
- Transaction Boundary: 선택 기준선과 OutcomeItem 생성은 하나의 원자적 계약으로 정의한다.
- Idempotency: `selection_id`와 관측 멱등 키의 unique 규칙을 사용한다.
- Retry Policy: 부분 관측은 덮어쓰지 않고 별도 Observation으로 누적한다.

## Task Breakdown

- [ ] 4개 엔터티와 enum·관계·unique/index를 Prisma에 설계한다.
- [ ] 자기보고와 검증 상태의 독립 전이 불변조건을 명세한다.
- [ ] 발급·해지·유지별 확정 조건과 행동 완주율 포함 여부를 정의한다.
- [ ] 24시간 이상 간격의 2회 정상 관측을 표현하는 조회 index를 정의한다.
- [ ] 동의·완전성·동기화·식별 충돌 사유 코드를 열거한다.
- [ ] 원본 응답 대신 판정 최소 필드와 `evidence_hash`만 저장하도록 제한한다.
- [ ] M1 시간 시뮬레이터 seed와 M2 migration 경계를 정의한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 자기보고 완료·관측 불가 병존

- Given: 사용자는 완료로 응답했지만 동의가 만료되어 플랫폼 검증을 할 수 없다.
- When: Outcome 상태를 저장한다.
- Then: 자기보고는 `COMPLETED`, 검증은 `UNAVAILABLE`로 독립 보존되며 미완료로 덮어쓰지 않는다.

### Scenario 2: 단일 미관측으로 해지 확정 금지

- Given: 명시적 해지 상태 없이 정상 조회 1회에서 카드가 보이지 않는다.
- When: 해지 항목을 판정한다.
- Then: 상태는 `PENDING` 또는 `INCONCLUSIVE`이고 `VERIFIED_COMPLETED`로 승격되지 않는다.

### Scenario 3: 유지 추천 준수

- Given: 유지 추천 대상 카드가 관측 종료 시 계속 존재한다.
- When: 결과를 집계한다.
- Then: `VERIFIED_MAINTAINED`로 기록하되 행동 완주율 분자·분모에서는 제외한다.

### Scenario 4: 중복 자기보고

- Given: 동일 `selection_id`로 두 번 제출한다.
- When: 저장을 시도한다.
- Then: 최초 1건만 유효하고 중복 집계는 0건이다.

## Technical & Non-Functional Constraints

- M1 합격 필수 기능이 아니며 자동 관측은 M2 승인 전 비활성화한다.
- 동의 목적·범위가 승인되지 않으면 Observation을 생성하지 않는다.
- 원본 마이데이터 응답 전체, 인증 토큰, 내부 사용자 ID를 저장하지 않는다.
- 관측 보존기간은 승인된 정책으로 설정하며 미확정 상태에서 임의 TTL을 배포하지 않는다.
- 판정 가능한 비율과 판정 불가율을 행동 완주율과 함께 산출할 수 있어야 한다.

## Verification Gates

- Test Gate: TEST-004·005의 상태전이·멱등성·소유권 검사가 통과해야 한다.
- NFR Gate: NFR-004·006의 보존·관측·Guardrail 기준을 충족해야 한다.
- Evidence Location: schema·migration, 상태전이표, M1/M2 Fixture validation 결과

## Definition of Done

- [ ] enum·상태전이·unique·관측 간격 검증이 완료됐다.
- [ ] 자기보고와 검증 결과의 모든 조합을 저장할 수 있다.
- [ ] 유지 항목이 행동 완주율에 혼입되지 않는 집계 계약이 정의됐다.
- [ ] M1 시뮬레이션 Fixture와 M2 관측 Fixture를 구분했다.
- [ ] 개인정보 최소화와 삭제 대상이 데이터 사전에 표시됐다.

## Dependencies & Interactions

- Depends on: DATA-002, API-001
- Blocks: API-004, COMMAND-004~006, QUERY-003, TEST-004·007, UI-008
- External Blockers: 동의·관측 목적 승인(M2), 관측 보존기간·삭제 정책 승인
- Interacts with: REQ-FUNC-010, REQ-NF-005·008, REQ-METRIC-005~011
- 변경 전파: 상태나 사유 코드 변경 시 API-004, MOCK-001, 집계·UI·TEST를 함께 변경한다.

## Open Decisions

- [ ] 관측 레코드·감사 로그의 승인된 보존기간과 삭제 주기
- [ ] 실제 Adapter가 제공하는 명시적 카드 상태 및 상품 식별 정확도
- [ ] `INCONCLUSIVE`와 `UNAVAILABLE` 사유 코드의 최종 목록
- [ ] M1 시간 시뮬레이터 데이터를 DB에 저장할지 테스트 Fixture로만 둘지

## 결론

DATA-003은 관측 불가를 실패로 간주하지 않고 자기보고와 외부 증거를 함께 보존한다. 이 계약이 확정되어야 추천 성과를 과장하지 않는 M2 계측이 가능하다.

## 출처

- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `docs/product/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — 새 TASK 템플릿 적용

- 결정: DATA-003에 Execution Contract와 Verification Gates를 추가한다.
- 근거: 선택·자기보고·관측의 원자성·멱등성과 개인정보 Gate를 구현 전에 고정해야 한다.
- 영향: 자동 관측은 External Blocker 승인 전 활성화하지 않는다.
