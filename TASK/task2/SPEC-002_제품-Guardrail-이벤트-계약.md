---
name: CardFit Specification Task
about: 제품 퍼널과 Guardrail 계측 이벤트의 선행 계약
title: "[Spec] SPEC-002: 제품·Guardrail 이벤트 계약"
labels: 'spec, analytics, contract, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — SPEC-002 제품·Guardrail 이벤트 계약

## Summary

- 목적: COMMAND-010 구현 전에 제품 퍼널·계산 품질·Guardrail 이벤트의 이름, payload, 멱등성과 개인정보 경계를 고정한다.
- 사용자 가치: 제품 성공과 위험을 동일한 분모·상태 기준으로 측정하고 오조회·오인 추천을 조기에 중단할 수 있다.

## References (Spec & Context)

- SRS: 5.4, 9.1~9.3, REQ-METRIC-001~011, REQ-GR-001~006, REQ-NF-009
- 데이터 계약: DATA-001~003
- 소비자: COMMAND-010, QUERY-003·004, MOCK-001, NFR-006, UI-009

## Scope

### In Scope

- 이벤트 이름, 발생 조건, payload schema, schema version
- 사용자·계산·선택·Outcome 상관키의 가명화 규칙
- 이벤트 중복 방지 키와 전송 실패·재처리 의미
- KPI·Guardrail 분자·분모와 이벤트 매핑
- M1/M2 이벤트 활성화 범위

### Out of Scope

- 이벤트 저장·전송 코드
- 대시보드 UI와 경보 채널 구현
- 미승인 KPI 목표값의 임의 확정

## Execution Contract

- Reads: SRS KPI·Guardrail 정의, DATA-001~003과 승인된 정책 Decision Log
- Writes: versioned event catalog, payload schema와 KPI·Guardrail 매핑표
- Side Effects: None. 이벤트를 실제 기록하거나 외부 분석 도구로 전송하지 않는다.
- Transaction Boundary: None. 계약 문서 작성 TASK다.
- Idempotency: 이벤트 종류별 멱등 키 구성요소를 계약으로 정의한다.
- Retry Policy: 전송 구현의 재시도 의미만 정의하며 실행하지 않는다.

## Task Breakdown

- [ ] M1/M2 이벤트 카탈로그와 발생 주체를 정의한다.
- [ ] payload 허용 필드·금지 필드·가명 상관키를 정의한다.
- [ ] KPI·Guardrail별 분자·분모와 중복 제거 규칙을 이벤트에 연결한다.
- [ ] 멱등 키, schema version과 재처리 규칙을 정의한다.
- [ ] 합성 정상·중복·누락·중단 Fixture를 작성한다.
- [ ] COMMAND-010과 QUERY-003·004가 소비할 계약 checksum을 고정한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 동일 행동의 중복 전송

- Given: 동일 사용자 행동과 멱등 키의 이벤트가 두 번 전달된다.
- When: 이벤트 계약을 검증한다.
- Then: KPI 분자·분모에는 한 번만 반영되도록 식별할 수 있다.

### Scenario 2: 금지 필드 포함

- Given: 원본 거래내역, 카드번호 또는 내부 사용자 ID가 payload에 포함됐다.
- When: schema validation을 수행한다.
- Then: 이벤트를 거부하고 외부 전송 건수는 0건이다.

### Scenario 3: M1/M2 분리

- Given: M1 환경에서 M2 Outcome 이벤트가 발생하지 않는다.
- When: M1 KPI를 집계한다.
- Then: M2 이벤트 부재가 M1 KPI의 분모를 왜곡하지 않는다.

## Technical & Non-Functional Constraints

- 이벤트 payload에는 직접 식별정보와 원본 금융 거래를 포함하지 않는다.
- 이벤트 시간, schema version, source와 멱등 키를 필수로 둔다.
- 목표값이 미승인인 KPI는 측정만 하고 배포 Gate로 사용하지 않는다.

## Verification Gates

- Test Gate: TEST-005의 비밀정보·소유권 검사와 TEST-006·007의 이벤트 중복·누락 검사가 통과해야 한다.
- NFR Gate: NFR-004·006의 감사·비용·Guardrail 기준을 충족해야 한다.
- Evidence Location: event catalog, JSON schema, KPI 매핑표와 합성 Fixture validation 결과

## Definition of Done

- [ ] M1/M2 이벤트 카탈로그와 schema가 고정됐다.
- [ ] 모든 활성 KPI·Guardrail이 이벤트 또는 근거 있는 N/A에 연결됐다.
- [ ] 금지 필드와 멱등성 검사가 자동화 가능하다.
- [ ] COMMAND-010, MOCK-001, QUERY-003·004와 NFR-006의 참조 버전이 일치한다.

## Dependencies & Interactions

- Depends on: DATA-001·002
- Depends on(M2 Extension): DATA-003
- Blocks: COMMAND-010, MOCK-001, QUERY-003·004, NFR-006, UI-009
- External Blockers: KPI·Guardrail 산식 승인, 미승인 목표값, 오조회·중단 책임자와 알림 채널
- Parallelizable with: SPEC-001
- Change Propagation: 이벤트 변경 시 Command, Query, Mock, TEST, NFR과 관리자 UI를 함께 갱신한다.

## Open Decisions

- [ ] 이벤트 저장소와 전송 provider
- [ ] 이벤트 보존기간과 삭제 주기
- [ ] 알림 채널·on-call 책임자

## 결론

SPEC-002는 계측 계약을 기록 Logic보다 먼저 고정해 KPI와 Guardrail의 분모·중복·개인정보 의미를 일관되게 유지한다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — 제품·Guardrail 이벤트 계약을 독립 SPEC으로 분리

- 결정: COMMAND-010의 이벤트 schema 책임을 SPEC-002로 분리하고 기록 Logic보다 먼저 승인한다.
- 근거: 이벤트 계약이 Command에만 있으면 MOCK-001과 KPI·NFR이 Step 2 Logic에 역의존한다.
- 영향: COMMAND-010은 SPEC-002를 구현하고 이벤트 이름·payload·분모를 임의 변경하지 않는다.
