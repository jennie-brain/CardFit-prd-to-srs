---
name: CardFit Command Task
about: KPI·퍼널·Guardrail 이벤트의 멱등 기록
title: "[Command] COMMAND-010: 제품·Guardrail 이벤트 기록"
labels: 'command, analytics, observability, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-010 제품·Guardrail 이벤트 기록

## Summary
- 목적: 사용자 행동과 품질·비용 상태를 API-007 계약에 따라 멱등하게 기록해 SRS KPI와 Guardrail을 산출한다.
- REQ: 5.4, 9.1~9.3, REQ-NF-009

## References (Spec & Context)
- 계약: API-007
- 소비자: QUERY-003·004, NFR-006, UI-002~009

## Scope
- M1 DB event log, schema validation, deduplication, 실패 계측
- 실제 Analytics Adapter 전송은 교체 가능한 후속 구현
- 광고 프로파일링과 원본 금융 데이터 기록은 범위 밖

## Task Breakdown
- [ ] 이벤트 schema·version·금지필드를 서버에서 검증한다.
- [ ] event ID·deduplication key로 중복을 방지한다.
- [ ] 사용자 기능 transaction과 이벤트 실패의 격리 정책을 적용한다.
- [ ] 실패 횟수와 마지막 성공 시각을 Guardrail 원천으로 기록한다.
- [ ] M1 DB log와 실제 Analytics Adapter 포트를 분리한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 기록
- Given: API-007을 만족하는 event다.
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

## Technical & Non-Functional Constraints
- Analytics 장애가 계산·선택의 사용자 성공을 롤백하지 않는다.
- 실패를 무시하지 않고 운영 상태로 관측한다.

## Definition of Done
- [ ] TEST-005·006·007 이벤트 보안·중복·KPI 테스트가 통과한다.
- [ ] QUERY-003·004에서 필요한 모든 원천이 생성된다.
- [ ] NFR-006 대시보드가 이벤트 상태를 확인한다.

## Dependencies & Interactions
- Depends on: API-007
- Blocks: KPI·Guardrail 집계, UI Analytics 완료
- 변경 전파: 이벤트 카탈로그·Query·NFR·UI·TEST

## Open Decisions
- 이벤트 보존기간, 익명화, 실제 Analytics Adapter 시점

## 결론
분산된 UI 로깅을 하나의 검증 가능한 상태 변경 책임으로 통합한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`
