---
name: CardFit Test Task
about: M2 초기값·AI·Cron·이행 계측 E2E
title: "[Test] TEST-007: M2 자동화·이행 E2E"
labels: 'test, e2e, cron, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — TEST-007 M2 자동화·이행 E2E

## Summary
- 목적: M2 선택 기능과 자동화가 M1 핵심 계산을 훼손하지 않고 동작함을 증명한다.
- 범위: F-08·09·11·13, AI 설명, Cron

## References (Spec & Context)
- SRS: 1.2.1 M2, 9.2 E3·E7a/E7b
- 선행: TEST-004·005 및 M2 로직

## Scope
- In: 초기값·AI fallback·Cron·자기보고·관측 Fixture·이행 지표
- Out: 승인 전 실제 후속 관측과 외부 알림

## Task Breakdown
- [ ] 초기값 A/B 배정·fallback 흐름을 작성한다.
- [ ] AI 정상·장애 fallback을 작성한다.
- [ ] +30일 due·자기보고·관측을 fake clock으로 실행한다.
- [ ] 완료·유지·판정 불가·불일치 집계를 검증한다.
- [ ] Cron 재실행·비용 상한·동의 만료를 검증한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 초기값 fallback
- Given: 이력이 부족하다.
- When: M2 온보딩을 연다.
- Then: 임의 업계 평균 대신 빈 폼·비개인화 예시가 보인다.
### Scenario 2: 이행 분류
- Given: 완료·유지·충돌 Fixture가 있다.
- When: +30일 관측과 집계를 실행한다.
- Then: 행동 완주·유지 준수·판정 불가를 분리한다.
### Scenario 3: Cron 재실행
- Given: 같은 구간을 두 번 실행한다.
- When: Cron을 호출한다.
- Then: 중복 관측·집계는 0건이다.
### Scenario 4: AI 장애
- Given: Gemini가 실패한다.
- When: 전체 여정을 수행한다.
- Then: 계산·근거·선택·이행은 정상이다.

## Technical & Non-Functional Constraints
- Production 관측은 승인 전 Mock으로만 수행한다.
- 비용·가용성은 M2 NFR 기준을 함께 검증한다.

## Definition of Done
- [ ] E3·E7a/E7b 검증 경로가 코드와 증거에 연결됐다.
- [ ] M2 정상·장애·멱등 E2E가 green이다.
- [ ] M1 E2E 회귀가 계속 green이다.

## Dependencies & Interactions
- Depends on: M2 DATA/API/MOCK, COMMAND-005·006·009·010, QUERY-003, TEST-004·005
- Blocks: M2 베타 합격
- 변경 전파: 초기값·AI·Outcome·Cron·비용 정책

## Open Decisions
- 실제 A/B 도구, Production 관측 승인, M2 테스트 환경

## 결론
선택적 자동화가 핵심 가치와 신뢰도 모델을 깨뜨리지 않는다는 M2 증거다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
