---
name: CardFit API Contract Task
about: 온보딩·계산·이행·운영 Query ViewModel 계약
title: "[API] API-006: Query ViewModel 계약"
labels: 'api, query, contract, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — API-006 Query ViewModel 계약

## Summary
- 목적: QUERY-001~004가 UI에 제공하는 읽기 모델의 필드·상태·권한·버전을 고정한다.
- REQ: REQ-FUNC-002·005·007~011, REQ-NF-006·007·009

## References (Spec & Context)
- SRS: 3.1~3.4, 4.1~4.2, 8.10, 9.1
- 선행: DATA-001~003, API-001~005

## Scope
- `OnboardingView`, `CalculationResultView`, `OutcomeView`, `OperationsView`
- loading은 클라이언트 상태이며 계약에는 empty·partial·stale·unavailable·error의 도메인 상태를 포함
- DB model 직접 직렬화와 민감 원본 반환은 범위 밖

## Task Breakdown
- [ ] 네 ViewModel의 versioned schema를 정의한다.
- [ ] 금액·기준일·Rule·품질·사유코드의 표시 필드를 정의한다.
- [ ] 사용자/관리자 권한별 반환 필드를 분리한다.
- [ ] `UNAVAILABLE`과 정상값 0·빈 배열을 구분한다.
- [ ] Server Component 직접 조회와 Route Handler가 같은 DTO를 사용하도록 한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 온보딩 부분 상태
- Given: 일부 플랫폼 데이터가 누락됐다.
- When: OnboardingView를 만든다.
- Then: 빈 성공값이 아니라 partial·기준일·복구 가능 여부를 반환한다.
### Scenario 2: 계산 결과
- Given: 성공한 세 시나리오 계산이다.
- When: CalculationResultView를 만든다.
- Then: BASE 기본값·각 결론·차액·근거 가능 상태가 누락 없이 포함된다.
### Scenario 3: 관리자 권한 없음
- Given: 일반 사용자다.
- When: OperationsView를 요청한다.
- Then: 내부 비용·오류 상세를 반환하지 않는다.

## Technical & Non-Functional Constraints
- DB enum·내부 오류를 UI에 그대로 노출하지 않고 versioned domain code로 변환한다.
- 모든 ViewModel은 소유권·역할 검증 후 생성한다.

## Definition of Done
- [ ] 네 schema와 정상·실패 예시가 확정됐다.
- [ ] QUERY-001~004와 UI-002~009가 같은 타입을 사용한다.
- [ ] TEST-001·003~007의 contract assertion이 연결됐다.

## Dependencies & Interactions
- Depends on: DATA-001~003, API-001~005
- Blocks: QUERY-001~004, UI-002~009
- 변경 전파: Query·Mock·UI·TEST

## Open Decisions
- ViewModel versioning 방식과 Server Component 직렬화 경계

## 결론
서버 엔터티와 화면 상태 사이의 누락된 읽기 계약을 하나의 명시적 경계로 보완한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

