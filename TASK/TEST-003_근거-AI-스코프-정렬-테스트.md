---
name: CardFit Test Task
about: 근거 공개·AI fallback·금지어·단계 정렬 검증
title: "[Test] TEST-003: 근거·AI·스코프·정렬 테스트"
labels: 'test, evidence, compliance, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — TEST-003 근거·스코프·정렬 및 AI 확장 테스트

## Summary
- 목적: M1에서는 설명 가능성·실행 대행 경계·Could 정렬을 검증하고, M2에서는 선택적 AI 장애 격리를 추가 검증한다.
- REQ: 007, 009, 011, AI-004·005

## References (Spec & Context)
- 계약: API-003, MOCK-001
- M1 로직: QUERY-002, COMMAND-008
- M2 AI 확장: COMMAND-009

## Scope
- M1 In: Evidence 완전성, 스코프 문구, 단계 정렬 자동 테스트
- M2 In: AI 정상 응답·fallback·마스킹 테스트
- Out: 실제 Gemini 품질 평가와 사용자 인지도 설문 실행

## Task Breakdown
- [ ] 근거 개수·필수 유형·미반영 문구를 테스트한다.
- [ ] 6개 미만 거부와 기준일 누락을 테스트한다.
- [ ] M2에서 Gemini timeout·429·5xx fallback과 prompt 마스킹을 테스트한다.
- [ ] 금지어 scanner pass/fail fixture를 작성한다.
- [ ] 기여 순혜택 정렬·동률 정책을 테스트한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 근거 완전성
- Given: 공개 가능한 계산이다.
- When: evidence를 조회한다.
- Then: 6항목 이상과 미반영 비용·기준일·Rule 버전이 있다.
### Scenario 2: 불완전 근거
- Given: 5항목뿐이다.
- When: 조회한다.
- Then: 응답을 거부하고 GR3 위반은 0건이다.
### Scenario 3(M2): AI 장애
- Given: AI가 실패한다.
- When: 설명을 요청한다.
- Then: 정형 근거는 정상이고 AI만 unavailable이다.
### Scenario 4: 대행 오인 문구
- Given: 자동 해지를 암시하는 문구다.
- When: 검사한다.
- Then: 게시를 차단한다.

## Technical & Non-Functional Constraints
- AI mock은 계산 DTO를 수정할 수 없어야 한다.
- 금지어 검사는 결정론적으로 실행한다.

## Definition of Done
- [ ] TC-FUNC-007·009·011, TC-AC-B-01~03·C-04가 매핑됐다.
- [ ] M1 Gate에서는 정상·거부·금지 문구·정렬 suite가 green이다.
- [ ] M2 Gate에서는 AI 정상·장애·마스킹 suite가 추가로 green이다.
- [ ] 동률 정책 미확정 시 해당 기능은 skip이 아니라 명시적 blocked다.

## Dependencies & Interactions
- Depends on(M1): API-003·006, MOCK-001, QUERY-002, COMMAND-008
- Depends on(M2 AI 확장): COMMAND-009
- Blocks(M1): QUERY-002·COMMAND-008 DoD, TEST-006
- Blocks(M2): TEST-007 AI 경로
- 변경 전파: Evidence DTO·문구 규칙·AI adapter·정렬 정책

## Open Decisions
- 동률 정책, 금지어 승인자, AI timeout

## 결론
사용자가 결론을 신뢰할 근거와 서비스가 넘지 말아야 할 경계를 함께 검증한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
