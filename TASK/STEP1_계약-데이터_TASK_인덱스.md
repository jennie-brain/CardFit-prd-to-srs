# Step 1 계약·데이터 TASK 인덱스

## 개요

CardFit의 백엔드·프론트엔드·테스트가 공유할 데이터와 통신 계약을 먼저 고정하기 위한 Step 1 실행 목록이다. 총 10개의 풀버전 TASK를 의존 순서대로 작성하며, M1 필수 계약과 M2 후속 계약을 구분한다. 콘텐츠 정책과 이벤트 계약은 각각 구현과 변경 단위가 같은 COMMAND-008·010에 통합한다.

## 권장 실행 순서

| 순서 | TASK | 단계 | 선행 | 주요 후행 소비자 |
|---:|---|---|---|---|
| 1 | `DATA-001 핵심 입력·플랫폼·Rule 데이터 계약` | M1 | 없음 | API-001·002, MOCK-001 |
| 2 | `DATA-002 계산·후보·배분 데이터 계약` | M1 | DATA-001 | API-003, 계산·배분·근거 로직 |
| 3 | `API-001 Platform Adapter 계약` | M1 Mock/M3 Production | DATA-001 | MOCK-001, 계산·초기값 로직 |
| 4 | `API-002 입력·선택 Server Action 계약` | M1 | DATA-001·002 | 입력 UI, 계산·이행 흐름 |
| 5 | `API-003 계산·근거·AI 설명 HTTP 계약` | M1/M2 AI | DATA-001·002, API-001 | 결과 UI, 계산·근거 로직 |
| 6 | `DATA-003 선택·이행·관측 데이터 계약` | M1 시뮬레이션/M2 | DATA-002, API-001 | API-004, 이행 계측 로직 |
| 7 | `API-004 이행 자기보고·관측 HTTP 계약` | M2 | DATA-003, API-001 | Cron·Outcome 로직, 이행 UI |
| 8 | `API-005 운영·Rule·Health 계약` | M1/M2 | DATA-001, API-001; Outcome Cron은 DATA-003 | 관리자·배포·NFR 태스크 |
| 9 | `API-006 Query ViewModel 계약` | M1/M2 | DATA-001~003, API-001~005 | Query·UX·Frontend |
| 10 | `MOCK-001 비식별 Fixture·Mock 응답 규격` | M1/M2 | 모든 적용 대상 DATA·API·이벤트 계약 | 프론트엔드 병렬 개발, 계약·E2E 테스트 |

## 상호작용 기준

- DATA 변경은 연결 API DTO, Mock Fixture, migration 및 테스트 데이터에 함께 전파한다.
- API 변경은 소비 UI·Route Handler·Server Action·계약 테스트에 함께 전파한다.
- Mock은 API 계약의 대체 정의가 아니며 동일 schema를 구현하는 개발용 Adapter다.
- M2 태스크가 미완료여도 M1 합격에는 영향을 주지 않지만, M1 데이터가 M2 확장을 막지 않는지 migration 관점에서 검토한다.
- SRS 3.4·6.1의 `/calculate`는 논리 표기이며 구현 정식 경로는 SRS 8.10의 `POST /api/calculations`로 통일한다. SRS 개정 시 논리 표기도 정합화한다.

## Step 1 완료 조건

- 13개 엔터티의 주요 상태·무결성 규칙은 DATA TASK에, 콘텐츠 정책 계약은 COMMAND-008에 빠짐없이 매핑된다.
- SRS 8.10의 모든 Action·Route 및 Platform Adapter 메서드가 API TASK에 매핑된다.
- 정상·부분·오래됨·동의 만료·연결 해제·장애·식별 충돌 Fixture가 MOCK TASK에 정의된다.
- 각 TASK에 정상과 실패 GWT, 비기능 제약, DoD, Depends on/Blocks가 존재한다.
- 미확정 정책은 필드값으로 창작하지 않고 Open Decisions 또는 Blocker로 남는다.

## 결론

Step 1은 계산 구현보다 먼저 데이터 의미와 통신 경계를 확정한다. DATA 계약과 API-001~005를 먼저 고정하고 API-006 읽기 모델과 COMMAND-010 이벤트 계약을 확정한 뒤 MOCK-001로 모든 정상·실패 상태를 완결한다. 프론트엔드는 MOCK-001 전체 완료 전에도 확정된 M1 계약의 Fixture부터 순차적으로 사용할 수 있다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md` 3.2~3.4, 6.1~6.4, 8.9~8.12
- `PRD/PRD_CardFit_v1.3.md` 4장, 6장
