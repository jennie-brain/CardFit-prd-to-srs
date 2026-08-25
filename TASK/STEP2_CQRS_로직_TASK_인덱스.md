# Step 2 CQRS 로직 TASK 인덱스

## 개요

SRS의 REQ-FUNC 13건을 상태를 바꾸는 Command와 읽기 전용 Query로 분해한 실행 기준선이다. 하나의 TASK는 하나의 트랜잭션 또는 조회 목적을 가지며 Step 1 계약을 재정의하지 않는다.

## Command 목록

| 순서 | TASK | 담당 요구사항 | Depends on | Blocks |
|---:|---|---|---|---|
| 1 | COMMAND-001 미래지출·제약 저장 | 001A/B, 003A/B | DATA-001, API-002 | COMMAND-003, QUERY-001 |
| 2 | COMMAND-002 플랫폼 스냅샷 동기화 | 002 | DATA-001, API-001, MOCK-001 | COMMAND-003, QUERY-001 |
| 3 | COMMAND-003 시나리오 계산·게이팅·배분 | 004~006 | DATA-002, API-003, COMMAND-001·002 | QUERY-002, COMMAND-004 |
| 4 | COMMAND-004 조합 선택·기준선 생성 | 005, 010 | DATA-003, API-002, COMMAND-003 | COMMAND-005·006, QUERY-003 |
| 5 | COMMAND-005 자기보고 제출 | 010 | DATA-003, API-004, COMMAND-004 | QUERY-003 |
| 6 | COMMAND-006 이행 관측·상태 집계 | 010 | DATA-003, API-001·004·005, COMMAND-004 | QUERY-003 |
| 7 | COMMAND-007 Rule 등록·후보 만료 | 005~007, NF-006 | DATA-001·002, API-005 | COMMAND-003, QUERY-004 |
| 8 | COMMAND-008 스코프 문구 검수 | 009 | API-005 | 배포·콘텐츠 게시 |
| 9 | COMMAND-009 AI 근거 설명 생성 | 007, AI-001~006 | API-003·006, COMMAND-003, QUERY-002 | UI-006 M2, TEST-003·007 |
| 10 | COMMAND-010 제품·Guardrail 이벤트 기록 | KPI·NF-009 | API-007 | QUERY-003·004, NFR-006 |

## Query 목록

| 순서 | TASK | 담당 요구사항 | Depends on | Blocks |
|---:|---|---|---|---|
| 1 | QUERY-001 온보딩 컨텍스트·초기값 조회 | 002, 008, 009 | DATA-001, API-001·006, COMMAND-001·002 | 입력 UI |
| 2 | QUERY-002 계산 결과·근거·단계 제안 조회 | 005, 007, 011 | DATA-002, API-003·006, COMMAND-003 | 결과·근거 UI |
| 3 | QUERY-003 이행 상태·품질 지표 조회 | 010 | DATA-003, API-006·007, COMMAND-004~006·010 | 이행 UI·KPI |
| 4 | QUERY-004 Rule·Health·Guardrail 조회 | 009, NF-006·007·009 | API-005~007, COMMAND-007·010 | 관리자 UI·운영 점검 |

## CQRS 경계 원칙

- Query는 DB·외부 상태를 변경하지 않는다. 선택적 AI 설명 생성처럼 비용·캐시 쓰기가 발생하는 작업은 API-003 계약 안에서 별도 Command 성격으로 다룬다.
- Command는 입력 검증, 세션·소유권 확인, 트랜잭션, 감사 이벤트를 포함한다.
- 계산은 결과를 생성·저장하므로 Command다. 결과·Evidence 조회와 단계 정렬은 Query다.
- M2 Command·Query 미완료는 M1 합격 실패로 계산하지 않는다.

## 결론

Step 2는 10개 Command와 4개 Query로 구성한다. 다음 단계의 TEST는 이 문서들의 정상·실패 AC를 실행 코드로 증명하고, 테스트 TASK ID를 각 로직 TASK의 DoD에 연결한다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md` 4.1, 5.2~5.3, 8.10
- `TASK/STEP1_계약-데이터_TASK_인덱스.md`
