# CardFit 전체 개발 TASK 리스트

## 개요

이 문서는 `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`를 기준으로 CardFit MVP 개발에 필요한 Epic·Feature 단위 TASK를 통합한 기준선이다. 데이터·인터페이스 계약, 서버 로직, 테스트, 비기능, UX 설계, Frontend 구현을 분리하고 선행 의존성과 복잡도를 명시한다.

- 총 TASK: **55개**
- 개별 풀버전 문서 작성 완료: **55개**
- 체크리스트 재검토 결과 계약·로직·UX·Frontend의 책임 경계를 모두 개별 TASK로 보완했다.
- M1은 핵심 가치 전달, M2는 AI·자동화·이행 관측, M3는 실제 플랫폼 통합으로 구분한다.

## 목차

1. 데이터 및 인터페이스 계약
2. 서버 Command
3. 서버 Query
4. 테스트 및 검증
5. 인프라·보안·성능·운영
6. UX 설계
7. Frontend 구현
8. Epic 요약과 실행 기준
9. 결론
10. 출처

## 1. 데이터 및 인터페이스 계약

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 |
|---|---|---|---|---|:---:|
| DATA-001 | Data Contract | 핵심 입력·플랫폼·BenefitRule 데이터 계약 | 6.2.1~6.2.5, 6.4, 8.11 | None | H |
| DATA-002 | Calculation Data | Calculation·PlanCandidate·Allocation 데이터 계약 | 6.2, 6.4, REQ-FUNC-004~007 | DATA-001 | H |
| DATA-003 | Outcome Data | 선택·자기보고·관측 데이터 계약 | 4.5, 6.2, REQ-FUNC-010 | DATA-002, API-001 | H |
| DATA-004 | Content Policy | 스코프 고지·금지어·예외승인 데이터 계약 | REQ-FUNC-009, ADR-002, GR4 | 정책 승인 | L |
| API-001 | Platform Integration | Platform Adapter 공통 계약 | 3.2~3.4, REQ-FUNC-002 | DATA-001 | H |
| API-002 | Server Actions | 미래지출·제약·조합 선택 Action 계약 | 8.10, REQ-FUNC-001·003·005 | DATA-001, DATA-002 | M |
| API-003 | Calculation API | 계산·근거·AI 설명 HTTP 계약 | 3.4, 6.1, 8.10 | DATA-001, DATA-002, API-001 | H |
| API-004 | Outcome API | 이행 자기보고·후속 관측 HTTP 계약 | 3.6.3, 6.1, 8.10 | DATA-003, API-001 | H |
| API-005 | Operations API | Rule·Health·Cron 운영 계약 | REQ-NF-004·006·007·009, 8.10 | DATA-001, API-001 | M |
| API-006 | Read Model Contract | 온보딩·Outcome·운영 ViewModel 계약 | 3.1, 8.10, 9.1 | DATA-001~003, API-001~005 | M |
| API-007 | Analytics Contract | 제품 이벤트·Guardrail 이벤트 계약 | 5.4, 9.1~9.3 | DATA-001~003 | M |
| MOCK-001 | Mock Platform | 비식별 Fixture·Mock 응답 규격 | 1.2.1, 3.2~3.4, 9.4~9.5 | DATA-001~003, API-001~007 | H |

## 2. 서버 Command — 상태 변경

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 |
|---|---|---|---|---|:---:|
| COMMAND-001 | Planning Input | 미래지출·카드 제약 저장 | REQ-FUNC-001A/B·003A/B, 8.10 | DATA-001, API-002 | M |
| COMMAND-002 | Platform Data | 플랫폼 파생 데이터 동기화 | REQ-FUNC-002, 6.2.5 | DATA-001, API-001, MOCK-001 | H |
| COMMAND-003 | Calculation | 세 시나리오 계산·게이팅·배분 | REQ-FUNC-004~006, 8.5 | COMMAND-001·002·007, DATA-002, API-003 | H |
| COMMAND-004 | Plan Selection | 조합안 선택·이행 기준선 생성 | REQ-FUNC-005·010 | COMMAND-003, DATA-003, API-002 | H |
| COMMAND-005 | Self Report | 추천안 이행 자기보고 제출 | REQ-FUNC-010 | COMMAND-004, DATA-003, API-004 | M |
| COMMAND-006 | Outcome Observation | 이행 관측·상태 판정·집계 | REQ-FUNC-010, 4.5, 6.3 | COMMAND-004, API-001·004·005 | H |
| COMMAND-007 | Benefit Rule | Rule 등록·기존 후보 만료 | REQ-FUNC-005~007, REQ-NF-006 | DATA-001·002, API-005 | H |
| COMMAND-008 | Compliance Content | 스코프 문구·금지어 검수 | REQ-FUNC-009, GR4 | DATA-004 | M |
| COMMAND-009 | AI Explanation | AI 근거 설명 생성·캐시·fallback | REQ-AI-001~006, 8.12 | API-003·006, COMMAND-003, QUERY-002 | M |
| COMMAND-010 | Product Analytics | 제품·퍼널·Guardrail 이벤트 기록 | 5.4, 9.1 | API-007 | M |

