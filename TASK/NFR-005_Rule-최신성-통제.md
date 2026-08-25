---
name: CardFit NFR Task
about: 카드 혜택 Rule의 7일 경고·30일 제외 통제
title: "[NFR] NFR-005: Rule 최신성 통제"
labels: 'nfr, reliability, data-quality, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — NFR-005 Rule 최신성 통제

## Summary
- 목적: 오래된 BenefitRule이 조용히 계산에 사용되지 않도록 경고·제외·복구 상태를 관리한다.
- REQ: REQ-NF-006, GR5

## References (Spec & Context)
- 대상: COMMAND-007, QUERY-004, API-005

## Scope
- In: Rule 기준일, 7일 경고, 30일 제외, 복구 상태
- Out: 장시간 크롤러와 카드사 약관 수집 자동화

## Task Breakdown
- [ ] Rule별 마지막 확인일과 유효기간을 산출한다.
- [ ] 7일 초과 경고와 30일 초과 계산 제외를 구현한다.
- [ ] M1 수동 점검과 M2 일간 Cron 결과를 같은 상태 모델로 제공한다.
- [ ] 새 Rule 승인 후 복구·후보 만료·재계산 절차를 정의한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 7일 초과
- Given: 갱신 지연이 7일을 초과하고 30일 이하다.
- When: 조회·계산한다.
- Then: 최신성 경고와 기준일을 표시한다.
### Scenario 2: 30일 초과
- Given: 지연이 30일을 초과한다.
- When: 후보를 계산한다.
- Then: 해당 카드를 자동 제외한다.
### Scenario 3: 복구
- Given: 검증된 새 Rule이 활성화된다.
- When: 상태를 갱신한다.
- Then: 경고가 해제되고 기존 후보는 만료된 채 재계산을 요구한다.

## Technical & Non-Functional Constraints
- 날짜 경계는 고정 timezone과 fake clock으로 검증한다.
- 자체 수집 실패를 최신 데이터로 가장하지 않는다.

## Definition of Done
- [ ] 7일·30일 경계 테스트가 통과한다.
- [ ] QUERY-004에서 최신성·미측정 상태가 구분된다.
- [ ] M1 수동/M2 Cron 책임이 문서화됐다.

## Dependencies & Interactions
- Depends on: DATA-001, COMMAND-007, QUERY-004, API-005
- Blocks: 정확한 COMMAND-003 계산, M1 시연 승인
- 변경 전파: Rule 데이터·계산 필터·운영 화면·TEST-002

## Open Decisions
- 카드사별 확인일 정의와 M2 알림 채널

## 결론
Rule 최신성을 계산 전제조건으로 취급해 오래된 혜택정보로 추천하는 위험을 통제한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
