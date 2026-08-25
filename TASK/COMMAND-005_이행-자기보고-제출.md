---
name: CardFit Command Task
about: 추천 항목별 자기보고 최초 제출 처리
title: "[Command] COMMAND-005: 이행 자기보고 제출"
labels: 'command, outcome, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-005 이행 자기보고 제출

## Summary
- 목적: +30일 재방문 사용자의 항목별 자기보고를 최초 1회 저장한다.
- REQ: REQ-FUNC-010

## References (Spec & Context)
- 계약: DATA-003, API-004
- 선행: COMMAND-004

## Scope
- 응답 가능 시점·소유권·항목 유효성 검증
- 최초 제출 멱등 저장
- 자기보고와 관측 검증 상태 독립 유지
- 외부 독려·재노출·미완주 개입은 범위 밖

## Task Breakdown
- [ ] due·세션·소유권을 검증한다.
- [ ] 항목별 응답을 transaction으로 최초 저장한다.
- [ ] 중복 제출은 기존 결과를 반환한다.
- [ ] 무응답을 미완료로 변환하지 않는다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 최초 제출
- Given: +30일이 지난 사용자 소유 Outcome이다.
- When: 항목별 응답을 제출한다.
- Then: 자기보고만 갱신되고 검증 상태는 변하지 않는다.
### Scenario 2: 중복 제출
- Given: 동일 `selection_id` 응답이 존재한다.
- When: 다시 제출한다.
- Then: 최초 값이 유지되고 중복 집계는 0건이다.
### Scenario 3: 관측 불가와 병존
- Given: 사용자는 완료로 답했으나 검증은 UNAVAILABLE이다.
- When: 저장한다.
- Then: 두 상태를 그대로 독립 보존한다.

## Technical & Non-Functional Constraints
- M2 기능이며 M1 합격 필수가 아니다.
- 응답 payload 로그를 최소화하고 외부 알림을 발생시키지 않는다.

## Definition of Done
- [ ] TEST-004 자기보고·멱등·독립 상태 테스트가 통과한다.
- [ ] TEST-007 M2 이행 E2E가 통과한다.

## Dependencies & Interactions
- Depends on: DATA-003, API-004, COMMAND-004
- Blocks: QUERY-003
- 변경 전파: DATA-003·API-004·TEST-004·007·이행 UI

## Open Decisions
- 최초 제출 이후 수정 허용 여부

## 결론
자기보고를 플랫폼 관측의 대체 정답이 아닌 독립 증거로 저장한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

