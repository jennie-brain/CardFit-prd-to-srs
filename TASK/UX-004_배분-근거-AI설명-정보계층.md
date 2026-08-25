---
name: CardFit UX Task
about: 배분·결정론적 근거·AI 설명의 정보 계층 설계
title: "[UX] UX-004: 배분·근거·AI 설명 정보 계층"
labels: 'ux, evidence, ai, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — UX-004 배분·근거·AI 설명 정보 계층

## Summary
- 목적: 배분과 근거를 핵심으로, AI 설명을 선택적 보조 정보로 구분해 사용자가 계산을 검증하게 한다.
- REQ: REQ-FUNC-006·007, REQ-AI-004·005, UX-V-004·006

## References (Spec & Context)
- 계약: API-003·006, COMMAND-008 정책 계약
- 로직: QUERY-002, COMMAND-009
- 후행 구현: UI-006

## Scope
- 근거 6유형, 미반영 비용, 기준일, Rule 버전, AI available/unavailable 정보 계층
- 근거 산출과 AI 호출 구현은 범위 밖

## Task Breakdown
- [ ] 결론→차액→배분→근거의 읽기 순서를 설계한다.
- [ ] 미반영 비용과 최신성 경고의 강조 수준을 정한다.
- [ ] AI 설명과 결정론적 근거를 시각·문구로 분리한다.
- [ ] 근거 미달·AI 장애 상태의 사용자 안내를 설계한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 근거 확인
- Given: 공개 가능한 계산이다.
- When: 근거를 연다.
- Then: 필수 6유형·미반영 비용·기준일·Rule을 찾을 수 있다.
### Scenario 2: AI 장애
- Given: AI 설명이 unavailable이다.
- When: 화면을 본다.
- Then: 계산과 근거가 여전히 유효하며 AI만 보조 기능임을 이해한다.
### Scenario 3: 근거 미달
- Given: 근거 공개가 거부됐다.
- When: 상태를 본다.
- Then: 불완전 근거가 꾸며져 표시되지 않고 신뢰성 문제를 안다.

## Technical & Non-Functional Constraints
- AI가 혜택을 보장하거나 계산을 생성했다는 표현을 금지한다.
- 접근 가능한 disclosure 구조를 정의한다.

## Definition of Done
- [ ] 정보 구조·카피·상태 명세가 승인됐다.
- [ ] UI-006과 TEST-003·006·007에 추적된다.
- [ ] UX-V-004·006을 충족한다.

## Dependencies & Interactions
- Depends on: UX-001·003, API-003·006, COMMAND-008 정책 계약
- Blocks: UI-006, UX-005
- 변경 전파: Evidence UI·AI fallback·스코프 문구·E2E

## Open Decisions
- 근거 기본 펼침 수준과 AI 설명 기본 노출 여부

## 결론
검증 가능한 정형 근거를 중심에 두고 AI를 보조 계층으로 제한한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
