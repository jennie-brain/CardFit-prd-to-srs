# Step 1 Contract/Data/Mock 풀버전 TASK 검토 보고서

## 기술 요약

Step 1 산출물 11개는 공통 문서 구조와 SRS 추적성, Contract·Data·Mock의 책임 분리를 갖췄다. 특히 SPEC-001·002를 추가해 읽기 ViewModel과 이벤트 schema를 Logic보다 먼저 고정하고, MOCK-001에서 Query·Command 의존성을 제거한 방향은 적절하다.

1차 검토 판정은 **REVISE**였으나, 권장 수정안을 적용한 현재 재검토 판정은 **PASS WITH OPEN DECISIONS**다. Step 2로 진행할 수 있지만, 미승인 정책은 여전히 External Blocker로 유지한다.

1. SPEC-001과 MOCK-001의 공통 의존성이 M2 전용 DATA-003·API-004까지 포함해 M1 Contract Gate를 차단한다.
2. 정책·컴플라이언스 승인이 일부 문서의 `Depends on`에 섞여 있어 TASK 의존성과 외부 결정 의존성을 기계적으로 구분할 수 없다.
3. DATA-001의 결론에 이미 해소된 `confidence enum·보존기간 미확정` 표현이 남아 Decision Log와 충돌한다.
4. 기존 DATA·API 문서의 `Blocks`와 `Change Propagation`이 일반 명사 중심이라 후행 TASK ID를 자동 검증하기 어렵다.

네 P0 항목을 수정한 결과 M1 Contract 경로가 M2 전용 TASK와 분리되었고, Step 2를 시작할 수 있는 상태가 됐다.

## 1. 검토 범위와 기준

### 1.1 검토 대상

| 유형 | TASK | 수량 |
|---|---|---:|
| Data Contract | DATA-001~003 | 3 |
| API Contract | API-001~005 | 5 |
| Shared Specification | SPEC-001~002 | 2 |
| Mock Contract | MOCK-001 | 1 |
| **합계** |  | **11** |

### 1.2 검토 기준

- SRS·PRD 근거와 TASK 범위가 연결되는가?
- Contract가 Logic 구현 전에 독립적으로 완결되는가?
- M1과 M2 의존성이 서로의 Gate를 불필요하게 차단하지 않는가?
- Reads·Writes·Side Effects·Transaction·Idempotency·Retry가 명시되는가?
- 정상·경계·실패 AC가 자동 검증 가능한가?
- Test Gate와 NFR Gate가 연결되는가?
- `Depends on`, `Blocks`, `External Blockers`가 구분되는가?
- Decision Log가 문서의 마지막에 있는가?

## 2. 구조와 추적성은 합격했다

### 2.1 문서 구조

11개 문서가 모두 다음 섹션을 포함한다.

- Execution Contract
- Acceptance Criteria
- Technical & Non-Functional Constraints
- Verification Gates
- Definition of Done
- Dependencies & Interactions
- Open Decisions
- Decision Log

모든 문서에서 Decision Log가 마지막 `##` 섹션이며 누락은 0건이다.

### 2.2 테스트 가능한 시나리오

| TASK | GWT Scenario 수 | Open Decisions 수 |
|---|---:|---:|
| DATA-001 | 3 | 1 |
| DATA-002 | 4 | 4 |
| DATA-003 | 4 | 4 |
| API-001 | 4 | 3 |
| API-002 | 3 | 3 |
| API-003 | 5 | 4 |
| API-004 | 4 | 3 |
| API-005 | 4 | 4 |
| SPEC-001 | 3 | 3 |
| SPEC-002 | 3 | 3 |
| MOCK-001 | 4 | 3 |
| **합계** | **41** | **35** |

각 TASK에는 정상 또는 대표 성공 경로와 실패·부분·인가·멱등성 중 하나 이상의 검증 경로가 있다. 구조적 테스트 가능성은 충분하다.

### 2.3 책임 분리

- DATA-001~003은 관계형 데이터와 상태·보존 계약을 소유한다.
- API-001~005는 Adapter, Server Action, HTTP와 운영 인터페이스를 소유한다.
- SPEC-001은 Query ViewModel·상태·오류 schema를 소유한다.
- SPEC-002는 제품·Guardrail 이벤트 schema를 소유한다.
- MOCK-001은 승인된 DATA·API·SPEC을 구현하며 별도 계약을 만들지 않는다.

MOCK-001의 본문에서 Query·Command 의존성은 0건이다. 이전 순환 가능성은 책임 수준에서 제거됐다.

## 3. M1 계약이 M2 승인에 묶인 문제를 수정해야 한다

### 3.1 현재 문제

SPEC-001과 MOCK-001은 `DATA-001~003, API-001~005` 전체에 의존한다. 그러나 DATA-003과 API-004는 관측 목적·컴플라이언스 승인이 필요한 M2 계약이다.

이 상태로 해석하면 다음과 같은 문제가 생긴다.

```text
M2 관측 목적 승인 지연
  → DATA-003·API-004 미완료
  → SPEC-001·MOCK-001 미완료
  → M1 Frontend Mock과 Contract Test 착수 지연
```

