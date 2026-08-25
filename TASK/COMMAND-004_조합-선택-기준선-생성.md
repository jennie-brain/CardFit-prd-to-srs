---
name: CardFit Command Task
about: 유효 조합 선택과 이행 기준선 생성
title: "[Command] COMMAND-004: 조합 선택·기준선 생성"
labels: 'command, outcome, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-004 조합 선택·기준선 생성

## Summary
- 목적: 사용자가 유효한 유지·변경 결론을 선택할 때 멱등 선택 기록과 당시 기준선을 생성한다.
- REQ: REQ-FUNC-005, REQ-FUNC-010(M1 시뮬레이션)

## References (Spec & Context)
- 계약: DATA-002·003, API-002
- 선행: COMMAND-003

## Scope
- 후보 소유권·상태·만료 검증, `selection_id` 생성
- 선택 시 보유카드·대상상품·동의범위·기준일·완전성 기준선
- 발급·해지·유지 OutcomeItem 생성
- 카드 신청·해지 실행은 범위 밖

## Task Breakdown
- [ ] 세션·소유권·후보 유효성을 검증한다.
- [ ] 선택과 기준선·OutcomeItem을 하나의 transaction으로 저장한다.
- [ ] 동일 선택 재요청을 멱등 처리한다.
- [ ] 유지 추천과 행동 추천의 집계 유형을 분리한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 선택
- Given: 현재 사용자 소유의 유효 후보가 있다.
- When: 선택한다.
- Then: 선택·기준선·필수 항목이 누락 0건으로 생성된다.
### Scenario 2: 만료 후보
- Given: Rule 변경 또는 30일 경과로 후보가 만료됐다.
- When: 선택한다.
- Then: 거부하고 기준선을 생성하지 않는다.
### Scenario 3: 중복 선택
- Given: 동일 선택 요청이 재전송된다.
- When: 처리한다.
- Then: 기존 `selection_id`를 반환하고 중복 레코드는 0건이다.

## Technical & Non-Functional Constraints
- 선택은 외부 실행이 아니라 측정 기준점이다.
- 기준선은 승인된 최소 필드만 보존하고 원본 응답을 저장하지 않는다.

## Definition of Done
- [ ] TEST-004 선택·이행 상태 테스트가 통과한다.
- [ ] TEST-005 소유권·멱등 테스트가 통과한다.
- [ ] M1 시간 시뮬레이터에서 +30일 전이가 재현된다.

## Dependencies & Interactions
- Depends on: DATA-002·003, API-002, COMMAND-003
- Blocks: COMMAND-005·006, QUERY-003
- 변경 전파: DATA-003·API-002·004·TEST-004

## Open Decisions
- 유지 결론의 PlanCandidate 표현과 M1 기준선 저장 범위

## 결론
사용자 선택을 실행 대행과 분리된 명시적이고 재현 가능한 상태 변경으로 만든다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

