---
name: CardFit UI Task
about: 승인된 관리자 의사결정 UX의 프론트엔드 구현
title: "[Frontend] UI-009: 관리자 Guardrail 대시보드 구현"
labels: 'ui, admin, observability, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — UI-009 관리자 Guardrail 대시보드

## Summary
- 목적: 운영자가 GR1~GR5·오조회·Rule 최신성·비용·Health를 확인하고 출시·중단 여부를 판단하게 한다.
- REQ: REQ-NF-004~009
- 구현 책임: UX-007의 상태·우선순위·runbook 정보 구조를 관리자 화면으로 구현한다.

## References (Spec & Context)
- 로직: QUERY-004, COMMAND-007
- NFR: NFR-002~006
- 테스트: TEST-005·006·007

## Scope
- 상태·임계치·최근 점검시각·책임자·조치 표시
- M1 수동 점검과 M2 자동화 상태
- 정보 구조·차트 의미 재설계와 외부 Slack·이메일 알림 UI는 승인 전 범위 밖

## Task Breakdown
- [ ] 관리자 역할과 공개 Health 화면을 분리한다.
- [ ] 정상·경고·중단·UNAVAILABLE 상태를 표시한다.
- [ ] Rule 7일/30일, 비용 80/100%, 가용성·오조회 상태를 구성한다.
- [ ] 각 상태에서 필요한 runbook·책임자 링크를 제공한다.
- [ ] 모바일보다 데스크톱 정보 계층을 우선하되 접근성을 보장한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 수동 점검
- Given: M1 시연 전 관리자다.
- When: 대시보드를 연다.
- Then: GR1~GR5·오조회·Health·비용 상태와 점검시각을 확인한다.
### Scenario 2: 미측정
- Given: 원천 데이터가 없다.
- When: 화면을 본다.
- Then: 정상 0으로 표시하지 않고 UNAVAILABLE과 원인을 표시한다.
### Scenario 3: 권한 없음
- Given: 일반 사용자다.
- When: 관리자 경로에 접근한다.
- Then: 거부하고 내부 비용·오류 상세를 노출하지 않는다.
### Scenario 4: 중단 상태
- Given: Guardrail이 위반됐다.
- When: 화면을 본다.
- Then: 중단 대상·책임자·조치가 최상위에 표시된다.

## Technical & Non-Functional Constraints
- 색상 외 텍스트 상태를 제공하고 표·차트에는 접근 가능한 요약을 둔다.
- 대시보드 조회가 운영 상태를 변경하지 않는다.

## Definition of Done
- [ ] QUERY-004의 모든 상태가 매핑됐다.
- [ ] TEST-005 권한과 TEST-006 M1 수동 점검이 통과한다.
- [ ] NFR-002~006의 임계치·조치와 일치한다.

## Dependencies & Interactions
- Depends on: UX-007, UI-001, QUERY-004, API-006·007, NFR-002~006
- Blocks: M1 시연 승인, M2 운영 승인
- 변경 전파: Guardrail 산식·역할·runbook·운영 테스트

## Open Decisions
- 관리자 역할 제공 주체, 차트 범위, M2 알림 채널

## 결론
운영 상태의 미측정과 위반을 숨기지 않고 실제 중단 판단으로 연결한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