이는 “M2 미완료가 M1 합격을 차단하지 않는다”는 인덱스 원칙과 충돌한다.

### 3.2 수정 선택지

| 선택지 | 내용 | 장점 | 단점 | 권장도 |
|---|---|---|---|:---:|
| A. 단계별 의존성 분리 | 각 문서에 M1 Depends on과 M2 Extension Depends on을 나눈다. | 한 문서에서 M1·M2 확장을 관리하면서 Gate가 명확하다. | 자동 파서가 단계별 필드를 지원해야 한다. | **권장** |
| B. M1/M2 TASK 분리 | SPEC·MOCK을 M1과 M2 Issue로 나눈다. | 의존성이 가장 단순하다. | TASK가 늘고 Fixture 중복 가능성이 있다. | 조건부 |
| C. 전체 의존성 유지 | 모든 M2 계약이 끝난 뒤 Mock을 완료한다. | 수정이 없다. | M1 병렬 개발을 차단한다. | 비권장 |

권장 표기는 다음과 같다.

```markdown
- Depends on(M1): DATA-001·002, API-001·002·003·005, SPEC-001·002의 M1 schema
- Depends on(M2 Extension): DATA-003, API-004, SPEC-001·002의 M2 schema
```

기계 판독을 위해 기본 `Depends on`에는 M1 집합을 기록하고, M2 확장은 별도 하위 필드로 두는 방식을 권장한다.

## 4. 외부 결정과 TASK 의존성을 분리해야 한다

### 4.1 현재 혼합된 항목

| TASK | 현재 `Depends on`에 섞인 외부 결정 |
|---|---|
| DATA-003 | 동의·관측 목적 승인 |
| API-003 | Net Benefit 정책 확정 |
| API-004 | 관측 목적 승인 |
| SPEC-002 | 승인된 KPI·Guardrail 산식 |

이 항목들은 파일로 완료되는 개발 TASK가 아니라 사용자·정책·컴플라이언스 결정이다. `Depends on`에서 제거하고 `External Blockers`로 옮겨야 한다.

### 4.2 권장 규칙

```markdown
- Depends on: 실제 TASK ID만 기록
- External Blockers: 정책·계약·승인 주체와 승인 조건 기록
```

정책 미승인 상태에서도 계약 구조 초안은 만들 수 있지만, 필드값·테스트 expected·Production 활성화는 차단해야 한다.

## 5. DATA-001의 본문과 Decision Log가 충돌한다

DATA-001 Decision Log에서는 다음 내용을 확정했다.

- `FutureSpendPlan.confidence` M1 제외
- KRW 정수 원 단위 사용
- 최소 거래 원장 최근 12개월 보존
- 동의 만료 시 승인된 경우 최대 7일 격리

하지만 결론은 여전히 “미확정 enum이나 보존기간”을 승인 전 항목으로 유지한다고 적혀 있다. Open Decisions에는 DB 타입만 남아 있으므로 결론도 다음처럼 수정해야 한다.

> DATA-001은 확정된 입력·금액·최소 거래 원장·보존 정책을 기준선으로 사용한다. Step 2 착수 전에는 KRW 정수 원을 저장할 Prisma 타입만 확정한다.

### DB 타입 선택지

| 선택지 | 장점 | 단점 | 권장도 |
|---|---|---|:---:|
| `BigInt` | 누적 금액과 향후 확장에 안전하다. | JSON 직렬화 시 문자열 변환 규칙이 필요하다. | **권장** |
| `Int` | TypeScript number·JSON 처리와 단순하게 연결된다. | PostgreSQL/Prisma Int 범위가 약 21억 원이라 누적·집계에 부족할 수 있다. | 비권장 |
| Decimal(0 scale) | 통화 타입 확장에 유연하다. | “정수 원” 계약에 비해 처리와 직렬화가 복잡하다. | 조건부 |

## 6. 의존성 필드는 실제 TASK ID로 정규화해야 한다

현재 일부 `Blocks`는 다음처럼 일반 명사로 기록되어 있다.

- `초기값·계산·관측 로직`
- `입력 UI, 계산 요청 흐름`
- `Outcome Command/Query, Cron 로직`
- `관리자·RuleFreshness·배포·NFR·Cron 태스크`

사람은 이해할 수 있지만 GitHub Project와 자동 감사에서는 실제 Issue를 찾기 어렵다. 다음과 같이 바꿔야 한다.

```markdown
- Blocks: COMMAND-002, COMMAND-003, QUERY-001
- Blocks: COMMAND-001, COMMAND-004, UI-003, UI-007
```

모든 `Blocks`를 실제 TASK ID로 바꾸고, 설명이 필요하면 괄호나 별도 `Interacts with`에 기록하는 것이 적절하다.

## 7. TASK별 판정

