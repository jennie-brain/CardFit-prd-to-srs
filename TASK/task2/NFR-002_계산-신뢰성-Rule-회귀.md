---
name: CardFit NFR Task
about: 계산 오류율과 Rule 변경 회귀 통제
title: "[NFR] NFR-002: 계산 신뢰성·Rule 회귀"
labels: 'nfr, reliability, calculation, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — NFR-002 계산 신뢰성·Rule 회귀

## Summary
- 목적: Rule 변경마다 200개 이상 경계 사례로 오류율≤0.1%, 재계산 불일치 0건을 보장한다.
- REQ: REQ-NF-003, GR1

## References (Spec & Context)
- 대상: COMMAND-003·007
- 테스트: TEST-002

## Scope
- In: golden vector, 오류율·불일치 산식, Rule 활성화 gate
- Out: 미승인 계산식의 정답 정의

## Task Breakdown
- [ ] 오류 정의와 분모·제외 조건을 문서화한다.
- [ ] Rule PR/등록 전 회귀 gate를 연결한다.
- [ ] expected hash 변경 승인 절차를 정의한다.
- [ ] GR1 위반 시 Rule 활성화·롤아웃을 차단한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 통과
- Given: 새 Rule과 200개 이상 golden vector다.
- When: 회귀를 실행한다.
- Then: 오류율≤0.1%, 불일치 0건일 때만 활성화 가능하다.
### Scenario 2: 실패
- Given: 1건 이상의 재계산 불일치 또는 기준 초과다.
- When: 활성화를 시도한다.
- Then: 차단하고 기존 Rule을 유지한다.

## Technical & Non-Functional Constraints
- expected 결과를 구현 코드로부터 같은 실행 중 생성하지 않는다.
- seed·clock·Rule version을 고정한다.

## Definition of Done
- [ ] TEST-002와 Rule 변경 gate가 연결됐다.
- [ ] 오류 산식·책임자·중단/복구 절차가 문서화됐다.
- [ ] 실패를 재현하는 Fixture를 보존한다.

## Dependencies & Interactions
- Depends on: COMMAND-003·007, TEST-002
- Blocks: Rule 활성화, M1/M2 롤아웃, QUERY-004 정상 상태
- 변경 전파: 계산 정책·Rule·golden vector

## Open Decisions
- Golden 결과 승인자와 0.1% 소수 표본 처리

## 결론
Rule 데이터 변경을 코드 변경과 동일한 품질 게이트로 통제한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
