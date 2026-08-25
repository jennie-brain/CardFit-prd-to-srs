---
name: CardFit Query Task
about: 입력 화면용 플랫폼 컨텍스트와 초기값 조회
title: "[Query] QUERY-001: 온보딩 컨텍스트·초기값 조회"
labels: 'query, onboarding, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — QUERY-001 온보딩 컨텍스트·초기값 조회

## Summary
- 목적: 동의·보유카드·과거패턴·기존 입력·스코프 고지를 읽기 전용 ViewModel로 제공한다.
- REQ: REQ-FUNC-002·008·009

## References (Spec & Context)
- 계약: DATA-001, API-001
- 선행: COMMAND-001·002

## Scope
- 사용자 소유 데이터와 품질 상태 조회
- M2에서 과거 3개월 이상 개인 초기값·기준기간 제공
- 이력 부족 시 빈 폼·비개인화 예시 제공
- 승인 없는 업계 평균 생성은 범위 밖

## Task Breakdown
- [ ] 세션·소유권 기준 조회를 작성한다.
- [ ] 동의·sync·completeness를 ViewModel로 매핑한다.
- [ ] 이력 기간을 산출하고 M1/M2 초기값 분기를 구현한다.
- [ ] 스코프 고지 버전을 포함한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 완전한 컨텍스트
- Given: 유효 동의와 완전한 최신 데이터가 있다.
- When: 조회한다.
- Then: 보유카드·기존 입력·품질 메타데이터를 반환한다.
### Scenario 2: 3개월 이상 이력
- Given: M2이고 이력이 3개월 이상이다.
- When: 조회한다.
- Then: 개인화 초기값과 기준기간을 반환한다.
### Scenario 3: 이력 부족
- Given: 이력이 3개월 미만이다.
- When: 조회한다.
- Then: 임의 업계 평균 없이 빈 입력과 비개인화 예시를 반환한다.

## Technical & Non-Functional Constraints
- Query는 DB·Adapter 상태를 변경하지 않는다.
- 타 사용자 데이터·원본 금융 응답을 반환하지 않는다.

## Definition of Done
- [ ] TEST-001 온보딩 조회·fallback 테스트가 통과한다.
- [ ] TEST-005 소유권 테스트가 통과한다.
- [ ] TEST-006 M1 E2E가 통과한다.

## Dependencies & Interactions
- Depends on: DATA-001, API-001, COMMAND-001·002
- Blocks: 온보딩 UI
- 변경 전파: Mock·TEST-001·006·UI

## Open Decisions
- 초기값 통계 방식과 A/B 배정·업계 평균 승인

## 결론
입력 화면이 데이터 품질과 개인화 가능 여부를 추측하지 않도록 단일 조회 모델을 제공한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

