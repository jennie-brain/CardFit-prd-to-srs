# CardFit TASK 관리 문서 안내

`task1`은 TASK 기준선, 실행계획, 정책, 템플릿과 추출·검토 방법을 관리한다. 실제 구현 단위 TASK 54개는 [`task2`](../task2)에 있다.

## 관리 문서

| 파일 | 내용 |
|---|---|
| [01_전체_TASK_목록_및_기준선](01_전체_TASK_목록_및_기준선.md) | 54개 TASK 목록, SRS 매핑, 복잡도, M1/M2/M3 범위 |
| [02_총괄_개발_실행_계획](02_총괄_개발_실행_계획.md) | 정본 의존성 DAG, 임계경로, 실행 레인, Milestone |
| [03_병렬실행_Gantt_로드맵](03_병렬실행_Gantt_로드맵.md) | 압축 일정과 병렬 실행 대안 |
| [04_정책_결정_로그](04_정책_결정_로그.md) | 정책 승인 상태와 구현 Blocker |
| [05_GitHub_TASK_템플릿](05_GitHub_TASK_템플릿.md) | TASK 작성 양식과 필수 계약·검증 필드 |
| [06_AI_TASK_추출_및_검토_방법론](06_AI_TASK_추출_및_검토_방법론.md) | Macro·Micro TASK 추출 및 품질 검토 방법 |
| [08_GitHub_Project_연동_노트](08_GitHub_Project_연동_노트.md) | GitHub Issue/Project 연동 참고사항 |

## 확정 기준선

- 전체 TASK: **54개**
- DATA/API/SPEC/MOCK: 11개
- COMMAND: 10개
- QUERY: 4개
- TEST: 7개
- NFR: 5개
- UX: 6개
- UI: 9개
- INFRA: 1개
- SEC: 1개

## 품질 검토 기준

모든 TASK는 다음 조건을 충족해야 한다.

1. Contract/Data가 Logic보다 먼저 정의되어야 한다.
2. Command와 Query를 분리한다. Query의 기본 Writes는 `None`이다.
3. 모든 상태 변경 Command에는 Reads, Writes, Side Effects, Transaction Boundary, Idempotency, Retry Policy가 있어야 한다.
4. 모든 TASK에는 정상·경계·실패 Acceptance Criteria가 있어야 한다.
5. 모든 구현 TASK에는 Test Gate와 NFR Gate, Evidence Location이 있어야 한다.
6. `Depends on`과 `Blocks`에는 실제 TASK ID만 사용하고, 정책 승인·외부 계약은 `External Blockers`로 분리한다.
7. 모든 문서의 마지막 섹션은 최신 변경을 기록하는 `Decision Log`여야 한다.
8. REQ → Contract → Logic → Test → NFR → UX/UI 추적이 가능해야 한다.
9. 중복 TASK ID, 존재하지 않는 TASK 참조, 순환 의존성이 없어야 한다.
10. 정책 미확정 값은 구현 기본값이나 테스트 expected 결과로 확정하지 않는다.

## 상태 판정

- `PASS`: 구현·검증 기준이 충족됨
- `CONDITIONAL`: 구현은 가능하지만 정책·추적성·외부 계약 보완이 필요함
- `FAIL`: 요구사항 충돌·필수 필드 누락·검증 불가
- `BLOCKED`: 정책 또는 외부 계약 승인 전에는 진행할 수 없음

## 단일 원천

- TASK 정의와 의존성: `TASK/task2/*.md`
- 전체 목록: `01_전체_TASK_목록_및_기준선.md`
- 실행계획: `02_총괄_개발_실행_계획.md`
- 정책 결정: `04_정책_결정_로그.md`

## 랜딩페이지 산출물

- [`../../landing/CardFit_Landing_Codex.html`](../../landing/CardFit_Landing_Codex.html) — 현재 서비스 앞단 Hook 랜딩페이지 Codex 버전
- [`../../reports/CardFit_랜딩페이지_최종_체크리스트_Codex.md`](../../reports/CardFit_랜딩페이지_최종_체크리스트_Codex.md) — 전략·체크리스트 기반 최종 평가 Codex 버전
