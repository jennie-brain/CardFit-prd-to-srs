# CardFit TASK 문서 안내

## 폴더 구성

- `TASK/task1`: 통합 목록, 인덱스, 계획, 정책, 검토 보고서, TASK 템플릿
- `TASK/task2`: GitHub Issue로 전환할 수 있는 상세 TASK 문서만 보관

## 상세 TASK 현황

| 구분 | 접두사 | 개수 |
| --- | --- | ---: |
| 구현 TASK | `DATA`, `API`, `MOCK`, `COMMAND`, `QUERY`, `TEST`, `NFR`, `UX`, `UI` | 50 |
| 사전 명세 TASK | `SPEC` | 2 |
| **task2 합계** |  | **52** |

`SPEC-001`과 `SPEC-002`는 구현 전에 공통 계약을 고정하는 상세 TASK이므로 관리 문서가 아니라 `task2`에 둔다. 기존에 합의한 구현 TASK 목표 수는 50개로 유지된다.

## 주요 관리 문서

- [전체 개발 TASK 목록](CardFit_전체_개발_TASK_리스트.md)
- [정책 Decision Log](CardFit_정책_DECISION_LOG.md)
- [전체 TASK 의존성 매트릭스](STEP4_전체_TASK_의존성_매트릭스.md)
- [SRS 대비 중복·누락 감사 보고서](SRS_TASK_중복-누락-감사보고서.md)
- [표준 방법론 기반 평가 및 작성 계획](REPORT_표준방법론_기반_TASK리스트_평가와_풀버전_작성계획.md)
- [GitHub Project TASK 템플릿](GitHub_Project_TASK_템플릿.md)
- [전체 TASK 구현 실행계획](MASTER_전체_TASK_구현_실행계획.md)

## 분류 원칙

- `task1` 문서는 계획과 검토를 지원하며 개발 TASK 개수에 포함하지 않는다.
- `task2` 문서는 각각 독립적인 목적, 범위, 완료 조건을 가진 상세 TASK이다.
- UX 설계 TASK와 UI 구현 TASK는 계속 별도 접두사와 문서로 관리한다.
