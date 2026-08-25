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
- REQ: REQ-NF-006·007·009

## References (Spec & Context)
- 계약: API-005
- 선행: COMMAND-007 및 각 NFR 측정 데이터

## Scope
- 활성 Rule·7일 경고·30일 제외 상태
- 앱 버전·DB 호환성 Health
- 환경별 비용 사용률·80/100% 상태
- Guardrail 상태·최근 점검시각·책임자

## Task Breakdown
- [ ] 운영 역할별 읽기 권한을 적용한다.
- [ ] Rule·Health·비용·Guardrail ViewModel을 구성한다.
- [ ] 미측정·데이터 지연을 정상값 0과 구분한다.
- [ ] M1 수동 점검과 M2 자동 알림 상태를 구분한다.

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

## Technical & Non-Functional Constraints
- Query는 운영 상태를 변경하지 않는다.
- Health 공개 응답과 관리자 상세 응답을 분리한다.
- M1은 외부 알림 없이 수동 점검 가능해야 한다.

## Definition of Done
- [ ] TEST-005 운영 권한 테스트가 통과한다.
- [ ] TEST-006 M1 smoke·수동 점검이 통과한다.
- [ ] NFR-003~006의 측정 결과를 누락 없이 표시한다.

## Dependencies & Interactions
- Depends on: API-005, COMMAND-007
- Blocks: 관리자 UI, 배포·시연 승인
- 변경 전파: API-005·TEST-005·006·NFR TASK

## Open Decisions
- 관리자 역할·대시보드 데이터 지연 허용치

## 결론
운영자가 미측정 상태를 정상으로 오인하지 않고 출시 중단 기준을 판단하게 한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
