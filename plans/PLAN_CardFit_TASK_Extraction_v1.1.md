# CardFit TASK 추출 계획서 v1.1

| 항목 | 내용 |
| --- | --- |
| 문서 목적 | CardFit SRS를 AI 에이전트가 안전하게 구현할 수 있는 닫힌 문맥의 TASK로 변환한다. |
| 기준 SRS | `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md` |
| 선행 결정 | `tasks/TASK-001_Net-Benefit-및-지출-시나리오-정책-기준선.md` |
| 이전 방식 | 기능 요구사항과 GWT 인수 조건 중심의 TASK 추출 |
| v1.1 핵심 변경 | Contract 우선 추출, Query·Command 분리, AC의 자동화 테스트 TASK 전환 |
| 상태 | Proposed |

## 1. 목적과 완료 기준

이 계획의 목적은 SRS의 요구사항을 단순한 기능 목록으로 옮기는 것이 아니다. 데이터 구조와 통신 계약을 먼저 고정하고, 각 기능을 상태 변경 경계에 따라 분리하며, 인수 조건을 실행 가능한 테스트로 변환하는 것이 목적이다.

TASK 추출 작업은 다음 조건을 모두 충족해야 완료된다.

1. 모든 구현 TASK가 승인된 Contract를 참조한다.
2. DB Schema, API DTO, 공통 도메인 타입, Fixture가 기능 구현보다 먼저 추출된다.
3. Query와 Command가 같은 TASK에 포함되지 않는다.
4. 순수 계산과 계산 결과 저장이 별도 TASK로 분리된다.
5. 각 AC가 하나 이상의 자동화 테스트 TASK 또는 테스트 케이스에 연결된다.
6. 구현 TASK는 연결된 테스트가 통과해야 완료될 수 있다.
7. TASK 간 의존성과 실행 순서가 순환 없이 정의된다.

## 2. TASK 추출 핵심 원칙

### 2.1 Contract를 기능보다 먼저 추출한다

SRS를 다음 순서로 스캔한다.

1. 데이터 모델과 엔터티
2. API 및 외부 인터페이스
3. 공통 타입, enum, 오류 코드
4. Fixture, Seed, Golden Example
5. 기능 요구사항
6. 인수 조건과 비기능 요구사항
7. UI와 통합 흐름

Contract TASK는 구현 에이전트가 임의의 필드와 타입을 만들지 못하도록 하는 단일 진실 공급원이다. 각 Contract에는 필드명, 타입, 필수 여부, 단위, null 처리, enum, 버전, 유효성 규칙, 오류 응답을 포함한다.

### 2.2 상태 변경 여부로 닫힌 문맥을 만든다

모든 기능 TASK는 다음 유형 중 하나만 가져야 한다.

| 유형 | 정의 | 허용되는 주요 동작 |
| --- | --- | --- |
| `Contract` | 데이터 또는 통신 규격을 정의한다. | Schema, DTO, 타입, 오류 계약 정의 |
| `Fixture` | 결정적 테스트 데이터를 만든다. | Seed, Mock, Golden Example 작성 |
| `Query` | 상태를 변경하지 않고 데이터를 읽는다. | 조회, 검색, 집계, 읽기 전용 계산 |
| `Command` | 검증 후 상태를 변경한다. | 생성, 수정, 삭제, 상태 전이 |
| `Pure Calculation` | 저장 없이 입력을 결정적으로 계산한다. | 시나리오 변환, Net Benefit 계산 |
| `Test` | Contract와 AC를 자동 검증한다. | 단위, 계약, 통합, E2E 테스트 |
| `UI` | 승인된 Contract를 사용해 사용자 상호작용을 제공한다. | 입력, 조회, 명령 호출, 결과 표시 |
| `Integration` | 여러 경계의 연결만 검증한다. | Adapter, 외부 연동, E2E 흐름 |

하나의 TASK가 두 유형에 걸치면 원칙적으로 분리한다. 예를 들어 시나리오 계산과 결과 저장은 `Pure Calculation`과 `Command`로 나누며, 결과 저장과 결과 조회도 별도 TASK로 나눈다.

### 2.3 AC를 자동화 테스트 TASK로 변환한다

GWT 문장은 수동 완료 체크리스트로 끝내지 않는다. 각 AC를 정상, 예외, 경계, 권한, 재시도 조건으로 분류하고 실행 가능한 테스트 TASK로 변환한다.

