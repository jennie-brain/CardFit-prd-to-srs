---
name: CardFit UI Task
about: 승인된 배분·근거·AI 설명 UX의 프론트엔드 구현
title: "[Frontend] UI-006: 배분·근거·AI 설명 구현"
labels: 'ui, evidence, ai, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — UI-006 배분·근거·AI 설명

## Summary
- 목적: 카테고리별 배분과 계산 근거를 검증 가능하게 표시하고 AI 설명은 보조 정보로 분리한다.
- REQ: REQ-FUNC-006·007, UX-V-004·006
- 구현 책임: UX-004의 정보 계층과 fallback 명세를 화면으로 구현한다.

## References (Spec & Context)
- 로직: QUERY-002
- 계약: API-003
- 테스트: TEST-003·006

## Scope
- 배분 합계, 근거 6항목 이상, 미반영 비용, 기준일, Rule 버전
- M2 AI 설명 available/unavailable와 정형 fallback
- 근거 계층·카피 재설계와 AI가 계산을 보장한다는 표현은 범위 밖

## Task Breakdown
- [ ] 카테고리별 카드·금액·합계를 표시한다.
- [ ] 근거 패널과 필수 6유형을 접근 가능한 구조로 만든다.
- [ ] 미반영 비용·최신성 경고를 결론과 가까이 배치한다.
- [ ] AI 설명을 별도 보조 영역으로 두고 unavailable fallback을 제공한다.
- [ ] `evidence_panel_opened` event를 기록한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 근거 열람
- Given: 공개 가능한 계산이다.
- When: 근거 보기를 연다.
- Then: 6항목 이상·미반영 비용·기준일·Rule 버전을 확인한다.
### Scenario 2: 근거 미달
- Given: API가 근거 미달을 거부한다.
- When: 화면에 표시한다.
- Then: 불완전 근거를 만들지 않고 결과 신뢰성 오류를 안내한다.
### Scenario 3: AI 장애
- Given: 설명이 unavailable이다.
- When: 근거를 본다.
- Then: 정형 근거·배분·선택은 정상이고 AI 실패만 분리 표시한다.

## Technical & Non-Functional Constraints
- Evidence 거부 응답 p95≤500ms 상태를 UI가 처리한다.
- AI 문구에 직접 식별정보·혜택 보장 표현을 포함하지 않는다.

## Definition of Done
- [ ] TEST-003·006과 UX-V-004·006이 통과한다.
- [ ] 근거 패널의 keyboard·focus·screen reader 검증이 통과한다.
- [ ] AI 비활성 M1에서도 화면이 완전하다.

## Dependencies & Interactions
- Depends on(M1): UX-004, UI-001·005, QUERY-002, API-003·006
- Depends on(M2 AI 확장): COMMAND-009
- Blocks: UI-007, 근거 열람 KPI 검증
- 변경 전파: Evidence DTO·AI 상태·Analytics·E2E

## Open Decisions
- 근거 정보 계층과 AI 설명 기본 접힘 여부

## 결론
결정론적 근거를 중심에 두고 AI는 실패 가능한 설명 보조수단으로 제한한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
