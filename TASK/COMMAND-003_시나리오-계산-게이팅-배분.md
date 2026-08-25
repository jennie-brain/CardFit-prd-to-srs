---
name: CardFit Command Task
about: 세 시나리오 계산·Net Benefit 게이팅·배분 생성
title: "[Command] COMMAND-003: 시나리오 계산·게이팅·배분"
labels: 'command, calculation, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-003 시나리오 계산·게이팅·배분

## Summary
- 목적: LOW·BASE·HIGH를 독립 계산하고 유지·변경 결론과 배분을 불변 스냅샷으로 생성한다.
- REQ: REQ-FUNC-004~006

## References (Spec & Context)
- 계약: DATA-002, API-003
- 선행 로직: COMMAND-001·002·007
- SRS: 3.6.1, 4.1, 6.2.5, 8.5

## Scope
- 실적구간·한도·연회비 계산, 조합 최적화, Net Benefit 게이트
- 세 시나리오 결과·차액·Allocation·hash 저장
- 캐시 장애 fallback과 부분 계산 중단
- Gemini 설명·실행 대행은 범위 밖

## Task Breakdown
- [ ] 입력·동의·캐시·Rule 가용성을 선검증한다.
- [ ] 순수 TypeScript 함수로 세 시나리오를 계산한다.
- [ ] 확정된 정책으로 후보를 비교하고 임계 미달 시 유지 결론을 만든다.
- [ ] 카테고리별 Allocation과 합계 불변조건을 검증한다.
- [ ] 결과 hash·rule_version·오류 코드를 transaction으로 저장한다.
- [ ] p95·오류율·비용 측정 event를 기록한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 계산
- Given: 입력·동의·Rule이 유효하다.
- When: 계산한다.
- Then: 세 결과와 원 단위 차액·배분을 p95 5초 이내 생성한다.
### Scenario 2: 임계 미달
- Given: 변경 순혜택이 임계값 미만이다.
- When: 게이팅한다.
- Then: 현재 조합 유지 반환률은 100%이고 변경 제안은 0건이다.
### Scenario 3: 입력 없음
- Given: 미래지출이 0건이다.
- When: 계산한다.
- Then: 400 오류를 반환하고 과거 단독 결과를 만들지 않는다.
### Scenario 4: 배분 불일치
- Given: 배분 합계가 입력 합계와 다르다.
- When: 결과를 확정한다.
- Then: 부분/실패로 기록하고 결과를 노출하지 않는다.

## Technical & Non-Functional Constraints
- 동일 입력·Rule 결과 hash 100% 일치, 오류율 ≤0.1%다.
- SRS 8.5의 9개 정책 확정 전 완료 처리할 수 없다.
- 요청 간 메모리 상태와 별도 Python/백엔드 서버를 사용하지 않는다.

## Definition of Done
- [ ] TEST-002 계산·게이팅·배분 테스트가 통과한다.
- [ ] TEST-006 M1 핵심 E2E가 통과한다.
- [ ] NFR-001·002 성능·신뢰성 검증 기준을 충족한다.
- [ ] 200개 이상 경계 회귀 Fixture에서 기준을 충족한다.

## Dependencies & Interactions
- Depends on: DATA-002, API-003, COMMAND-001·002·007, D2·D5·D6 및 SRS 8.5 확정
- Blocks: QUERY-002, COMMAND-004, 결과 UI
- 변경 전파: DATA-002·API-003·MOCK-001·TEST-002·NFR-001·002

## Open Decisions
- SRS 8.5 전 항목, 시나리오 배율과 범위 입력 우선순위

## 결론
CardFit 핵심 가치 로직을 하나의 결정론적 Command로 묶고 미확정 정책을 명시적 Blocker로 둔다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
