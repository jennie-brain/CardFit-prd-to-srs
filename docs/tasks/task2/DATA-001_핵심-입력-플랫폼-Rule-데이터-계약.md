---
name: CardFit Data Task
about: CardFit 핵심 입력·플랫폼·카드 Rule의 Prisma 기준선 정의
title: "[Data] DATA-001: 핵심 입력·플랫폼·Rule 데이터 계약"
labels: 'data, prisma, supabase, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — DATA-001 핵심 입력·플랫폼·Rule 데이터 계약

## Summary

- 목적: 사용자 입력, 플랫폼 파생 데이터, 카드 혜택 Rule의 관계형 기준선을 Prisma schema로 정의한다.
- 범위: `User`, `HeldCard`, `PastSpend`, `FutureSpendPlan`, `Constraint`, `BenefitRule`
- 사용자 가치: 계산 입력과 적용 Rule의 기준일·완전성·버전을 보존해 결과를 설명하고 재현할 수 있게 한다.

## References (Spec & Context)

- SRS: 6.2.1~6.2.5, 6.4, `REQ-DATA-001~007`, `REQ-FUNC-001A/B·002·003A/B`
- PRD: F-01·02·08·09, 데이터·인터페이스 개요
- 기술 제약: C-TEC-003, REQ-ARCH-002·006, REQ-SEC-003·004

## Scope

### In Scope

- 6개 엔터티, PK/FK, 사용자 소유권, decimal/date/datetime/enum 타입 정의
- Adapter 품질 메타데이터(`data_as_of`, `sync_status`, `completeness`, `source`)를 저장 DTO와 연결
- 미래지출의 단일값·범위 및 LOW·BASE·HIGH 변환에 필요한 입력 표현. 사용자 입력 `confidence`는 M1에서 제외
- 취소·부분 취소 연결에 필요한 `PastSpend` 최소 거래 원장과 12개월 rolling retention
- `rule_version`, 유효기간, 제외항목과 최신성 상태
- Local Supabase migration·비식별 seed 기준

### Out of Scope

- 실제 마이데이터 원본 응답·토큰·인증서 저장
- 계산 결과·조합·배분 엔터티(DATA-002)
- 선택·이행·관측 엔터티(DATA-003)
- 카드사 약관 크롤러 구현

## Execution Contract

- Reads: SRS·PRD 데이터 모델과 승인된 개인정보·보존 정책
- Writes: Prisma schema, migration, seed와 데이터 사전
- Side Effects: Local Supabase schema 변경. 외부 플랫폼과 Production DB 쓰기는 `None`
- Transaction Boundary: migration 단위로 원자 적용하고 seed 실패 시 부분 기준선을 승인하지 않는다.
- Idempotency: 동일 migration·seed 재실행 결과가 동일해야 한다.
- Retry Policy: migration 실패는 자동 반복하지 않고 forward-fix migration으로 복구한다.

## Task Breakdown

- [ ] SRS와 PRD의 필드 차이를 데이터 사전으로 대조한다.
- [ ] Prisma enum, model, relation, unique/index와 정수 원 단위 금액 타입을 정의한다.
- [ ] 사용자별 소유권과 동의 상태 전이를 DB 제약·서비스 제약으로 구분한다.
- [ ] `FutureSpendPlan.input_mode`의 `SINGLE/RANGE`와 `minimum_amount ≤ expected_amount ≤ maximum_amount` 제약을 구현한다. `SINGLE`은 세 금액을 동일하게 저장한다.
- [ ] Adapter 품질 메타데이터와 캐시 기준일 필드를 확정한다.
- [ ] `BenefitRule.rule_version` 유일성·유효기간·최신성 조회 인덱스를 정의한다.
- [ ] Expand 방식 migration과 rollback 대신 forward-fix 절차를 작성한다.
- [ ] 정상·부분·오래된 비식별 seed를 작성한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 로컬 DB 재현

- Given: 새 개발 환경에서 Supabase CLI가 실행 중이다.
- When: Prisma migration과 seed를 순서대로 실행한다.
- Then: 6개 엔터티와 관계·enum·index가 생성되고 비식별 seed 조회가 성공한다.

### Scenario 2: 잘못된 미래지출 범위 거부

- Given: 최소값이 예상값보다 크거나 예상값이 최대값보다 큰 입력이 주어진다.
- When: 저장 계약을 검증한다.
- Then: DB 쓰기 전에 오류를 반환하고 잘못된 레코드 저장 건수는 0건이다.

