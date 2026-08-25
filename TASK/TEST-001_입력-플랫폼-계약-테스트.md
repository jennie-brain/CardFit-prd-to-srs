---
name: CardFit Test Task
about: 입력·제약·Adapter·초기값의 TDD 계약 테스트
title: "[Test] TEST-001: 입력·플랫폼 계약 테스트"
labels: 'test, contract, tdd, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — TEST-001 입력·플랫폼 계약 테스트

## Summary
- 목적: 입력·제약·Adapter·초기값의 정상·경계·실패 동작을 구현 전에 고정한다.
- REQ: 001A/B, 002, 003A/B, 008

## References (Spec & Context)
- 계약: DATA-001, API-001·002, MOCK-001
- 로직: COMMAND-001·002, QUERY-001

## Scope
- In: 입력 schema, Adapter 계약, 동의·품질 상태, 초기값 분기 자동 테스트
- Out: 실제 Production Adapter 접속과 실제 사용자 데이터

## Task Breakdown
- [ ] schema 단위·경계 테이블 테스트를 먼저 작성한다.
- [ ] Mock/Production Adapter 공통 contract suite를 작성한다.
- [ ] 동의·부분·오래됨·연결 해제 분기를 작성한다.
- [ ] M2 초기값 3개월 경계와 fallback을 작성한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 유효 입력
- Given: 정상 단일·범위·양방향·자유 카테고리다.
- When: 저장·조회한다.
- Then: 계산 입력 반영률 100%, 처리 오류율 0%다.
### Scenario 2: 경계 위반
- Given: 음수·비숫자·상한 초과·역전 범위다.
- When: 검증한다.
- Then: 저장 0건이고 정확한 field error를 assertion한다.
### Scenario 3: Adapter 오류
- Given: 부분·오래됨·만료·연결 해제 Fixture다.
- When: 동기화·조회한다.
- Then: 빈 성공값으로 변환하지 않고 각 상태를 assertion한다.

## Technical & Non-Functional Constraints
- Fixture는 비식별·결정론적이어야 한다.
- DB 테스트는 격리 transaction 또는 전용 schema를 사용한다.

## Definition of Done
- [ ] TC-FUNC-001A/B·002·003A/B·008이 테스트명에 추적된다.
- [ ] 정상·실패·경계 테스트가 모두 green이다.
- [ ] Production Adapter가 없어도 공통 contract suite 구조가 완성됐다.

## Dependencies & Interactions
- Depends on: Step 1 DATA/API/MOCK, COMMAND-001·002, QUERY-001
- Blocks: COMMAND-001·002·QUERY-001 DoD, TEST-006
- 변경 전파: 입력/Adapter 계약과 Fixture

## Open Decisions
- 테스트 runner·DB 격리 방식·초기값 통계 정책

## 결론
계산 이전의 입력·외부 상태 오류를 가장 먼저 탐지하는 TDD 기준선이다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
