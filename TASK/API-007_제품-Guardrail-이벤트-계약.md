---
name: CardFit API Contract Task
about: KPI·퍼널·Guardrail 측정을 위한 이벤트 계약
title: "[API] API-007: 제품·Guardrail 이벤트 계약"
labels: 'api, analytics, observability, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — API-007 제품·Guardrail 이벤트 계약

## Summary
- 목적: SRS KPI와 Guardrail을 산출하는 제품·품질 이벤트의 이름, payload, 중복 제거, 개인정보 경계를 정의한다.
- REQ: 5.4 KPI·Guardrail 추적성, 9.1~9.3

## References (Spec & Context)
- 이벤트: `onboarding_started/completed`, `result_viewed`, `scenario_tab_viewed`, `evidence_panel_opened`, `plan_selected`, Outcome·Guardrail 이벤트
- 소비자: COMMAND-010, QUERY-003·004, UI-002~009

## Scope
- event ID·schema version·occurred_at·anonymous/user scope·deduplication key
- KPI 분자·분모에 필요한 최소 필드와 금지 필드
- 외부 분석 SaaS 선택과 광고 추적은 범위 밖

## Task Breakdown
- [ ] 이벤트 카탈로그와 각 KPI 매핑을 정의한다.
- [ ] 중복·재전송·순서 역전 처리 규칙을 정의한다.
- [ ] 계산·Outcome·Guardrail 이벤트의 최소 payload를 정의한다.
- [ ] 원본 금융 데이터·자유 입력 원문·비밀정보를 금지한다.
- [ ] M1 DB event log와 실제 분석 Adapter 교체 계약을 정의한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 선택 이벤트
- Given: 사용자가 유효 조합을 선택한다.
- When: `plan_selected`를 기록한다.
- Then: 시나리오·후보·event ID가 포함되고 중복 선택은 한 번만 집계된다.
### Scenario 2: 유지 결론
- Given: BASE 결과가 유지다.
- When: `result_viewed`를 기록한다.
- Then: 선택률 분모 제외 여부를 산출할 필드가 포함된다.
### Scenario 3: 금지 payload
- Given: 자유 입력 원문이나 카드 식별정보가 payload에 있다.
- When: 검증한다.
- Then: 이벤트 기록을 거부하고 민감값을 로그에 남기지 않는다.

## Technical & Non-Functional Constraints
- 이벤트 기록 실패가 계산 결과를 실패시키지 않되 실패 상태는 Guardrail에서 관측한다.
- schema 변경은 하위 호환·버전 증가 방식으로 처리한다.

## Definition of Done
- [ ] KPI·Guardrail 전 항목이 이벤트 또는 DB 원천에 매핑됐다.
- [ ] schema·예시·중복키·금지필드가 확정됐다.
- [ ] COMMAND-010과 TEST-006·007이 같은 계약을 사용한다.

## Dependencies & Interactions
- Depends on: DATA-001~003, SRS KPI 산식
- Blocks: COMMAND-010, KPI/Guardrail 조회, UI Analytics 연결
- 변경 전파: QUERY-003·004·NFR-006·UI·TEST

## Open Decisions
- 익명 ID 정책, 이벤트 보존기간, 실제 Analytics Adapter

## 결론
제품 이벤트를 UI별 임의 로깅이 아니라 KPI 정의와 연결된 공통 계약으로 고정한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`
