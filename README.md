# prd-to-srs — CardFit PRD → SRS 변환 프로젝트

CardFit(미래지출 카드설계 서비스) PRD를 소프트웨어 요구사항 명세서(SRS)로 변환하는 작업 저장소입니다.

## 작업 목표 (SRS 변환 범위 정의 — 반드시 준수)

### 1. 목표 문서 형태: "표준 풀 버전"이 아니라 "예시 사례의 추가된 포맷"

이번 변환의 목표는 **ISO/IEC/IEEE 29148:2018 표준 전체 항목을 빠짐없이 채운 풀 버전 SRS를 작성하는 것이 아니다.** 목표는 예시로 확보해 둔 SRS 문서(AD-Core-Platform SRS)가 취한 것과 **동일한, 실무적으로 확장된 포맷**으로 CardFit PRD를 변환하는 것이다. 그 기준 포맷은 다음 7개 섹션이다.

1. 서론 (목적 / 범위 / 정의·약어·축약어)
2. 이해관계자
3. 시스템 맥락 및 인터페이스
4. 구체적 요구사항 (4.1 기능 요구사항 / 4.2 비기능 요구사항)
5. 추적성 매트릭스
6. 부록 (6.1 API 엔드포인트 목록 / 6.2 데이터 모델 정의 / 6.3 비즈니스 규칙 요약 / 6.4 데이터베이스 스키마 개요)
7. 향후 개선 사항

표준이 요구하는 다른 모든 하위 항목(예: 3.4 인터랙션 시퀀스 하위 섹션, 별도 References 섹션, Assumptions & Constraints 섹션 등)을 처음부터 전부 채우려 하지 않는다.

### 2. 예외 규칙: PRD가 예시 포맷의 범위를 벗어나는 경우에만 표준 구조로 확장

CardFit PRD(`PRD_CardFit_v1.2.md`)에는 위 7개 섹션만으로는 담기지 않는 내용이 이미 존재한다(예: 실험·롤아웃·측정 설계, 리스크·가정·의존성, 근거/Proof 출처, Use Case Diagram 기반 시나리오 흐름, Guardrail 모니터링·알림 SLA 등). **이런 내용은 임의로 생략하거나 억지로 위 7개 섹션에 욱여넣지 않는다.** 대신 ISO/IEC/IEEE 29148:2018 표준이 제공하는 해당 구조(예: Interaction Sequences, References, Assumptions & Constraints 등)를 **그 초과분에 한해서만** 가져와 확장한다.

즉:
- 기본값 = AD-Core-Platform 예시와 같은 7섹션 포맷
- PRD 내용이 그 포맷의 범위를 벗어날 때만 = 표준 SRS 구조 요소를 해당 부분에 한정하여 추가

### 3. 하지 않을 것

- 표준 규격을 기계적으로 전부 채우는 완전판 SRS 작성
- PRD에 없는 내용을 임의로 창작해 채워 넣는 것
- 다른 문서를 참조 경로로만 남기고 내용을 SRS 안에 직접 포함하지 않는 것

## 프로젝트 구성

| 파일/폴더 | 내용 |
| --- | --- |
| `PRD_CardFit_v1.0.md` | CardFit 제품 요구사항 문서(PRD) 본문 — 완성도 검토 6개 항목 통과 후 확정된 v1.0 |
| `PRD_CardFit_v1.1.md` / `.html` | CardFit PRD v1.1 — 사용자 친화적 3개 예상 시나리오와 추천안 이행 검증 도입본 |
| `PRD_CardFit_v1.2.md` | CardFit PRD 최신 기준선 — 입력 모델·항목별 자기보고·BASE KPI 분모·정책 버전·정책 승인 상태 보완 |
| `PRD_CardFit_v0.1_품질검토.md` | PRD의 측정 가능성·검증 가능성 품질 검토 및 보완 결과 |
| `diagrams/usecase_diagram_cardfit_v1.2.svg` / `.png` | PRD v1.2 Use Case Diagram (벡터 원본 / 이미지) |
| `p26-29_PRD.md` | master-deck 원본 PRD 발표 원고(참고용 출처 자료) |
| `SRS-Drafts/` | (예정) SRS 변환 산출물이 저장될 위치 |

## 진행 상태

- [x] PRD 작성 (`PRD_CardFit_v1.0.md`)
- [x] PRD v1.1 작성·최종검토 (`PRD_CardFit_v1.1.md`, `.html`) — 3개 예상 시나리오와 추천안 이행 검증 반영, 6개 품질 요건 통과
- [x] PRD v1.2 보완본 작성 (`PRD_CardFit_v1.2.md`) — 계산 정책 승인 상태, 입력·이행 데이터 모델, KPI 분모와 정책 버전 보완
- [x] PRD 품질 검토 — 측정 가능성/검증 가능성 (`PRD_CardFit_v0.1_품질검토.md`)
- [x] Use Case Diagram 작성 (`diagrams/`)
- [x] SRS 확정본 작성 (`SRS-Drafts/SRS_CardFit_v1.0.md`, `.html`) — 기본 7섹션과 가정·제약·의존성, 검증, 참고자료 포함
- [x] SRS 기술 제약 통합본 작성 (`SRS-Drafts/SRS_CardFit_v1.1.md`, `.html`) — 기존 제품 요구사항을 유지하면서 Mermaid Use Case, Story·AC, KPI·Guardrail 추적성과 C-TEC-001~007 구현 제약 반영
- [x] SRS 기술 스택 적합성 반영본 작성 (`SRS-Drafts/SRS_CardFit_v1.2.md`, `.html`) — C-TEC-001~007 의무화, 기능별 적합성·범위 밖 항목, Vercel Cron 기반 계측 구현 명시
- [x] SRS 추천안 이행 검증본 작성 (`SRS-Drafts/SRS_CardFit_v1.3.md`, `.html`) — 자기보고·마이데이터 관측 분리, 행동 완주·유지 준수·조합안 이행 및 엄격한 판정 불가 모델 반영