## 3. 서버 Query — 읽기 전용

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 |
|---|---|---|---|---|:---:|
| QUERY-001 | Onboarding | 온보딩 컨텍스트·초기값 조회 | REQ-FUNC-002·008·009 | COMMAND-001·002, API-001·006 | M |
| QUERY-002 | Calculation Result | 계산 결과·근거·단계 전환 제안 조회 | REQ-FUNC-005·007·011 | COMMAND-003, DATA-002, API-003·006 | H |
| QUERY-003 | Outcome Analytics | 이행 상태·관측 품질 지표 조회 | REQ-FUNC-010, REQ-METRIC-005·008~011 | COMMAND-004~006, DATA-003, API-006 | H |
| QUERY-004 | Operations | Rule·Health·비용·Guardrail 조회 | REQ-NF-006·007·009 | COMMAND-007, API-005·006 | M |

## 4. 테스트 및 검증

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 |
|---|---|---|---|---|:---:|
| TEST-001 | Contract Test | 입력·제약·Platform Adapter 계약 테스트 | TC-FUNC-001A/B·002·003A/B·008 | COMMAND-001·002, QUERY-001, MOCK-001 | H |
| TEST-002 | Calculation Test | 계산·게이팅·배분 경계값 회귀 테스트 | TC-FUNC-004~006, E4 | COMMAND-003·007, MOCK-001 | H |
| TEST-003 | Evidence Test | 근거·AI fallback·스코프·단계 정렬 테스트 | TC-FUNC-007·009·011 | QUERY-002, COMMAND-008·009 | M |
| TEST-004 | Outcome Test | 선택·자기보고·관측 상태전이 테스트 | TC-FUNC-010A~G | COMMAND-004~006, QUERY-003 | H |
| TEST-005 | Security Test | 인가·소유권·Cron·비밀정보 테스트 | REQ-SEC-001~005, TC-NF-005·008 | 모든 API·Command·Query | H |
| TEST-006 | M1 E2E | M1 핵심 사용자 여정 E2E | 9.4~9.5, UX-V-001~006 | TEST-001~003·005, M1 로직 | H |
| TEST-007 | M2 E2E | M2 초기값·AI·Cron·이행 계측 E2E | E3, E7a/E7b, UX-V-007~008 | TEST-004·005, M2 로직 | H |

## 5. 인프라·보안·성능·운영

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 |
|---|---|---|---|---|:---:|
| NFR-001 | Performance | 계산·근거 조회 성능 검증 | REQ-NF-001·002 | COMMAND-003, QUERY-002, TEST-002·003 | H |
| NFR-002 | Reliability | 계산 신뢰성·Rule 회귀 Gate | REQ-NF-003, GR1 | COMMAND-003·007, TEST-002 | H |
| NFR-003 | Deployment | Vercel 배포·Health·가용성 | REQ-NF-004, REQ-DEPLOY-001~007 | API-005, QUERY-004, TEST-005·006 | H |
| NFR-004 | Security & Compliance | 오조회 방지·감사 로그·보존 정책 | REQ-NF-005·008, REQ-SEC-001~005 | 모든 데이터·API 경계, TEST-005 | H |
| NFR-005 | Data Quality | BenefitRule 최신성 통제 | REQ-NF-006, GR5 | COMMAND-007, QUERY-004 | M |
| NFR-006 | Cost & Observability | 비용 상한·Guardrail 관측·중단 | REQ-NF-007·009 | QUERY-004, TEST-006·007 | H |

## 6. UX 설계

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 |
|---|---|---|---|---|:---:|
| UX-001 | UX Foundation | 공통 정보구조·상태 언어·접근성 설계 | 3.1, 9.5, REQ-UI-001~005 | DATA-004, API-006 | M |
| UX-002 | Onboarding UX | 온보딩·미래지출 입력 흐름 설계 | REQ-FUNC-001~003·008·009, UX-V-001 | UX-001, QUERY-001 | H |
| UX-003 | Result UX | 계산 상태·세 시나리오 결과 구조 | REQ-FUNC-004·005·011, UX-V-002·003·005 | UX-001·002, API-003·006 | H |
| UX-004 | Evidence UX | 배분·근거·AI 설명 정보 계층 | REQ-FUNC-006·007, UX-V-004·006 | UX-001·003, API-003·006, DATA-004 | M |
| UX-005 | Selection UX | 조합 선택·외부 이동 경계 설계 | REQ-FUNC-009·010, ADR-002 | UX-003·004, DATA-004 | M |
| UX-006 | Outcome UX | 이행 자기보고·관측 신뢰도 설계 | REQ-FUNC-010, UX-V-007·008 | UX-001·005, DATA-003, API-006 | H |
| UX-007 | Admin UX | 관리자 Guardrail 의사결정 설계 | REQ-NF-004~009 | UX-001, API-005~007, NFR-002~006 | M |