### Scenario 3: 동의 철회와 민감 데이터 파기

- Given: 사용자의 동의 상태가 `철회`로 전이된다.
- When: 철회 처리 규칙이 실행된다.
- Then: 해당 사용자의 `HeldCard`·`PastSpend` 파생 캐시는 즉시 파기되고 토큰·원본 응답은 애초에 저장되어 있지 않다.

## Technical & Non-Functional Constraints

- Prisma schema가 유일한 관계형 모델 기준선이다.
- runtime `DATABASE_URL`과 migration `DIRECT_URL`을 분리한다.
- Prisma 접근은 Node.js server-only 경계에서만 허용한다.
- 금액은 부동소수점 오차가 없는 Decimal 또는 정수 원 단위로 저장한다.
- `PastSpend`·`HeldCard`에는 사용자 FK와 데이터 출처·기준일을 포함하고 타 사용자 조회를 차단한다.
- 실제 개인신용정보 Fixture 사용은 금지한다.
- `PastSpend`는 외부 거래·원거래 식별자 HMAC, 사용자, 카드 상품, 거래일, 정수 원 단위 금액, 카테고리, 상태와 누적 취소 금액만 저장한다.
- 가맹점명, 지점, 거래메모, 승인번호 원문과 Adapter 원본 응답은 저장하지 않는다.
- 동의 만료 시 계산·동기화를 중단하고 컴플라이언스 승인 시 최대 7일간 격리 보존한다. 명시적 철회·탈퇴·삭제 요청 시 즉시 파기한다.

## Verification Gates

- Test Gate: TEST-001·005의 migration, 범위 무결성, 소유권·비밀정보 검사가 통과해야 한다.
- NFR Gate: NFR-004의 보존·파기·오조회 기준을 충족해야 한다.
- Evidence Location: Prisma schema·migration·seed, 데이터 사전과 Local Supabase 재현 로그

## Definition of Done

- [ ] Prisma schema, migration, seed가 Local Supabase에서 재현된다.
- [ ] 필드·enum·관계·index 데이터 사전이 최신화됐다.
- [ ] 정상·무결성 위반·소유권 격리 검증이 통과한다.
- [ ] Client bundle에 Prisma Client·DB URL이 포함되지 않는다.
- [ ] DATA-002, API-001·002가 참조할 타입 이름이 고정됐다.

## Dependencies & Interactions

- Depends on: 없음
- Blocks: DATA-002, API-001, API-002, MOCK-001, COMMAND-001·002
- Interacts with: REQ-FUNC-001A/B·002·003A/B·008, REQ-NF-005·006·008
- 변경 전파: schema 변경 시 API DTO, Fixture, seed, migration, 데이터 사전을 함께 변경한다.

## Open Decisions

- [x] KRW 정수 원의 Prisma DB 타입을 `BigInt`로 고정한다.

## 결론

DATA-001은 CardFit 계산의 입력 정합성과 Rule 추적성을 고정하는 최초 계약이다. 금액은 `BigInt` 기반 KRW 정수 원으로 저장하고, 남은 정책·Production 연동 결정은 External Blocker로 관리한다.

## 출처

- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `docs/product/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — M1 입력·금액·최소 거래 원장 정책 확정

- 결정: `FutureSpendPlan.confidence`를 M1에서 제외하고 모든 금액은 KRW 정수 원 단위로 동기화·저장·계산한다.
- 결정: `PastSpend`는 취소·부분 취소 정합성에 필요한 최소 거래 원장만 최근 12개월간 보존하며 거래 식별자는 HMAC으로 저장한다.
- 파기: 동의 만료 시 신규 처리를 중단하고 컴플라이언스 승인 시 최대 7일간 격리 보존한다. 철회·탈퇴·삭제 요청 시 즉시 파기한다.
- 영향: 가맹점명·지점·거래메모·승인번호 원문과 Adapter 원본 응답을 DATA-001 계약에서 제외한다.

### 2026-08-26 — KRW 금액 타입 `BigInt` 확정

- 결정: 모든 금액 필드는 KRW 정수 원 단위의 `BigInt`로 저장한다.
- 근거: 누적 지출·혜택·배분 금액의 범위를 확보하면서 부동소수점 오차를 피할 수 있다.
- 영향: JSON·HTTP 경계에서는 문자열 직렬화 규칙을 사용하고, API·Mock·계산 테스트가 동일 변환 규칙을 따른다.