각 테스트 TASK에는 다음 항목을 기록한다.

- 대상 REQ 및 AC ID
- 테스트 수준: Unit, Contract, Integration, E2E
- 입력 Fixture
- 실행 대상과 명령
- 기대 결과와 오류 코드
- 경계값 및 실패 조건
- 통과해야 완료할 수 있는 구현 TASK ID

## 3. 표준 TASK 문맥

모든 TASK 문서는 다음 필드를 포함한다.

| 필드 | 작성 규칙 |
| --- | --- |
| Task ID | 유형 접두사를 사용한다. 예: `CTR-001`, `QRY-001`, `CMD-001`, `TST-001` |
| Task Type | 한 가지 유형만 선택한다. |
| Objective | 하나의 결과만 서술한다. |
| SRS Trace | REQ, AC, 엔터티, 인터페이스의 정확한 위치를 연결한다. |
| Depends On | 착수 전에 완료되어야 하는 TASK ID를 기록한다. |
| Reads | 읽는 엔터티·필드·계약을 기록한다. 없으면 `None`으로 쓴다. |
| Writes | 변경하는 엔터티·필드를 기록한다. 없으면 `None`으로 쓴다. |
| Side Effects | 이벤트, 로그, 외부 호출을 기록한다. 없으면 `None`으로 쓴다. |
| Transaction Boundary | 원자적으로 처리할 범위를 기록한다. Query와 Contract에는 `N/A`를 쓴다. |
| Idempotency | 재요청 처리 규칙과 idempotency key 사용 여부를 기록한다. |
| Input Contract | 승인된 DTO·도메인 타입·Fixture를 연결한다. |
| Output Contract | 반환 DTO·오류 계약·저장 결과를 연결한다. |
| Test Gate | 완료 전에 통과해야 할 테스트 TASK를 연결한다. |
| Out of Scope | 이 TASK가 수정하지 않을 영역을 명시한다. |

## 4. 추출 단계와 TASK 카탈로그

### 4.1 M0-A: 정책과 Contract 기준선

| 순서 | TASK ID | 유형 | 닫힌 목적 | 주요 산출물 | 선행 TASK |
| :---: | --- | --- | --- | --- | --- |
| 1 | `DEC-001` | Decision | Net Benefit 9개 정책과 시나리오 정책을 승인한다. | Policy Decision Log, `policy_version` | 없음 |
| 2 | `CTR-001` | Contract | 금액·기간·시나리오·신뢰도 공통 타입을 정의한다. | `Money`, `Period`, `ScenarioCode`, `ConfidenceCode` | DEC-001 |
| 3 | `CTR-002` | Contract | 핵심 엔터티와 관계 및 상태 enum을 정의한다. | Prisma Schema 초안, ERD, null 정책 | CTR-001 |
| 4 | `CTR-003` | Contract | 미래지출 입력 API 계약을 정의한다. | Request·Response DTO, 오류 코드 | CTR-001, CTR-002 |
| 5 | `CTR-004` | Contract | 시나리오 계산 API 계약을 정의한다. | 계산 입력·출력 DTO, 정책 버전 필드 | CTR-001, CTR-002 |
| 6 | `CTR-005` | Contract | 추천 결과·근거·유지 결론 계약을 정의한다. | Recommendation DTO, Evidence DTO | CTR-001, CTR-002 |
| 7 | `CTR-006` | Contract | 추천 이행 기록과 조회 계약을 정의한다. | Action DTO, 상태 전이표 | CTR-002, CTR-005 |
| 8 | `CTR-007` | Contract | 공통 API 오류와 검증 실패 계약을 정의한다. | 오류 envelope, HTTP 상태 매핑 | CTR-003~006 |
| 9 | `CTR-008` | Contract | Platform Adapter 경계를 정의한다. | Port 인터페이스, Mock·Production 계약 | CTR-001, CTR-002 |

Contract 단계에서는 화면과 비즈니스 로직을 구현하지 않는다. DTO와 DB 모델에서 같은 개념을 사용하더라도 전송 모델과 영속 모델을 무조건 동일 객체로 취급하지 않는다.

### 4.2 M0-B: Fixture와 Contract 검증