| TASK | 판정 | 주요 조치 |
|---|:---:|---|
| DATA-001 | REVISE | 결론 정합화, `BigInt` 결정, Blocks ID 정규화 |
| DATA-002 | PASS WITH OPEN DECISIONS | 계산 정책은 External Blocker로 유지하고 Blocks ID 정규화 |
| DATA-003 | REVISE | 관측 승인 항목을 External Blockers로 이동, M2 Gate 표시 |
| API-001 | PASS WITH OPEN DECISIONS | Production Adapter 결정은 M3 Blocker로 유지, Blocks ID 정규화 |
| API-002 | PASS WITH OPEN DECISIONS | Action 저장 단위·오류 code 결정 필요, Blocks ID 정규화 |
| API-003 | REVISE | Net Benefit 승인을 External Blockers로 이동 |
| API-004 | REVISE | 관측 승인을 External Blockers로 이동, M2 전용 Gate 명시 |
| API-005 | PASS WITH OPEN DECISIONS | M1/M2 의존성과 활성화 조건을 분리 |
| SPEC-001 | REVISE | M1과 M2 의존성 분리 |
| SPEC-002 | REVISE | KPI 산식을 External Blockers로 이동하고 M1/M2 schema 분리 |
| MOCK-001 | REVISE | M1과 M2 Fixture 의존성·DoD 분리 |

## 8. Step 2 진입 Gate

다음 조건을 모두 충족하면 Step 1을 PASS로 변경하고 Step 2로 넘어갈 수 있다.

- [x] DATA-001의 금액 DB 타입을 `BigInt`로 결정하고 본문·Open Decisions·Decision Log를 정합화한다.
- [x] SPEC-001·002와 MOCK-001의 M1/M2 의존성을 분리한다.
- [x] DATA-003·API-003·004·SPEC-002의 외부 승인을 `External Blockers`로 이동한다.
- [x] 11개 TASK의 핵심 `Depends on`과 `Blocks`를 실제 TASK ID로 정규화한다.
- [x] M1 계약 경로가 M2 전용 TASK 없이 완결되는지 다시 검사한다.
- [x] MOCK-001의 Query·Command 직접 의존성이 0건인지 검사한다.
- [x] 수정된 11개 문서의 Decision Log가 최신 변경을 기록한다.

## 9. 권장 수정 순서

1. DATA-001의 `BigInt` 여부를 사용자와 확정한다.
2. DATA-001·003의 정책·보존 문구를 정합화한다.
3. SPEC-001·002와 MOCK-001의 M1/M2 의존성을 분리한다.
4. API-003·004의 External Blocker를 정리한다.
5. 모든 Step 1 문서의 Depends on·Blocks를 ID로 정규화한다.
6. 자동 감사 후 이 검토 파일의 판정을 PASS 또는 BLOCKED로 갱신한다.

## 10. 한계와 추가 확인 사항

- 이번 검토는 TASK 문서 계약의 완결성과 의존성만 평가했다. 실제 schema·migration·Mock 코드의 실행 결과는 아직 존재하지 않는다.
- 35개 Open Decisions가 모두 Step 2를 차단하는 것은 아니다. 구조 작성이 가능한 항목과 expected 값·Production 활성화를 차단하는 항목을 별도로 분류해야 한다.
- Net Benefit·동률·관측 목적처럼 승인되지 않은 정책은 Step 2 문서를 작성할 수는 있어도 구현 준비 완료 상태로 만들 수 없다.

## 11. 권장 결론

Step 1의 설계 방향과 문서 기본 구조는 적절하다. 권장 수정안을 적용해 M1/M2 의존성을 분리하고 외부 승인 항목을 Blocker로 정규화했으므로 Step 2 진입을 승인한다. 미승인 정책은 Step 2 Logic의 구현 완료를 차단하는 상태로 유지한다.

## 출처

- `TASK/task1/GitHub_Project_TASK_템플릿.md`
- `TASK/task1/REPORT_표준방법론_기반_TASK리스트_평가와_풀버전_작성계획.md`
- `TASK/task1/STEP1_계약-데이터_TASK_인덱스.md`
- `TASK/task1/CardFit_전체_개발_TASK_리스트.md`
- `TASK/task2/DATA-001~003`
- `TASK/task2/API-001~005`
- `TASK/task2/SPEC-001~002`
- `TASK/task2/MOCK-001`
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — Step 1 산출물 1차 검토

- 판정: REVISE
- 근거: 문서 구조·SRS 추적성·책임 분리는 충족했지만 M1 계약의 M2 역의존, 외부 승인과 TASK 의존성 혼합, DATA-001 본문 불일치와 비정규 Blocks가 남아 있다.
- 영향: Step 2는 보류한다. 제8장의 진입 Gate를 모두 충족한 뒤 본 검토 파일을 갱신하고 사용자 승인을 받아야 한다.

### 2026-08-26 — Step 1 권장 수정 적용 및 재검토

- 판정: PASS WITH OPEN DECISIONS
- 적용: BigInt 확정, M1/M2 의존성 분리, External Blocker 정규화, 핵심 Blocks ID 정규화를 완료했다.
- 검증: Step 1 TASK 11개 구조 오류 0건, MOCK-001의 Query·Command 직접 의존성 0건, Decision Log 누락 0건이다.
- 영향: Step 2 Logic 풀버전 TASK 작성과 검토를 시작할 수 있다. Net Benefit·동률·관측 정책은 구현 차단 Blocker로 남긴다.
