# CardFit 문서 구조

CardFit의 제품 근거, 기술 명세, 실행 작업과 검토 산출물을 역할별로 분리한다.

| 폴더 | 역할 | 현재 기준선 |
| --- | --- | --- |
| [`product/`](product/) | PRD와 제품 흐름 다이어그램 | `PRD_CardFit_v1.3.md` |
| [`technical/`](technical/) | SRS와 구현 검토 기준 | `SRS_CardFit_v1.6_GPT-5.6-SOL.md` |
| [`tasks/`](tasks/) | TASK 기준선, 정책 로그와 원자 개발 TASK | `task1/01_전체_TASK_목록_및_기준선.md` |
| [`plans/`](plans/) | 실행 계획과 프로토타입 목표 | 총괄 계획 및 프로토타입 실행 문서 |
| [`decisions/`](decisions/) | 인터뷰와 의사결정 이력 | `GRILL_LEDGER.md` |
| [`reports/`](reports/) | 분석 보고서, 시각 자료와 검토 기록 | 프로토타입 워크스루 및 리뷰 로그 |

실행 코드는 저장소 루트의 `app/`과 `features/`에 두고, 실행 도구는 `scripts/`에 둔다.