| 순서 | TASK ID | 유형 | 닫힌 목적 | 주요 산출물 | 선행 TASK |
| :---: | --- | --- | --- | --- | --- |
| 10 | `FIX-001` | Fixture | 비식별 사용자·보유카드·지출내역 Fixture를 만든다. | Seed 및 Mock Adapter 응답 | CTR-002, CTR-008 |
| 11 | `FIX-002` | Fixture | 정상·경계·데이터 부재 Golden Example을 만든다. | 입력과 기대 계산 결과 | DEC-001, CTR-001, CTR-004 |
| 12 | `TST-001` | Test | Prisma Schema의 관계·제약·enum을 검증한다. | Schema 검증 테스트 | CTR-002 |
| 13 | `TST-002` | Test | Request·Response DTO와 오류 envelope를 검증한다. | API Contract Test | CTR-003~007 |
| 14 | `TST-003` | Test | Mock Adapter가 Platform Port 계약을 준수하는지 검증한다. | Adapter Contract Test | CTR-008, FIX-001 |

Fixture에는 실제 개인신용정보를 넣지 않는다. 동일 Seed와 `policy_version`을 사용하면 모든 환경에서 같은 기대 결과가 나와야 한다.

### 4.3 M0-C: Pure Calculation과 테스트 루프

| 순서 | TASK ID | 유형 | 닫힌 목적 | Reads | Writes | Test Gate |
| :---: | --- | --- | --- | --- | --- | --- |
| 15 | `TST-004` | Test | 시나리오 변환의 정상·경계·실패 조건을 검증한다. | FIX-002 | None | 자체 통과 |
| 16 | `CAL-001` | Pure Calculation | 단일·범위 입력을 세 지출 시나리오로 변환한다. | Scenario Policy, FutureSpend DTO | None | TST-004 |
| 17 | `TST-005` | Test | Net Benefit 9개 정책과 누락 데이터 fallback을 검증한다. | FIX-002 | None | 자체 통과 |
| 18 | `CAL-002` | Pure Calculation | 카드 조합별 Gross Benefit과 전환비용을 계산한다. | Card Rule, Policy, Scenario | None | TST-005 |
| 19 | `TST-006` | Test | D2 미만·동일·초과 및 완전 동률을 검증한다. | FIX-002 | None | 자체 통과 |
| 20 | `CAL-003` | Pure Calculation | D2 게이팅과 동률 안정 정렬을 수행한다. | Net Benefit 결과, Policy | None | TST-006 |
| 21 | `TST-007` | Test | 배분 합계·차액·근거 항목의 결정성을 검증한다. | FIX-002 | None | 자체 통과 |
| 22 | `CAL-004` | Pure Calculation | 확정 조합의 결제수단 배분과 근거를 계산한다. | 추천 조합, Scenario | None | TST-007 |

계산 TASK는 DB 저장이나 외부 호출을 하지 않는다. 각 계산 구현은 연결된 테스트가 먼저 실패하는 상태를 확인한 뒤 테스트를 통과하도록 구현한다.

### 4.4 M1: Query와 Command 테스트 계약

구현보다 먼저 아래 테스트 TASK를 추출하고, 승인된 Contract와 Fixture만으로 입력·기대 결과를 고정한다. 구현 TASK는 연결된 테스트가 실패하는 것을 확인한 뒤 착수한다.

| TASK ID | 테스트 수준 | 검증 대상 | 연결 구현 TASK |
| --- | --- | --- | --- |
| `TST-008` | Unit·Integration | 동의 생성·철회 상태 전이 및 중복 요청 | CMD-001 |
| `TST-009` | Integration | 동의 상태와 과거 데이터 조회 권한 | QRY-001, QRY-002 |
| `TST-010` | Unit·Integration | 미래지출 단일·범위 입력 저장과 검증 오류 | CMD-002 |
| `TST-011` | Integration | 미래지출 조회의 소유권과 데이터 없음 | QRY-003 |
| `TST-012` | Integration | 추천 실행 저장의 트랜잭션·멱등성·정책 버전 | CMD-003 |
| `TST-013` | Integration | 시나리오별 결과·유지 결론·근거 조회 | QRY-004 |
| `TST-014` | Unit·Integration | 추천 행동 상태 전이와 중복 기록 | CMD-004 |
| `TST-015` | Integration | 이행 이력 조회와 권한 분리 | QRY-005 |

### 4.5 M1: Query와 Command 분리

