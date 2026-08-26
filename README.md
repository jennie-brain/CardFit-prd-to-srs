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

CardFit PRD(`PRD/PRD_CardFit_v1.2.md`)에는 위 7개 섹션만으로는 담기지 않는 내용이 이미 존재한다(예: 실험·롤아웃·측정 설계, 리스크·가정·의존성, 근거/Proof 출처, Use Case Diagram 기반 시나리오 흐름, Guardrail 모니터링·알림 SLA 등). **이런 내용은 임의로 생략하거나 억지로 위 7개 섹션에 욱여넣지 않는다.** 대신 ISO/IEC/IEEE 29148:2018 표준이 제공하는 해당 구조(예: Interaction Sequences, References, Assumptions & Constraints 등)를 **그 초과분에 한해서만** 가져와 확장한다.

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
| `PRD/` | PRD 버전, 품질 검토, 원본 발표 자료, Use Case Diagram 모음 — 최신 기준선은 `PRD_CardFit_v1.3.md` |
| `SRS-Drafts/` | SRS 버전별 Markdown·HTML 산출물 |
| `plans/PLAN_SRS_CardFit_v1.4_MVP_Stack_Alignment.md` | 뱅크샐러드 내부 확장과 지정 MVP 스택을 v1.4에 적용하는 실행 계획 |
| `plans/PLAN_CardFit_v1.5_Three_Layer_Portfolio_Alignment.md` | 제품 제안·독립 검증 MVP·실제 도입의 3층 구조를 PRD·SRS에 적용하는 최신 계획 |

## 진행 상태

- [x] PRD 작성 (`PRD/PRD_CardFit_v1.0.md`)
- [x] PRD v1.1 작성·최종검토 (`PRD/PRD_CardFit_v1.1.md`, `.html`) — 3개 예상 시나리오와 추천안 이행 검증 반영, 6개 품질 요건 통과
- [x] PRD v1.2 보완본 작성 (`PRD/PRD_CardFit_v1.2.md`) — 계산 정책 승인 상태, 입력·이행 데이터 모델, KPI 분모와 정책 버전 보완
- [x] PRD v1.3 포트폴리오 정합화 (`PRD/PRD_CardFit_v1.3.md`, `.html`) — 외부 인가·제휴 선결 가정을 제거하고 3층 구조·MVP 기술 제약 반영
- [x] PRD 품질 검토 — 측정 가능성/검증 가능성 (`PRD/PRD_CardFit_v0.1_품질검토.md`)
- [x] Use Case Diagram 작성 (`PRD/diagrams/`)
- [x] SRS 확정본 작성 (`SRS-Drafts/SRS_CardFit_v1.0.md`, `.html`) — 기본 7섹션과 가정·제약·의존성, 검증, 참고자료 포함
- [x] SRS 기술 제약 통합본 작성 (`SRS-Drafts/SRS_CardFit_v1.1.md`, `.html`) — 기존 제품 요구사항을 유지하면서 Mermaid Use Case, Story·AC, KPI·Guardrail 추적성과 C-TEC-001~007 구현 제약 반영
- [x] SRS 기술 스택 적합성 반영본 작성 (`SRS-Drafts/SRS_CardFit_v1.2.md`, `.html`) — C-TEC-001~007 의무화, 기능별 적합성·범위 밖 항목, Vercel Cron 기반 계측 구현 명시
- [x] SRS 추천안 이행 검증본 작성 (`SRS-Drafts/SRS_CardFit_v1.3.md`, `.html`) — 자기보고·마이데이터 관측 분리, 행동 완주·유지 준수·조합안 이행 및 엄격한 판정 불가 모델 반영
- [x] SRS MVP 스택·플랫폼 경계 반영본 작성 (`SRS-Drafts/SRS_CardFit_v1.4.md`, `.html`) — 지정 기술 스택, Mock/Production Platform Adapter, 기능 커버리지·핵심 UX 보존 검증 반영
- [x] SRS v1.5 포트폴리오·통합 준비도 정합화 (`SRS-Drafts/SRS_CardFit_v1.5.md`, `.html`) — PRD v1.3 추적, 3층 구조, 실제 통합 상태 분리, 해지 추정 판정 보완

## 랜딩페이지

현재 서비스 화면 앞단에서 사용자의 문제 인식과 계산 시작을 유도하는 Hook 랜딩페이지를 제공합니다.

- [랜딩페이지 프로토타입](landing/index.html) — 혼인 전 마이데이터 사용자를 위한 A 유형(확신·불안 해소) 중심, C 유형(결과 지향) 보조 전략
- [랜딩페이지 최종 체크리스트](reports/CardFit_랜딩페이지_최종_체크리스트.md) — 사용자 제공 전략의 STEP 0~3 판정과 출시 전 보완 항목

현재 저장소에는 본문 서비스 라우트가 없으므로 CTA는 임시 `#current-service-entry` 앵커에 연결되어 있습니다. 실제 서비스 경로가 확정되면 `landing/index.html`의 `data-service-cta` 링크를 교체합니다. 검증되지 않은 사용자 수·로고·추천사·절감액은 랜딩페이지에 임의로 넣지 않습니다.
