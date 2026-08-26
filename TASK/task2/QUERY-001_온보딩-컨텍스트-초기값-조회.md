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
- `OnboardingView`의 versioned schema와 empty·partial·stale·unavailable·error 상태 계약
- M2에서 과거 3개월 이상 개인 초기값·기준기간 제공
- 이력 부족 시 빈 폼·비개인화 예시 제공
- 승인 없는 업계 평균 생성은 범위 밖

## Task Breakdown
- [ ] 세션·소유권 기준 조회를 작성한다.
- [ ] 동의·sync·completeness를 ViewModel로 매핑한다.
- [ ] M1에서는 빈 입력·비개인화 예시만 제공하고, M2에서 이력 기간 산출과 개인 초기값 분기를 추가한다.
- [ ] 스코프 고지 버전을 포함한다.
- [ ] 내부 DB enum·오류를 화면용 domain code로 변환하고 정상값 0·빈 배열과 `UNAVAILABLE`을 구분한다.

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
## Execution Contract
- Reads: DATA-001 저장값, API-001 동기화 상태, SPEC-001 ViewModel/오류 계약
- Writes: 없음(읽기 전용; 캐시 사용 시 별도 TTL 메타데이터만 허용)
- Side Effects: 없음
- Transaction Boundary: 단일 read transaction 또는 일관된 snapshot 조회
- Idempotency: 동일 사용자·버전 입력에 대해 동일 ViewModel 반환
- Retry Policy: 일시적 read timeout만 제한 재시도, domain 오류는 즉시 반환

## Verification Gates
- Test Gate: TEST-001·005·006 및 SPEC-001 contract assertion 통과
- NFR Gate: NFR-001 응답시간과 NFR-004 개인정보 최소응답 검증
- Evidence Location: Query contract 테스트와 응답 fixture를 첨부

- Query는 DB·Adapter 상태를 변경하지 않는다.
- 타 사용자 데이터·원본 금융 응답을 반환하지 않는다.
- Server Component와 Route Handler는 같은 `OnboardingView` DTO를 사용한다.

## Definition of Done
- [ ] TEST-001 온보딩 조회·fallback 테스트가 통과한다.
- [ ] TEST-005 소유권 테스트가 통과한다.
- [ ] TEST-006 M1 E2E가 통과한다.
- [ ] M2 확장 시 TEST-007의 개인 초기값·이력 부족 fallback 경로가 통과한다.
- [ ] `OnboardingView` 정상·부분·실패 예시와 contract assertion이 고정됐다.

## Dependencies & Interactions
- Depends on: DATA-001, API-001, TEST-001 실패 기준선, COMMAND-001·002
- Blocks: 온보딩 UI
- 변경 전파: Mock·TEST-001·006·UI

## Open Decisions
- 초기값 통계 방식과 A/B 배정·업계 평균 승인

## 결론
입력 화면이 데이터 품질과 개인화 가능 여부를 추측하지 않도록 단일 조회 모델을 제공한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. Query는 쓰기·외부 부작용이 없는 snapshot 조회로 고정하고 ViewModel 계약을 게이트로 지정.
