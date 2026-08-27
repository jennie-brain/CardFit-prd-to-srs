---
name: CardFit Specification Task
about: Query와 Frontend가 공유하는 읽기 ViewModel·오류·상태 기준선
title: "[Spec] SPEC-001: 읽기 ViewModel·오류·상태 계약"
labels: 'spec, contract, viewmodel, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — SPEC-001 읽기 ViewModel·오류·상태 계약

## Summary

- 목적: QUERY-001~004와 Frontend·Mock이 공유할 versioned ViewModel, 상태와 오류 envelope를 Logic 구현 전에 고정한다.
- 사용자 가치: 백엔드 구현 여부와 무관하게 동일한 로딩·빈 상태·부분·오래됨·오류·성공 상태를 일관되게 표현한다.
- 단계: M1 온보딩·계산·운영 ViewModel, M2 Outcome·AI 확장

## References (Spec & Context)

- SRS: 3.1~3.6, 4.1, 6.1, 8.10, 9.4~9.5
- 데이터 계약: DATA-001~003
- API 계약: API-001~005
- 소비자: QUERY-001~004, MOCK-001, UI-002~009

## Scope

### In Scope

- `OnboardingView`, `CalculationResultView`, `OutcomeView`, `OperationsView` schema
- `loading`, `empty`, `partial`, `stale`, `error`, `unavailable`, `success` 상태 의미
- 공통 오류 envelope, 사용자 복구 행동, 데이터 기준일과 누락 범위
- M1/M2 필드의 optionality, schema 버전과 호환성 규칙

### Out of Scope

- DB 조회와 조합 로직
- React 컴포넌트와 화면 배치
- Command 요청 DTO와 외부 Platform Adapter 구현

## Execution Contract

- Reads: DATA-001~003, API-001~005의 승인된 schema와 SRS 상태 정의
- Writes: versioned ViewModel schema와 상태·오류 사전 문서
- Side Effects: None. 런타임 DB·외부 API·사용자 상태를 변경하지 않는다.
- Transaction Boundary: None. 계약 문서 작성 TASK다.
- Idempotency: 동일 기준선 입력으로 생성한 schema checksum이 동일해야 한다.
- Retry Policy: None. 계약 충돌은 재시도하지 않고 External Blocker로 전환한다.

## Task Breakdown

- [ ] 네 ViewModel의 필드·타입·필수 여부와 소유 Query를 정의한다.
- [ ] 공통 상태와 도메인별 상태의 중복·우선순위를 정의한다.
- [ ] 오류 코드, 사용자 메시지 키, 복구 행동과 HTTP/domain 상태를 연결한다.
- [ ] M1과 M2 필드를 분리하고 하위 호환성 규칙을 정의한다.
- [ ] TypeScript schema와 합성 예시 payload를 작성한다.
- [ ] MOCK-001과 UI 소비 계약에 schema checksum을 연결한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: Mock과 Query의 동일 계약

- Given: 동일 ViewModel 버전과 Fixture ID를 사용한다.
- When: Mock 응답과 Query 응답을 schema validation한다.
- Then: 필드·상태·오류 계약의 차이는 0건이다.

### Scenario 2: 부분 데이터와 빈 데이터 구분

- Given: 일부 기관 데이터 누락과 실제 데이터 없음 사례가 각각 있다.
- When: ViewModel을 생성한다.
- Then: `partial`과 `empty`를 서로 다른 상태·복구 행동으로 반환한다.

### Scenario 3: M2 미활성 상태

- Given: M1 환경에서 Outcome 또는 AI 기능이 비활성화돼 있다.
- When: M1 ViewModel을 검증한다.
- Then: M2 필드 부재가 schema 오류를 만들지 않고 M1 핵심 결과는 유지된다.

## Technical & Non-Functional Constraints

- 계약은 TypeScript에서 단일 타입 원천으로 생성하거나 동일 checksum으로 검증한다.
- 내부 DB 키, 자격정보와 원본 금융 응답을 ViewModel에 포함하지 않는다.
- 상태 이름은 UX가 재정의하지 않고 SPEC-001을 기준으로 사용한다.

## Verification Gates

- Test Gate: TEST-001~005의 계약·상태 validation 초안과 MOCK-001 schema validation이 통과해야 한다.
- NFR Gate: NFR-004의 오조회·민감정보 노출 기준을 충족해야 한다.
- Evidence Location: versioned schema 파일, 예시 payload, schema checksum과 계약 테스트 결과

## Definition of Done

- [ ] 네 ViewModel과 공통 오류·상태 schema가 고정됐다.
- [ ] QUERY-001~004, MOCK-001과 UI-002~009가 같은 버전을 참조한다.
- [ ] M1/M2 호환성 검사가 통과한다.
- [ ] 상태·오류 변경 전파 대상이 문서화됐다.

## Dependencies & Interactions

- Depends on: DATA-001·002, API-001·002·003·005
- Depends on(M2 Extension): DATA-003, API-004
- Blocks: QUERY-001~004, MOCK-001, UX-001~004·006·007, UI-002~009
- External Blockers: 승인 문구, 동률 처리와 Outcome 관측 상태의 미확정 정책
- Parallelizable with: SPEC-002
- Change Propagation: schema 변경 시 Query, Mock, UX, UI와 TEST를 함께 갱신한다.

## Open Decisions

- [ ] schema 구현 도구와 버전 배포 방식
- [ ] 오류 메시지 localization key 소유 위치
- [ ] M1/M2 schema를 단일 union으로 둘지 별도 버전으로 둘지

## 결론

SPEC-001은 읽기 계약을 Logic에서 분리해 Mock과 Frontend가 Query 구현 전에 동일 기준으로 작업할 수 있게 한다.

## 출처

- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `docs/product/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — 읽기 ViewModel 계약을 독립 SPEC으로 분리

- 결정: QUERY-001~004가 구현할 ViewModel·오류·상태 계약을 SPEC-001이 선행 소유한다.
- 근거: Query가 계약과 Logic을 함께 소유하면 MOCK-001이 Step 2 구현에 역의존해 Contract 단계를 독립적으로 완료할 수 없다.
- 영향: Query는 SPEC-001을 구현하며 계약을 임의 변경하지 않는다. ViewModel 변경은 SPEC-001부터 승인받는다.
