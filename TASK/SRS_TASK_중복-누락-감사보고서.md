# CardFit SRS 대비 TASK 중복·누락 감사 보고서

## 개요

최신 SRS의 요구사항과 TASK 55개를 식별자·책임·의존성 기준으로 대조했다. 감사 결과는 **TASK ID 중복 0건, SRS 요구사항 미매핑 0건, 실제 기능 중복 0건, 외부 결정 Blocker 6종**이다. 기존의 UX/UI 혼재와 계약·Command 5개 누락은 UX-001~007, DATA-004, API-006·007, COMMAND-009·010으로 보완했다.

## 목차

1. 감사 범위와 방법
2. 기능·비기능 요구사항 매핑
3. 기술 요구사항 매핑
4. 중복 후보 판정
5. UX 설계와 Frontend 구현 경계
6. 남은 Blocker
7. 결론
8. 출처

## 1. 감사 범위와 방법

- SRS 기준선: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- TASK 기준선: `DATA/API/MOCK/COMMAND/QUERY/TEST/NFR/UX/UI`
- 식별자 검사: 파일명 기준 55개, 고유 ID 55개, 중복 ID 0개
- 누락 판정: SRS의 REQ-FUNC·NF·UI·AI·SEC·ARCH·DATA·DEPLOY 61개 ID를 개별 매핑
- 중복 판정: 같은 명사를 다루더라도 산출물과 완료 조건이 Contract/Logic/Test/NFR/UX/Frontend로 다르면 중복이 아닌 계층 분리로 판정

## 2. 기능·비기능 요구사항 매핑

### 2.1 기능 요구사항

| SRS ID | Contract | Logic | Test | UX·Frontend | 판정 |
|---|---|---|---|---|---|
| REQ-FUNC-001 | DATA-001, API-002·006 | COMMAND-001, QUERY-001 | TEST-001·006 | UX-002, UI-003 | 충족 |
| REQ-FUNC-001A | DATA-001, API-002·006 | COMMAND-001, QUERY-001 | TEST-001·006 | UX-002, UI-003 | 충족 |
| REQ-FUNC-001B | DATA-001, API-002·006 | COMMAND-001, QUERY-001 | TEST-001 | UX-002, UI-003 | 충족 |
| REQ-FUNC-002 | DATA-001, API-001·006, MOCK-001 | COMMAND-002, QUERY-001 | TEST-001·005·006 | UX-002·003, UI-002·004 | 충족·M3 조건부 |
| REQ-FUNC-003A | DATA-001, API-002·006 | COMMAND-001, QUERY-001 | TEST-001 | UX-002, UI-003 | 충족 |
| REQ-FUNC-003B | DATA-001, API-002·006 | COMMAND-001, QUERY-001 | TEST-001 | UX-002, UI-003 | 충족 |
| REQ-FUNC-004 | DATA-002, API-003·006 | COMMAND-003, QUERY-002 | TEST-002·006 | UX-003, UI-004·005 | 정책 조건부 |
| REQ-FUNC-005 | DATA-002, API-003·006 | COMMAND-003·004, QUERY-002 | TEST-002·006 | UX-003·005, UI-005·007 | SRS 8.5 조건부 |
| REQ-FUNC-006 | DATA-002, API-003·006 | COMMAND-003, QUERY-002 | TEST-002·006 | UX-004, UI-006 | 충족 |
| REQ-FUNC-007 | DATA-002, API-003·006 | QUERY-002, COMMAND-009 | TEST-003·006·007 | UX-004, UI-006 | 충족 |
| REQ-FUNC-008 | DATA-001, API-001·006 | QUERY-001 | TEST-001·007 | UX-002, UI-003 | M2 실험 |
| REQ-FUNC-009 | DATA-004, API-006 | COMMAND-008, QUERY-001 | TEST-003·006 | UX-001·002·004·005, UI-002·006·007 | 승인 문구 조건부 |
| REQ-FUNC-010 | DATA-003, API-004·006·007, MOCK-001 | COMMAND-004~006·010, QUERY-003 | TEST-004·005·007 | UX-005·006, UI-007·008 | M2·승인 조건부 |
| REQ-FUNC-011 | DATA-002, API-003·006 | QUERY-002 | TEST-003 | UX-003, UI-005 | 동률 정책 조건부 |

### 2.2 비기능 요구사항