| 순서 | TASK ID | 유형 | 닫힌 목적 | Reads | Writes | 주요 예외 테스트 |
| :---: | --- | --- | --- | --- | --- | --- |
| 23 | `QRY-001` | Query | 마이데이터 동의 상태를 조회한다. | Consent | None | 미동의·만료 상태 |
| 24 | `CMD-001` | Command | 마이데이터 동의 또는 철회를 기록한다. | Consent Contract | Consent | 중복 요청·철회 전이 |
| 25 | `QRY-002` | Query | 과거 지출내역과 보유카드를 조회한다. | Transaction, OwnedCard | None | 데이터 없음·부분 누락 |
| 26 | `CMD-002` | Command | 미래지출 입력을 검증하고 저장한다. | FutureSpend DTO | FutureSpendPlan | 잘못된 범위·중복 요청 |
| 27 | `QRY-003` | Query | 저장된 미래지출 계획을 조회한다. | FutureSpendPlan | None | 없음·권한 불일치 |
| 28 | `CMD-003` | Command | 승인된 계산기로 추천 실행 결과를 저장한다. | Contract, CAL-001~004 출력 | CalculationRun, Recommendation | 정책 버전 불일치·재요청 |
| 29 | `QRY-004` | Query | 세 시나리오별 추천 결과와 근거를 조회한다. | CalculationRun, Recommendation | None | 실행 없음·만료 결과 |
| 30 | `CMD-004` | Command | 추천안 선택·유지·보류 행동을 기록한다. | Action DTO | RecommendationAction | 중복·불가능한 상태 전이 |
| 31 | `QRY-005` | Query | 추천 이행 상태와 이력을 조회한다. | RecommendationAction | None | 이력 없음·권한 불일치 |

각 Command는 입력 검증, 상태 전이, 트랜잭션 범위, 멱등성 규칙을 명시한다. 각 Query는 읽기 전용임을 테스트하고 상태 변경 Side Effect를 허용하지 않는다.

### 4.6 M2: UI와 통합

| TASK ID | 유형 | 목적 | 선행 TASK | Test Gate |
| --- | --- | --- | --- | --- |
| `E2E-001` | Test | 동의부터 비식별 데이터 준비까지 검증한다. | UI-001 | 자체 통과 |
| `E2E-002` | Test | 미래지출 입력의 정상·오류·경계 흐름을 검증한다. | UI-002 | 자체 통과 |
| `E2E-003` | Test | 세 탭의 추천·유지 결론·근거 일관성을 검증한다. | UI-003, UI-004 | 자체 통과 |
| `E2E-004` | Test | 추천 행동 기록과 이력 조회를 검증한다. | UI-005 | 자체 통과 |
| `UI-001` | UI | 동의 상태와 데이터 준비 상태를 표시한다. | QRY-001, CMD-001, QRY-002 | E2E-001 |
| `UI-002` | UI | 미래지출 단일·범위 입력과 검증 오류를 제공한다. | CMD-002, QRY-003 | E2E-002 |
| `UI-003` | UI | `더 적게`, `예상대로`, `더 많이` 탭으로 결과를 표시한다. | CMD-003, QRY-004 | E2E-003 |
| `UI-004` | UI | 유지 결론, 차액, 계산 근거와 미반영 항목을 표시한다. | QRY-004 | E2E-003 |
| `UI-005` | UI | 추천 선택·유지·보류와 이행 상태를 제공한다. | CMD-004, QRY-005 | E2E-004 |

## 5. AC 변환 매트릭스

TASK 추출 시 모든 SRS AC를 다음 형식으로 매핑한다. AC가 테스트와 연결되지 않으면 추출 완료로 판정하지 않는다.

| SRS 요구사항·AC | 테스트 TASK | 최소 검증 조건 |
| --- | --- | --- |
| REQ-FUNC-001A, REQ-FUNC-003B | TST-004, TST-010, E2E-002 | 단일·범위 입력, 음수, 역전 범위, 0원 정책 |
| REQ-FUNC-004 | TST-004, E2E-003 | 세 시나리오 금액과 표시 문구의 일치 |
| REQ-FUNC-005, REQ-GR-002 | TST-005, TST-006, E2E-003 | D2 게이팅과 임계 미달 변경 추천 0건 |
| REQ-FUNC-006 | TST-007, E2E-003 | 배분 합계와 추천 조합 일치 |
| REQ-FUNC-007 | TST-007, TST-013, E2E-003 | 계산 근거와 미반영 항목 공개 |
| REQ-FUNC-011 | TST-006, TST-013 | 카드별 기여 순혜택과 안정 정렬 |
| 추천 이행 AC | TST-014, TST-015, E2E-004 | 선택·유지·보류 상태 전이와 이력 |

