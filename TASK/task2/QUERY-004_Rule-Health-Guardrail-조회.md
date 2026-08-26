---
name: CardFit Query Task
about: Rule 최신성·앱 상태·비용·Guardrail 운영 조회
title: "[Query] QUERY-004: Rule·Health·Guardrail 조회"
labels: 'query, operations, admin, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — QUERY-004 Rule·Health·Guardrail 조회

## Summary
- 목적: 관리자에게 Rule 최신성, 앱/DB 상태, 비용, GR1~GR5와 오조회 상태를 읽기 전용으로 제공한다.
- REQ: REQ-NF-006·007·009, REQ-GR-001~006, REQ-METRIC-001~006·008~011

## References (Spec & Context)
- 계약: API-005
- 선행: COMMAND-007 및 각 NFR 측정 데이터

## Scope
- 활성 Rule·7일 경고·30일 제외 상태
- `OperationsView`의 versioned schema와 unavailable·error 상태 계약
- 앱 버전·DB 호환성 Health
- 환경별 비용 사용률·80/100% 상태
- Guardrail 상태·최근 점검시각·책임자

## Task Breakdown
- [ ] 운영 역할별 읽기 권한을 적용한다.
- [ ] Rule·Health·비용·Guardrail ViewModel을 구성한다.
- [ ] 미측정·데이터 지연을 정상값 0과 구분한다.
- [ ] M1 수동 점검과 M2 자동 알림 상태를 구분한다.
- [ ] Rule 기준일로 지연 일수를 계산하고 7일 초과 경고·30일 초과 제외·복구 상태를 반환한다.
- [ ] 내부 비용·오류 상세는 운영 역할에만 반환하고 공개 Health DTO와 분리한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 운영 조회
- Given: 측정 데이터가 최신이다.
- When: 관리자가 조회한다.
- Then: 모든 Guardrail 상태·기준·시각을 반환한다.
### Scenario 2: 미측정
- Given: 지표 원천이 없다.
- When: 조회한다.
- Then: 0으로 표시하지 않고 `UNAVAILABLE`과 원인을 반환한다.
### Scenario 3: 권한 없음
- Given: 일반 사용자다.
- When: 관리자 상세를 조회한다.
- Then: 거부하고 내부 비용·오류 상세를 노출하지 않는다.
### Scenario 4: Rule 최신성 경계
- Given: Rule 갱신 지연이 각각 7일과 30일 경계에 있다.
- When: 운영 상태를 조회한다.
- Then: 승인된 경계 규칙에 따라 경고·계산 제외·복구 상태와 기준일을 반환한다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: DATA-002 RuleFreshness, SPEC-002 Guardrail 상태
- Writes: 없음
- Side Effects: 없음
- Transaction Boundary: 단일 snapshot read
- Idempotency: 동일 rule version 동일 응답
- Retry Policy: read timeout만 제한 재시도

## Verification Gates
- Test Gate: TEST-007 Rule freshness·차단·정상 시나리오 통과
- NFR Gate: NFR-004 최소 응답·권한 검증
- Evidence Location: health fixture와 contract test

- Query는 운영 상태를 변경하지 않는다.
- Health 공개 응답과 관리자 상세 응답을 분리한다.
- M1은 외부 알림 없이 수동 점검 가능해야 한다.
- Server Component와 Route Handler는 같은 `OperationsView` DTO를 사용한다.

## Definition of Done
- [ ] TEST-005 운영 권한 테스트가 통과한다.
- [ ] TEST-006 M1 smoke·수동 점검이 통과한다.
- [ ] NFR-003·004·006의 측정 결과와 REQ-NF-006 최신성 상태를 누락 없이 표시한다.
- [ ] `OperationsView` 정상·미측정·권한 실패 예시와 contract assertion이 고정됐다.

## Dependencies & Interactions
- Depends on: API-005, TEST-002·005 실패 기준선, COMMAND-007
- Blocks: 관리자 UI, 배포·시연 승인
- 변경 전파: API-005·TEST-005·006·NFR TASK

## Open Decisions
- 관리자 역할·대시보드 데이터 지연 허용치

## 결론
운영자가 미측정 상태를 정상으로 오인하지 않고 출시 중단 기준을 판단하게 한다.

## 출처

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. Rule health Query는 운영 상태만 노출하고 내부 정책 원문은 반환하지 않음.
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
