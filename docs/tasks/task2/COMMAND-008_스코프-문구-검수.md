---
name: CardFit Command Task
about: 스코프 문구 정책 계약과 실행 대행 오인 문구의 게시 전 차단
title: "[Command] COMMAND-008: 스코프 문구 정책·검수"
labels: 'command, compliance, priority:should, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-008 스코프 문구 정책·검수

## Summary
- 목적: 승인 문구·금지어·예외 정책을 버전 계약으로 정의하고 UI·FAQ·CS에서 카드 발급·해지·전환 대행을 암시하는 표현을 게시 전에 차단한다.
- REQ: REQ-FUNC-009, ADR-002, REQ-GR-004

## References (Spec & Context)
- SRS: 4.1 REQ-FUNC-009, ADR-002, GR4
- 소비자: UX-001·002·004·005, UI-002·006·007, TEST-003·006

## Scope
- `ScopeNoticePolicy`, `ProhibitedPhrase`, `PolicyException`의 versioned manifest
- 승인된 스코프 고지와 금지 표현 검사
- 파일/콘텐츠 입력의 pass/fail·위치 결과
- 사용자별 금융 데이터와 런타임 금융 행동 실행은 범위 밖

## Task Breakdown
- [ ] 문구 ID·locale·채널·유효기간·규칙 버전을 포함한 승인 문구·금지 패턴 manifest를 정의한다.
- [ ] 예외 승인자·사유·만료일·감사 필드를 정의한다.
- [ ] UI·FAQ·CS 대상 scanner를 구현한다.
- [ ] 위반 위치·규칙 ID를 반환하고 게시/build를 차단한다.
- [ ] 오탐 검토와 만료된 예외의 차단 규칙을 구현한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 승인 문구
- Given: 대행하지 않음을 명시한 콘텐츠다.
- When: 검사한다.
- Then: 통과하고 규칙 버전을 기록한다.
### Scenario 2: 대행 암시
- Given: 자동 해지·전환을 암시한다.
- When: 검사한다.
- Then: 게시를 차단하고 위반 위치를 반환한다.

### Scenario 3: 만료되거나 미승인된 예외
- Given: 예외 승인에 승인자·사유가 없거나 유효기간이 만료됐다.
- When: 정책을 활성화하거나 콘텐츠를 검사한다.
- Then: 예외를 적용하지 않고 기존 정책을 유지하며 게시를 차단한다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: SPEC-002 제품·Guardrail 계약, 문구 입력
- Writes: 검수 결과·차단 사유·문구 버전
- Side Effects: 없음
- Transaction Boundary: 검수 결과와 버전을 원자 저장
- Idempotency: content hash와 rule version
- Retry Policy: transient DB 오류만 재시도

## Verification Gates
- Test Gate: 스코프 위반·경계·통과 GWT 통과
- NFR Gate: NFR-004 민감정보·과장표현 차단 검증
- Evidence Location: moderation fixture와 rule evaluation log

- GR4 위반 노출 0건을 목표로 하며 규칙 변경은 감사한다.
- LLM 단독 판정에 의존하지 않는 결정론적 검사를 기본으로 한다.

## Definition of Done
- [ ] TEST-003 근거·스코프 테스트가 통과한다.
- [ ] TEST-006 M1 E2E에서 스코프 고지가 노출된다.
- [ ] manifest schema·버전 전이·예외 승인 절차가 문서화됐다.

## Dependencies & Interactions
- Depends on: 제품·컴플라이언스 문구 및 예외 승인 책임자 확정
- Blocks: 콘텐츠 게시, UX-001·002·004, UI-002·006·007
- 변경 전파: TEST-003·006, 모든 사용자 노출 문구

## Open Decisions
- 승인자·예외 만료기간·검사 대상 파일 범위

## 결론
규제 경계를 승인 가능한 공통 정책 계약과 실행 가능한 게시 차단 로직으로 관리한다.

## 출처

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. 문구 검수는 Guardrail 계약을 통과한 버전만 저장.
- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