## 6. 실행 순서와 병렬화 기준

```text
DEC-001
  -> CTR-001 -> CTR-002
       -> CTR-003~008
            -> FIX-001~002
                 -> TST-001~003
                      -> CAL/TST 쌍
                           -> Query/Command와 대응 TST
                                -> UI와 E2E
```

다음 조건에서만 TASK를 병렬로 실행한다.

- 동일한 승인 Contract를 참조한다.
- 서로 같은 파일이나 DB 상태를 수정하지 않는다.
- 선행 테스트 Fixture가 고정돼 있다.
- 한 TASK의 출력이 다른 TASK의 미확정 입력이 아니다.

Contract가 승인되기 전에는 하위 구현을 병렬로 시작하지 않는다.

## 7. TASK 착수 및 완료 게이트

### Definition of Ready

- Objective가 하나의 문장과 하나의 결과로 정의돼 있다.
- Task Type이 하나만 지정돼 있다.
- SRS REQ·AC 및 선행 Contract 링크가 있다.
- Reads, Writes, Side Effects가 명시돼 있다.
- Command에는 트랜잭션과 멱등성 규칙이 있다.
- 입력 Fixture와 기대 결과가 준비돼 있다.
- 대응 Test Task와 실패 조건이 정의돼 있다.
- Out of Scope가 명시돼 있다.

### Definition of Done

- 연결된 자동화 테스트가 모두 통과한다.
- 테스트 실행 명령과 결과가 TASK에 기록돼 있다.
- 승인된 Contract와 다른 필드·enum·오류 코드를 추가하지 않았다.
- Query는 저장 상태를 변경하지 않는다.
- Command는 지정된 상태와 이벤트만 변경한다.
- 정상·예외·경계 조건이 모두 테스트된다.
- 변경된 코드와 문서가 추적 대상 REQ·AC에 연결된다.
- 후속 TASK에 미확정 데이터 구조를 넘기지 않는다.

## 8. 기존 TASK-001 보완 적용 방법

기존 TASK-001은 정책 결정이라는 닫힌 문맥을 유지하므로 폐기하지 않는다. 다음 사항만 후속 개정본에 추가한다.

1. Task ID를 `DEC-001`과 병기하고 Task Type을 `Decision`으로 명시한다.
2. 산출물의 저장 경로와 기계 판독 가능한 정책 Schema를 정의한다.
3. Golden Example의 수기 재계산 후 동일 사례를 자동 테스트 Fixture로 고정한다.
4. AC-002, AC-004, AC-005, AC-006을 각각 TST-004~006에 연결한다.
5. `후속 TASK 묶음`을 이 계획서의 CTR, FIX, CAL, TST, QRY, CMD ID로 교체한다.
6. 정책 승인만으로 구현 TASK가 완료되지 않으며 대응 테스트 통과가 필요하다고 명시한다.

## 9. 추출 검토 체크리스트

- [ ] 기능 TASK보다 Contract TASK가 먼저 배치돼 있다.
- [ ] Prisma Schema, DTO, enum, 오류 계약이 독립 TASK다.
- [ ] Fixture와 Golden Example이 독립 TASK다.
- [ ] Query와 Command가 분리돼 있다.
- [ ] 순수 계산과 저장이 분리돼 있다.
- [ ] 각 Command에 상태 전이와 트랜잭션 경계가 있다.
- [ ] 각 Query의 Writes가 `None`이다.
- [ ] 모든 AC가 자동화 테스트 TASK에 연결돼 있다.
- [ ] 정상·예외·경계 조건이 테스트에 포함돼 있다.
- [ ] 구현 TASK마다 Test Gate가 있다.
- [ ] UI는 승인된 API Contract만 사용한다.
- [ ] 실제 외부 연동과 Mock Adapter가 같은 Port 계약을 따른다.
- [ ] TASK 간 순환 의존성이 없다.
- [ ] 각 TASK의 Out of Scope가 명확하다.

## 10. 변경 이력

| 버전 | 변경 내용 |
| --- | --- |
| v1.0 | 기능 요구사항과 GWT 인수 조건 중심으로 TASK를 작성했다. |
| v1.1 | Contract 우선순위, 상태 변경 경계, AC 자동화 테스트 전환, 단계별 TASK 카탈로그와 실행 게이트를 추가했다. |