| SRS ID | 주요 TASK | 검증 TASK | 판정 |
|---|---|---|---|
| REQ-NF-001 | NFR-001, COMMAND-003 | TEST-002·006 | 충족 |
| REQ-NF-002 | NFR-001, QUERY-002 | TEST-003 | 충족 |
| REQ-NF-003 | NFR-002, COMMAND-003·007 | TEST-002 | 충족 |
| REQ-NF-004 | NFR-003, API-005, QUERY-004 | TEST-005·006·007 | 충족 |
| REQ-NF-005 | NFR-004, API-001 | TEST-005 | 충족 |
| REQ-NF-006 | NFR-005, COMMAND-007, QUERY-004 | TEST-002·006 | 충족 |
| REQ-NF-007 | NFR-006, COMMAND-009·010, QUERY-004 | TEST-006·007 | 충족 |
| REQ-NF-008 | NFR-004, DATA-001·003 | TEST-005 | 충족·정책 조건부 |
| REQ-NF-009 | NFR-006, API-007, COMMAND-010, QUERY-004 | TEST-005~007 | 충족 |

## 3. 기술 요구사항 매핑

### 3.1 UI·AI·보안

| SRS ID | 주요 TASK | 판정 |
|---|---|---|
| REQ-UI-001 | UX-001, UI-001 | 충족 |
| REQ-UI-002 | UX-001, UI-001 | 충족 |
| REQ-UI-003 | UX-001, UI-001 | 충족 |
| REQ-UI-004 | API-002·006, UX-002, UI-003 | 충족 |
| REQ-UI-005 | UX-001~007, UI-001~009, TEST-006·007 | 충족 |
| REQ-AI-001 | API-003, COMMAND-009 | 충족 |
| REQ-AI-002 | COMMAND-009 | 충족 |
| REQ-AI-003 | COMMAND-009 | 충족 |
| REQ-AI-004 | COMMAND-009, UX-004, UI-006 | 충족 |
| REQ-AI-005 | COMMAND-009, TEST-003·007, UX-004, UI-006 | 충족 |
| REQ-AI-006 | COMMAND-009, NFR-004, TEST-005 | 충족 |
| REQ-SEC-001 | API-001~006, TEST-005, NFR-004 | 충족 |
| REQ-SEC-002 | API-001~007, COMMAND-001~010, TEST-005 | 충족 |
| REQ-SEC-003 | NFR-003·004, TEST-005 | 충족 |
| REQ-SEC-004 | DATA-001~003, NFR-004, TEST-005 | 충족 |
| REQ-SEC-005 | DATA-004, API-007, COMMAND-007·010, NFR-004·006 | 충족 |

### 3.2 아키텍처·데이터·배포

| SRS ID | 주요 TASK | 판정 |
|---|---|---|
| REQ-ARCH-001 | NFR-003, API-001~007 | 충족 |
| REQ-ARCH-002 | DATA-001~003, API-001, NFR-004 | 충족 |
| REQ-ARCH-003 | API-002, COMMAND-001·004·007 | 충족 |
| REQ-ARCH-004 | API-003~007, COMMAND-009·010 | 충족 |
| REQ-ARCH-005 | COMMAND-003, TEST-002, NFR-002 | 충족 |
| REQ-ARCH-006 | DATA-001~003, API-003~005, NFR-003 | 충족 |
| REQ-ARCH-007 | API-004·005, COMMAND-006, NFR-003 | 충족 |
| REQ-ARCH-008 | COMMAND-003·006, NFR-003 | 충족 |
| REQ-DATA-001 | DATA-001~004 | 충족 |
| REQ-DATA-002 | DATA-001, NFR-003 | 충족 |
| REQ-DATA-003 | DATA-001, NFR-003 | 충족 |
| REQ-DATA-004 | DATA-001, NFR-003 | 충족 |
| REQ-DATA-005 | DATA-001~003, NFR-003 | 충족 |
| REQ-DATA-006 | DATA-002·003, COMMAND-003·004 | 충족 |
| REQ-DATA-007 | DATA-001, NFR-003 | 충족 |
| REQ-DEPLOY-001 | NFR-003 | 충족 |
| REQ-DEPLOY-002 | NFR-003 | 충족 |
| REQ-DEPLOY-003 | NFR-003 | 충족 |
| REQ-DEPLOY-004 | NFR-003, MOCK-001 | 충족 |
| REQ-DEPLOY-005 | DATA-001~003, NFR-003 | 충족 |
| REQ-DEPLOY-006 | API-005, QUERY-004, NFR-003 | 충족 |
| REQ-DEPLOY-007 | API-004·005, COMMAND-006, TEST-005, NFR-003 | 충족 |

