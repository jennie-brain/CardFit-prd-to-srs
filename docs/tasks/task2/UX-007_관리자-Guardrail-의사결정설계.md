---
name: CardFit UX Task
about: 관리자 Guardrail·비용·Health 의사결정 정보 설계
title: "[UX] UX-007: 관리자 Guardrail 의사결정 설계"
labels: 'ux, admin, observability, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — UX-007 관리자 Guardrail 의사결정 설계

## Summary
- 목적: 운영자가 정상·미측정·경고·중단을 구분하고 책임자·조치로 이어지게 하는 정보 구조를 설계한다.
- REQ: REQ-NF-004~009

## References (Spec & Context)
- 계약: API-005·006, COMMAND-010 이벤트 계약
- 로직: QUERY-004, COMMAND-007·010
- 후행 구현: UI-009

## Scope
- GR1~GR5·오조회·Rule·비용·Health의 우선순위·상태·책임자·runbook 구조
- 모니터링 도구 선택과 운영 코드 구현은 범위 밖

## Task Breakdown
- [ ] M1 수동 점검과 M2 자동 상태의 정보 계층을 설계한다.
- [ ] 정상 0과 UNAVAILABLE을 구분한다.
- [ ] 경고·중단 상태의 책임자·조치·최근 점검시각을 배치한다.
- [ ] 표·차트의 접근 가능한 요약과 필터를 정의한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 미측정
- Given: 지표 원천이 없다.
- When: 관리 화면을 검토한다.
- Then: 정상으로 오인하지 않고 미측정 원인·조치를 찾는다.
### Scenario 2: 중단 상태
- Given: 오조회 또는 Guardrail 위반이다.
- When: 화면을 본다.
- Then: 중단 대상·책임자·runbook이 최우선으로 보인다.
### Scenario 3: 권한 구분
- Given: 공개 Health와 관리자 상세가 있다.
- When: 정보 구조를 검토한다.
- Then: 민감 운영 정보가 공개 화면에 포함되지 않는다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: QUERY-004, COMMAND-007/010, NFR-004/006
- Writes: 관리자 Guardrail 의사결정 화면과 승인/차단 흐름
- Side Effects: 승인/차단 Command 호출 전 확인
- Transaction Boundary: 없음
- Idempotency: decisionId 기준
- Retry Policy: 상태 충돌은 재조회 후 재시도

## Verification Gates
- Test Gate: TEST-005·007 권한·Guardrail 통과
- NFR Gate: NFR-004 감사와 NFR-006 비용 차단 기준
- Evidence Location: 관리자 권한 매트릭스와 decision flow

- 색상 이외의 텍스트·아이콘·요약을 사용한다.
- 운영 상태를 변경하는 control은 별도 승인 Command 없이는 설계하지 않는다.

## Definition of Done
- [ ] 상태·정보 구조·필터·runbook 연결 명세가 승인됐다.
- [ ] UI-009와 NFR-001~004·006·TEST-002·005~007에 추적된다.
- [ ] M1/M2 운영 범위가 구분된다.

## Dependencies & Interactions
- Depends on: UX-001, API-005, COMMAND-010 이벤트 계약, QUERY-004 ViewModel, NFR-001~004·006
- Blocks: UI-009
- 변경 전파: 관리자 UI·운영 테스트·runbook

## Open Decisions
- 관리자 역할, 차트 범위, M2 알림 채널

## 결론
관리자 화면을 단순 지표 나열이 아니라 출시·중단 의사결정 도구로 설계한다.

## 출처

## Decision Log
- 2026-08-26: Step 5 관리자 UX를 QUERY-004와 Guardrail Command의 승인 경계로 고정.
- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
