---
name: CardFit Command Task
about: KPI·퍼널·Guardrail 이벤트 계약과 멱등 기록
title: "[Command] COMMAND-010: 제품·Guardrail 이벤트 계약·기록"
labels: 'command, analytics, observability, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-010 제품·Guardrail 이벤트 계약·기록

## Summary
- 목적: 제품·품질 이벤트의 schema와 개인정보 경계를 정의하고 사용자 행동과 품질·비용 상태를 멱등하게 기록해 SRS KPI와 Guardrail을 산출한다.
- REQ: REQ-METRIC-001~006·008~011, REQ-GR-001~006, REQ-NF-009 (`REQ-METRIC-007`은 Deferred)

## References (Spec & Context)
- 이벤트: `onboarding_started/completed`, `result_viewed`, `scenario_tab_viewed`, `evidence_panel_opened`, `plan_selected`, Outcome·Guardrail 이벤트
- 소비자: QUERY-003·004, NFR-006, UI-002~009

## Scope
- event ID·schema version·occurred_at·anonymous/user scope·deduplication key
- KPI 분자·분모에 필요한 최소 필드와 금지 필드
- M1 DB event log, schema validation, deduplication, 실패 계측
- 실제 Analytics Adapter 전송은 교체 가능한 후속 구현
- 광고 프로파일링과 원본 금융 데이터 기록은 범위 밖

## Task Breakdown
- [ ] 이벤트 카탈로그와 각 KPI·Guardrail의 이벤트/DB 원천 매핑을 정의한다.
- [ ] 계산·Outcome·Guardrail 이벤트의 최소 payload와 하위 호환 version 규칙을 정의한다.
- [ ] 이벤트 schema·version·금지필드를 서버에서 검증한다.
- [ ] event ID·deduplication key로 중복을 방지한다.
- [ ] 재전송·순서 역전 처리 규칙을 정의한다.
- [ ] 사용자 기능 transaction과 이벤트 실패의 격리 정책을 적용한다.
- [ ] 실패 횟수와 마지막 성공 시각을 Guardrail 원천으로 기록한다.
- [ ] M1 DB log와 실제 Analytics Adapter 포트를 분리한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 기록
- Given: COMMAND-010의 versioned schema를 만족하는 event다.
- When: 기록한다.
- Then: 한 번 저장되고 관련 KPI Query에서 집계 가능하다.
### Scenario 2: 중복 전송
- Given: 같은 deduplication key다.
- When: 재전송한다.
- Then: 사용자 기능은 정상이고 이벤트 중복 집계는 0건이다.
### Scenario 3: 민감 payload
- Given: 금지된 금융 원문이 포함됐다.
- When: 기록한다.
- Then: 거부·마스킹하고 민감값을 저장하지 않는다.

### Scenario 4: 유지 결론 집계
- Given: BASE 결과가 유지다.
- When: `result_viewed`를 기록한다.
- Then: 선택률 분모 제외 여부를 산출할 필드가 포함된다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: SPEC-002 이벤트 schema, 제품 상태·실험 context
- Writes: Guardrail event와 audit metadata
- Side Effects: 분석 파이프라인 전송(비식별 payload)
- Transaction Boundary: 이벤트 outbox 기록을 도메인 변경과 원자 처리
- Idempotency: eventId 기반 dedupe
- Retry Policy: outbox relay만 재시도, schema 오류는 격리

## Verification Gates
- Test Gate: TEST-007 이벤트 schema·중복·순서 시나리오 통과
- NFR Gate: NFR-004 비식별·마스킹, NFR-006 전달 지연 검증
- Evidence Location: event contract test와 relay log

- Analytics 장애가 계산·선택의 사용자 성공을 롤백하지 않는다.
- 실패를 무시하지 않고 운영 상태로 관측한다.
- schema 변경은 하위 호환·버전 증가 방식으로 처리한다.

## Definition of Done
- [ ] TEST-005·006·007 이벤트 보안·중복·KPI 테스트가 통과한다.
- [ ] schema·예시·중복키·금지필드와 KPI·Guardrail 원천 매핑이 확정됐다.
- [ ] QUERY-003·004에서 필요한 모든 원천이 생성된다.
- [ ] NFR-006 대시보드가 이벤트 상태를 확인한다.

## Dependencies & Interactions
- Depends on: DATA-001~003, SRS KPI·Guardrail 산식
- Blocks: KPI·Guardrail 집계, UI Analytics 완료
- 변경 전파: 이벤트 카탈로그·Query·NFR·UI·TEST

## Open Decisions
- 이벤트 보존기간, 익명화, 실제 Analytics Adapter 시점

## 결론
분산된 UI 로깅 계약과 기록 로직을 하나의 검증 가능한 변경 단위로 통합한다.

## 출처

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. Guardrail 이벤트는 outbox와 eventId dedupe를 기본 계약으로 채택.
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`
