---
name: CardFit Command Task
about: 미래지출·자유 카테고리·제약조건 상태 변경
title: "[Command] COMMAND-001: 미래지출·제약 저장"
labels: 'command, feature, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-001 미래지출·제약 저장

## Summary
- 목적: 미래지출과 카드 제약을 검증·정규화해 사용자 소유 데이터로 저장한다.
- REQ: REQ-FUNC-001A/B, 003A/B

## References (Spec & Context)
- 계약: DATA-001, API-002
- SRS: 4.1 해당 REQ, 6.2, 8.10 `saveFutureSpend`·`saveConstraints`

## Scope
- 단일·범위 금액, 증가·감소, 자유 카테고리, 시점 저장
- 최대 카드 수·연회비 상한·신규 발급 허용 저장
- 서버 입력·세션·소유권 검증과 원자적 갱신
- 이벤트 종류 선택 강제는 범위 밖

## Task Breakdown
- [ ] 공용 schema로 입력을 검증한다.
- [ ] 비정형 카테고리를 정책에 따라 `기타`로 정규화한다.
- [ ] 사용자 소유 레코드를 transaction으로 upsert한다.
- [ ] 성공·field error·domain error를 API-002 형식으로 반환한다.
- [ ] 변경 감사 이벤트에는 민감 원문 대신 식별자·시각·결과만 기록한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 저장
- Given: 유효한 카테고리·금액·시점·제약이 있다.
- When: 저장 Command를 실행한다.
- Then: 계산 입력에 100% 반영 가능한 사용자 소유 레코드가 저장된다.
### Scenario 2: 잘못된 값
- Given: 음수·비숫자·상한 초과 또는 최소>예상>최대다.
- When: 저장한다.
- Then: field error를 반환하고 DB 변경은 0건이다.
### Scenario 3: 비정형 자유 입력
- Given: 특수문자·이모지가 포함된 카테고리다.
- When: 저장한다.
- Then: 크래시 없이 승인된 정규화 결과로 저장된다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: API-002 입력 DTO, DATA-001 제약/금액 규칙, 사용자 세션
- Writes: FutureSpendPlan 및 제약 상태, 변경 이벤트
- Side Effects: 감사 이벤트 기록(민감 원문·금액 로그 금지)
- Transaction Boundary: 검증·upsert·이벤트 outbox를 하나의 원자적 트랜잭션으로 처리
- Idempotency: `requestId`와 사용자 ID 조합으로 중복 저장 방지
- Retry Policy: 일시적 DB 오류만 제한 재시도하며 검증 오류는 재시도하지 않음

## Verification Gates
- Test Gate: TEST-001의 정상·경계·실패 GWT와 API-002 계약 테스트 통과
- NFR Gate: NFR-004 입력 검증/민감정보 로깅 마스킹 증거 제출
- Evidence Location: 테스트 결과와 스키마 검증 로그를 TASK 실행 결과에 첨부

- Server Action에서 서버 검증을 반복하고 Prisma는 server-only로 사용한다.
- 금액 정밀도와 범위 규칙은 DATA-001을 따른다.
- 타 사용자 레코드 변경 0건, 민감 입력 로그 0건이어야 한다.

## Definition of Done
- [ ] TEST-001 입력·플랫폼 테스트가 통과한다.
- [ ] TEST-006 M1 E2E의 입력 구간이 통과한다.
- [ ] API-002 오류 계약과 데이터 사전이 일치한다.
- [ ] 미확정 범위 정책을 임의 값으로 구현하지 않았다.

## Dependencies & Interactions
- Depends on: DATA-001, API-002, TEST-001 실패 기준선
- Blocks: COMMAND-003, QUERY-001, 입력 UI
- 변경 전파: DATA-001·API-002·MOCK-001·TEST-001·UI 입력 TASK

## Open Decisions
- `SINGLE/RANGE`와 LOW·BASE·HIGH 변환 규칙, 자유 카테고리 정규화 최종 정책

## 결론
계산의 최초 상태 변경을 하나의 검증 가능한 Command로 고정한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. 저장 Command의 원자성·멱등성·재시도 경계를 명시하고 TEST-001/NFR-004를 게이트로 고정.