## 7. Frontend 구현

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 |
|---|---|---|---|---|:---:|
| UI-001 | Frontend Foundation | Tailwind·shadcn/ui·접근성 구현 | REQ-UI-001~005, C-TEC-004 | UX-001 | M |
| UI-002 | Onboarding Frontend | 플랫폼 상태·동의·스코프 고지 구현 | REQ-FUNC-002·009 | UX-002, UI-001, QUERY-001, COMMAND-002·008 | M |
| UI-003 | Planning Frontend | 미래지출·카드 제약 입력 구현 | REQ-FUNC-001A/B·003A/B·008, UX-V-001 | UX-002, UI-001·002, COMMAND-001, QUERY-001 | H |
| UI-004 | State Frontend | 계산 진행·오류·데이터 품질 상태 구현 | REQ-FUNC-002·004, UX-V-005 | UX-003, UI-003, COMMAND-003, MOCK-001 | M |
| UI-005 | Result Frontend | 세 시나리오·유지/변경 결과 구현 | REQ-FUNC-004·005·011, UX-V-002·003 | UX-003, UI-004, QUERY-002 | H |
| UI-006 | Evidence Frontend | 결제수단 배분·근거·AI 설명 구현 | REQ-FUNC-006·007, UX-V-004·006 | UX-004, UI-005, QUERY-002, COMMAND-009 | H |
| UI-007 | Selection Frontend | 조합 선택·카드사 외부 이동 구현 | REQ-FUNC-009·010 | UX-005, UI-005·006, COMMAND-004·008 | M |
| UI-008 | Outcome Frontend | 자기보고·관측 신뢰도·판정 불가 구현 | REQ-FUNC-010, UX-V-007·008 | UX-006, UI-007, COMMAND-005, QUERY-003 | H |
| UI-009 | Admin Frontend | Rule·Health·비용·Guardrail 대시보드 구현 | REQ-NF-004~009 | UX-007, UI-001, QUERY-004, NFR-002~006 | H |

## 8. Epic 요약과 실행 기준

| Epic | TASK 수 | M1 핵심 | M2 이후 |
|---|---:|---|---|
| 데이터·계약 | 12 | DATA-001·002, API-001~003·005~007, MOCK-001 M1 | DATA-003, API-004, MOCK M2 |
| 서버 Command | 10 | COMMAND-001~004·007~010의 M1 범위 | COMMAND-005·006·009 확장 |
| 서버 Query | 4 | QUERY-001·002·004 | QUERY-003, QUERY-001 개인화 확장 |
| 테스트 | 7 | TEST-001~003·005·006 | TEST-004·007 |
| 인프라·NFR | 6 | 모든 NFR의 M1 기준 | NFR-003·004·006 M2 확장 |
| UX 설계 | 7 | UX-001~005·007의 M1 범위 | UX-004 AI 확장, UX-006·007 M2 확장 |
| Frontend 구현 | 9 | UI-001~007·009 | UI-006 AI 확장, UI-008·009 M2 확장 |
| **합계** | **55** |  |  |

### TASK 추출 순서

```text
Contract → Logic → Test → NFR → UX 설계 → Frontend 구현
```

### 권장 실제 구현 순서

```text
온보딩·입력 → 계산 → 유지/변경 결과 → 배분·근거 → 선택 → M1 Gate
```

실제 구현에서는 각 수직 경로의 서버 로직·UI·테스트·NFR을 함께 완료한다. M2·M3 TASK는 M1 기본 View에서 분리하고 외부 승인·계약이 필요한 항목은 `Blocked` 상태로 관리한다.

### 주요 외부 Blocker

- SRS 8.5 Net Benefit 정책 9개와 D2·D5·D6
- REQ-FUNC-011 동률 처리 규칙
- 관리자 역할·승인 문구·금지어 예외 승인자
- Production Adapter의 Identity·Consent·MyData·Catalog 계약
- M2 관측 목적·범위·보존기간·실제 카드 상태 의미
- 실제 MyData 호출 비용

## 9. 결론

CardFit 개발 범위는 55개의 Epic·Feature TASK로 분해된다. UX 설계는 정보 구조·흐름·상태·카피를 결정하고 Frontend TASK는 승인 명세를 코드로 구현한다. M1은 사용자가 미래지출을 입력하고 세 시나리오의 유지·변경 결론, 차액, 배분과 근거를 이해한 뒤 조합안을 선택하는 경험을 완성하는 데 집중한다. M2의 AI 설명·초기값·자동 이행 관측은 M1 핵심 경로를 차단하지 않으며, M3 실제 통합은 내부 계약과 컴플라이언스 승인 이후 별도 Gate로 관리한다.

## 10. 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`
- `TASK/STEP1_계약-데이터_TASK_인덱스.md`
- `TASK/STEP2_CQRS_로직_TASK_인덱스.md`
- `TASK/STEP3_AC_TEST_TASK_인덱스.md`
- `TASK/STEP4_NFR_의존성_TASK_인덱스.md`
- `TASK/STEP4_전체_TASK_의존성_매트릭스.md`
- `TASK/STEP5_UIUX_TASK_인덱스.md`
- `TASK/STEP5_5단계_TASK_추출체계_적절성_검토.md`
