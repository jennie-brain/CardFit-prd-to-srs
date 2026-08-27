---
name: CardFit API Contract Task
about: 미래지출·제약·조합 선택 Server Action 계약
title: "[API] API-002: 입력·선택 Server Action 계약"
labels: 'api, server-action, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — API-002 입력·선택 Server Action 계약

## Summary

- 목적: `saveFutureSpend`, `saveConstraints`, `selectPlan`의 입력·결과·오류·인가 계약을 정의한다.
- 사용자 가치: 미래지출과 제약이 안전하게 저장되고 유효한 계산 후보만 선택된다.

## References (Spec & Context)

- SRS: REQ-FUNC-001A/B·003A/B·005, 6.2.2, 8.10
- 선행: DATA-001·002

## Scope

- 세 Server Action의 입력 schema, 성공 결과, field error, domain error
- 세션·사용자 소유권 재검증
- 자유 카테고리 정규화, 금액·범위·제약 상한 검증
- 만료·미소유·임계 미달 후보 선택 거부
- 재검증 대상 경로 또는 tag 반환 규칙

## Execution Contract

- Reads: DATA-001·002와 세션·소유권·입력 validation 계약
- Writes: 세 Server Action의 요청·응답·오류 schema
- Side Effects: 계약 작성은 `None`. 실제 저장·선택은 COMMAND-001·004가 담당한다.
- Transaction Boundary: Action별 단일 Command 호출 경계를 정의한다.
- Idempotency: 저장 version과 `selection_id` 기반 중복 요청 의미를 정의한다.
- Retry Policy: 네트워크 오류만 재시도하며 validation·인가·만료 오류는 재시도하지 않는다.

## Task Breakdown

- [ ] 공용 입력 schema와 Action 결과 union을 정의한다.
- [ ] `saveFutureSpend`의 단일·범위 입력과 자유 카테고리 규칙을 명세한다.
- [ ] `saveConstraints`의 카드 수·연회비·신규발급 값을 명세한다.
- [ ] `selectPlan`의 소유권·만료·상태·멱등 조건을 명세한다.
- [ ] 클라이언트 오류와 서버 로그 오류를 분리한다.
- [ ] 후행 계산·이행 흐름이 소비할 식별자를 정의한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 유효한 입력 저장

- Given: 로그인 사용자가 유효한 미래지출과 제약조건을 제출한다.
- When: 각 Server Action을 호출한다.
- Then: 사용자 소유 레코드만 저장되고 성공 결과와 갱신 식별자가 반환된다.

### Scenario 2: 비정상 금액·범위

- Given: 음수·비숫자·상한 초과 또는 최소>예상>최대 위반 입력이다.
- When: 저장 Action을 호출한다.
- Then: field error를 반환하고 DB 쓰기 건수는 0건이다.

### Scenario 3: 타 사용자 또는 만료 후보 선택

- Given: 후보가 현재 사용자 소유가 아니거나 만료 상태다.
- When: `selectPlan`을 호출한다.
- Then: 선택을 거부하고 Outcome 기준선은 생성되지 않는다.

## Technical & Non-Functional Constraints

- Server Action은 공개 요청 경계와 동일하게 세션·소유권·입력을 서버에서 검증한다.
- Prisma와 schema의 서버 전용 코드가 Client bundle로 직렬화되지 않아야 한다.
- 오류 응답에 내부 ID·stack·민감 입력을 포함하지 않는다.
- 조합 선택은 카드 신청·해지 실행이 아니라 측정 기준선 생성의 시작점이다.

## Verification Gates

- Test Gate: TEST-001·004·005의 Action 계약·인가·멱등성 검사가 통과해야 한다.
- NFR Gate: NFR-004의 소유권·민감정보·오조회 기준을 충족해야 한다.
- Evidence Location: versioned Action schema, 오류 코드표와 계약 테스트 결과

## Definition of Done

- [ ] 세 Action 계약과 오류 코드가 문서화됐다.
- [ ] 정상·경계·소유권 위반 계약 검증이 통과한다.
- [ ] 입력 schema를 UI와 서버가 공유하되 서버 검증을 생략하지 않는다.
- [ ] API-003 계산 요청과 DATA-003 선택 기준선에 필요한 ID가 연결됐다.

## Dependencies & Interactions

- Depends on: DATA-001·002
- Blocks: COMMAND-001·004, DATA-003, UI-003·007, TEST-001·004
- Interacts with: API-003, REQ-SEC-001·002
- 변경 전파: 입력 필드 변경 시 DATA-001, API-003 요청, Mock, UI, 테스트를 갱신한다.

## Open Decisions

- [ ] Action 결과의 공통 오류 코드와 localization 위치
- [ ] FutureSpendPlan 저장 단위(항목별 Action 또는 일괄 저장)
- [ ] 유지 결론 선택 시 PlanCandidate 표현 방식

## 결론

API-002는 UI 변경 명령을 Server Action으로 한정하면서도 모든 입력을 서버에서 다시 검증하는 계약이다. 선택은 실행 대행이 아니라 후속 측정을 위한 명시적 사용자 결정으로 취급한다.

## 출처

- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `docs/product/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — 새 TASK 템플릿 적용

- 결정: API-002에 Execution Contract와 Verification Gates를 추가한다.
- 근거: UI 요청 계약과 실제 상태 변경 Command의 책임을 분리하고 멱등성을 명시해야 한다.
- 영향: COMMAND-001·004는 API-002 schema를 구현하며 재정의하지 않는다.
