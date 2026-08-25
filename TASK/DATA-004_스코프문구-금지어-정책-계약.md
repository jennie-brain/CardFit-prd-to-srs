---
name: CardFit Data Task
about: 사용자 노출 문구의 스코프 고지·금지어·예외승인 정책 계약
title: "[Data] DATA-004: 스코프 문구·금지어 정책 계약"
labels: 'data, compliance, content-policy, priority:should, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — DATA-004 스코프 문구·금지어 정책 계약

## Summary
- 목적: 카드 발급·해지·전환 대행을 암시하지 않도록 승인 문구, 금지 패턴, 예외승인 기록의 버전 계약을 정의한다.
- REQ: REQ-FUNC-009, ADR-002, GR4

## References (Spec & Context)
- SRS: 4.1 REQ-FUNC-009, 6.3, 8.2 ADR-002
- 소비자: COMMAND-008, UX-001·002·004·005, UI-002·006·007

## Scope
- 승인된 필수 고지, 금지 표현, 적용 채널, 규칙 버전, 예외 승인자·만료일
- 사용자별 금융 데이터나 실행 대행 상태는 범위 밖

## Task Breakdown
- [ ] `ScopeNoticePolicy`, `ProhibitedPhrase`, `PolicyException` schema를 정의한다.
- [ ] 문구 ID·locale·채널·유효기간·버전을 정의한다.
- [ ] 예외 승인자·사유·만료일·감사 필드를 정의한다.
- [ ] UI·FAQ·CS·분석 이벤트에 공통 적용할 manifest 형식을 정한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 승인 문구 조회
- Given: 유효한 정책 버전과 채널이 있다.
- When: 고지 문구를 조회한다.
- Then: 승인 문구·버전·유효기간을 결정론적으로 반환한다.
### Scenario 2: 만료된 예외
- Given: 금지 표현 예외가 만료됐다.
- When: 게시 검사를 수행한다.
- Then: 예외를 적용하지 않고 게시를 차단한다.
### Scenario 3: 미승인 변경
- Given: 승인자·사유가 없는 정책 변경이다.
- When: 활성화를 시도한다.
- Then: 활성화하지 않고 기존 정책을 유지한다.

## Technical & Non-Functional Constraints
- 정책은 코드와 함께 버전 관리하고 LLM 단독 판정에 의존하지 않는다.
- GR4 위반 노출 허용치는 0건이다.

## Definition of Done
- [ ] schema·manifest·예시·버전 전이 규칙이 확정됐다.
- [ ] COMMAND-008과 TEST-003이 동일 규칙을 소비한다.
- [ ] 승인자·예외 만료 정책이 기록됐다.

## Dependencies & Interactions
- Depends on: 제품·컴플라이언스 문구 승인
- Blocks: COMMAND-008, UX-002·004·005, UI-002·006·007
- 변경 전파: 금지어 검사·사용자 문구·TEST-003·Analytics

## Open Decisions
- 실제 승인 역할, locale 범위, 예외 최대 유효기간

## 결론
스코프 문구를 화면별 하드코딩이 아닌 승인 가능한 공통 정책 계약으로 관리한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`