## 4. 중복 후보 판정

| 후보 | 중복 여부 | 책임 경계 |
|---|:---:|---|
| DATA-001~004 vs API-001~007 | 아님 | DATA는 저장·정책 구조, API는 프로세스 간 입출력 계약 |
| API-003 계산·근거 계약 vs API-006 ViewModel | 아님 | API-003은 HTTP 도메인 응답, API-006은 UI 소비용 읽기 모델 |
| API-005 운영 계약 vs NFR-003·005·006 | 아님 | API는 인터페이스, NFR은 임계치·운영 Gate |
| COMMAND-003 vs DATA-002 | 아님 | DATA는 스냅샷 구조, Command는 계산 transaction |
| COMMAND-009 vs QUERY-002 | 아님 | Command는 비용·캐시 쓰기가 있는 AI 생성, Query는 기존 결과·근거 조회 |
| COMMAND-010 vs API-007 | 아님 | API는 이벤트 schema, Command는 검증·중복 제거·기록 |
| TEST-001~007 vs NFR-001~006 | 아님 | TEST는 실행 코드 작성, NFR은 임계치·측정·중단 운영 책임 |
| UX-001~007 vs UI-001~009 | 아님 | UX는 흐름·상태·카피 결정, UI는 승인 명세의 Frontend 구현 |
| UI-009 vs QUERY-004 | 아님 | Query는 읽기 모델, UI는 관리자 화면 구현 |

### 의도적으로 묶은 복합 TASK

- `COMMAND-001`: 미래지출과 제약은 온보딩 입력 transaction 경계로 함께 관리한다. API-002의 두 Server Action은 구현 체크리스트에서 분리한다.
- `COMMAND-003`: 시나리오 계산·게이팅·배분은 하나의 결과 스냅샷을 원자적으로 생성한다. 내부 모듈은 CalculationEngine·NetBenefitGate·AllocationEngine으로 분리하되 별도 transaction TASK로 중복 생성하지 않는다.
- `QUERY-002`: 결과·근거·단계 제안은 동일 Calculation 읽기 모델의 조립 책임이다. API endpoint와 내부 selector는 Task Breakdown에서 분리한다.
- `COMMAND-006`: 관측과 집계는 동일 batch의 상태전이 책임이다. 외부 관측 실패와 집계 transaction은 구현 단계에서 함수 경계를 분리한다.

## 5. UX 설계와 Frontend 구현 경계

| 책임 | UX-001~007 | UI-001~009 |
|---|:---:|:---:|
| 사용자 여정·정보 우선순위 | 결정 | 참조 |
| 상태 의미·카피·복구 행동 | 결정 | 매핑·렌더링 |
| 접근성 원칙 | 정의 | 코드·검증 |
| React/Next.js 컴포넌트 | 범위 밖 | 구현 |
| Tailwind·shadcn/ui token | 요구조건 | 구현 |
| Server Action·Query 연결 | 검토 | 구현 |
| Analytics event 호출 | 의미 검토 | COMMAND-010 연결 |

## 6. 남은 Blocker

TASK 누락이 아니라 외부 결정 또는 승인 대기 항목이다.

1. SRS 8.5 Net Benefit 정책 9개와 D2·D5·D6
2. REQ-FUNC-011 동률 처리
3. 관리자 역할·승인 문구·금지어 예외 승인자
4. Production Adapter의 Identity·Consent·MyData·Catalog 계약
5. M2 관측 목적·범위·보존기간·실제 카드 상태 의미
6. 실제 MyData 호출 비용

## 7. 결론

SRS 요구사항 61개는 TASK 55개에 모두 매핑됐다. ID와 기능 책임 기준의 중복은 없으며, 같은 기능명이 여러 문서에 나타나는 경우 Contract·Logic·Test·NFR·UX·Frontend의 서로 다른 완료 산출물을 의미한다. UX 설계와 Frontend 구현도 별도 TASK로 분리됐다. 남은 항목은 새 TASK 누락이 아니라 구현 값을 결정하는 외부 Blocker이며, 해당 TASK를 `Blocked` 상태로 관리해야 한다.

## 8. 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`
- `TASK/CardFit_전체_개발_TASK_리스트.md`
- `TASK/STEP4_전체_TASK_의존성_매트릭스.md`
- `TASK/STEP5_UIUX_TASK_인덱스.md`
