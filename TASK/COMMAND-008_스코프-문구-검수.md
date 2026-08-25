---
name: CardFit Command Task
about: 실행 대행 오인 문구의 게시 전 차단
title: "[Command] COMMAND-008: 스코프 문구 검수"
labels: 'command, compliance, priority:should, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-008 스코프 문구 검수

## Summary
- 목적: UI·FAQ·CS 문구에서 카드 발급·해지·전환 대행을 암시하는 표현을 게시 전에 차단한다.
- REQ: REQ-FUNC-009

## References (Spec & Context)
- SRS: 4.1 REQ-FUNC-009, ADR-002, GR4
- 계약: 승인 문구 목록·금지어 규칙(콘텐츠 자산)

## Scope
- versioned 금지 표현과 승인된 스코프 고지 검사
- 파일/콘텐츠 입력의 pass/fail·위치 결과
- 런타임 금융 행동 실행은 범위 밖

## Task Breakdown
- [ ] 승인 문구·금지 패턴을 데이터 파일로 정의한다.
- [ ] UI·FAQ·CS 대상 scanner를 구현한다.
- [ ] 위반 위치·규칙 ID를 반환하고 게시/build를 차단한다.
- [ ] 오탐 검토와 예외 승인 기록을 정의한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 승인 문구
- Given: 대행하지 않음을 명시한 콘텐츠다.
- When: 검사한다.
- Then: 통과하고 규칙 버전을 기록한다.
### Scenario 2: 대행 암시
- Given: 자동 해지·전환을 암시한다.
- When: 검사한다.
- Then: 게시를 차단하고 위반 위치를 반환한다.

## Technical & Non-Functional Constraints
- GR4 위반 노출 0건을 목표로 하며 규칙 변경은 감사한다.
- LLM 단독 판정에 의존하지 않는 결정론적 검사를 기본으로 한다.

## Definition of Done
- [ ] TEST-003 근거·스코프 테스트가 통과한다.
- [ ] TEST-006 M1 E2E에서 스코프 고지가 노출된다.
- [ ] 예외 승인 절차가 문서화됐다.

## Dependencies & Interactions
- Depends on: 승인 문구·금지어 정책
- Blocks: 콘텐츠 게시, UI/UX TASK
- 변경 전파: TEST-003·006, 모든 사용자 노출 문구

## Open Decisions
- 승인자·예외 만료기간·검사 대상 파일 범위

## 결론
규제 경계를 문서 주의사항이 아니라 실행 가능한 게시 차단 로직으로 만든다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
