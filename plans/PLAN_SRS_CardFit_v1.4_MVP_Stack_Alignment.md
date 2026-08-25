# CardFit SRS v1.4 MVP 기술 스택 정합화 계획

| 항목 | 내용 |
| --- | --- |
| 계획 ID | PLAN-SRS-CARDFIT-STACK-001 |
| 작성일 | 2026-08-25 |
| 제품 기준선 | `PRD_CardFit_v1.2.md` |
| SRS 기준선 | `SRS-Drafts/SRS_CardFit_v1.3.md`, `.html` |
| 목표 산출물 | `SRS-Drafts/SRS_CardFit_v1.4.md`, `.html` |
| 적용 범위 | 뱅크샐러드 내부 기능 확장을 제안하는 독립 실행형 MVP 프로토타입 |
| 문서 상태 | 실행 계획 확정안 |

## 개요

본 계획은 CardFit을 독립 마이데이터 사업이 아니라 **뱅크샐러드의 기존 자산 연결·카드·소비·상품 데이터 역량 위에 추가하는 미래지출 기반 카드설계 기능**으로 재정의하고, 이를 Next.js·Prisma·Supabase·Vercel 중심의 독립 MVP로 구현할 수 있도록 SRS v1.3을 v1.4로 개정하기 위한 작업 순서를 정의한다.

MVP는 비식별 샘플 데이터와 Platform Adapter를 사용해 전체 사용자 흐름을 실행할 수 있어야 한다. 실제 뱅크샐러드 통합에서는 Mock Adapter를 내부 Identity·MyData·Card Catalog·Analytics 인터페이스로 교체한다. 뱅크샐러드의 실제 운영 인프라가 지정 기술 스택을 사용한다고 가정하지 않으며, Vercel 배포 의무는 독립 MVP에만 적용한다.

변경 후에도 핵심 사용자 경험은 유지된다. 사용자는 미래지출을 한 번 입력하고, 세 가지 예상 범위에서 카드 조합과 유지 조건을 비교하며, 계산 근거를 확인하고, 이후 추천안 이행 상태를 확인한다. Adapter와 배포 구조의 변경은 이 가치 전달 흐름을 축소하지 않는다.

## 목차

1. 작업 목표와 완료 조건
2. 확정 전제와 기술 제약 정규화
3. 시스템 경계와 목표 아키텍처
4. SRS 변경 범위
5. 기능별 구현·커버리지 계획
6. 핵심 사용자 경험 보존 검토
7. 다이어그램 개정 계획
8. 데이터·보안·운영 계획
9. 검증 및 추적성 계획
10. 실행 순서
11. 완료 게이트
12. 리스크와 확인사항
13. 결론 및 인사이트
14. 출처

---

## 1. 작업 목표와 완료 조건

### 1.1 목표

1. SRS 원천 문서를 `PRD_CardFit_v1.2.md`로 교체한다.
2. CardFit을 뱅크샐러드 내부 확장 기능의 독립 MVP로 명확히 정의한다.
3. C-TEC-001~007을 독립 MVP의 의무 기술 제약으로 연결한다.
4. 뱅크샐러드 플랫폼 기능과 CardFit 신규 기능의 책임을 분리한다.
5. 12개 In-Scope 기능의 구현 경로와 실제 통합 의존성을 명시한다.
6. Mock Adapter와 실제 Platform Adapter가 같은 계약을 사용하도록 설계한다.
7. 사용자 가치 전달 흐름이 기술 제약 때문에 축소되지 않는지 검증한다.
8. 요구사항·API·엔터티·다이어그램·테스트의 추적성을 일치시킨다.

### 1.2 완료 조건

- SRS v1.3은 수정하지 않고 v1.4를 새 파일로 생성한다.
- Markdown과 HTML의 요구사항 수·표·다이어그램·버전이 일치한다.
- PRD v1.2의 Story·AC·기능·KPI·Guardrail이 추적성 매트릭스에 연결된다.
- C-TEC-001~007의 중복 ID가 없고 각 제약에 검증 기준이 있다.
- 12개 MVP 기능 모두 프로토타입 구현 경로를 가진다.
- 실제 통합 의존 기능은 Mock 성공을 실제 통합 성공으로 오인하지 않도록 표시한다.
- 핵심 사용자 경험 보존 게이트가 모두 PASS다.
- 문서 서두에는 개요·목차, 끝에는 결론·인사이트·출처가 있다.

---

## 2. 확정 전제와 기술 제약 정규화

### 2.1 제품 전제

- 기준 서비스는 뱅크샐러드다.
- CardFit은 뱅크샐러드의 과거 소비 기반 자산관리·카드추천 경험을 미래지출 기반 카드 조합 설계로 확장하는 역기획이다.
- 인증·마이데이터 연결·보유카드·과거 소비·카드 상품 정본은 기존 플랫폼 역량으로 간주한다.
- CardFit이 새로 책임지는 범위는 미래지출, 시나리오, 조합 최적화, 근거, 추천안 이행 계측이다.
- 독립 MVP는 비식별 샘플 데이터와 Mock Adapter로 실행한다.
- 실제 내부 API와 운영 인프라의 구체적인 구현은 확인되지 않은 것으로 취급한다.

### 2.2 C-TEC 정본

제시된 C-TEC-003은 중복이므로 두 번째 정의를 정본으로 통합한다. Prisma는 데이터베이스가 아니라 ORM이라는 점도 문구에 반영한다.

| ID | v1.4 정본 |
| --- | --- |
| C-TEC-001 | 모든 CardFit MVP 기능은 Next.js App Router 기반 단일 풀스택 애플리케이션으로 구현한다. 프론트엔드와 별도 CardFit 백엔드 서버를 분리하지 않는다. |
| C-TEC-002 | DB 접근·계산·외부 Adapter 호출은 Next.js Server Actions 또는 Route Handlers에서 수행한다. |
| C-TEC-003 | 데이터 접근 계층은 Prisma ORM으로 구현한다. 로컬은 Supabase CLI의 PostgreSQL을 사용하고 Preview·Production은 Supabase PostgreSQL을 사용한다. |
| C-TEC-004 | UI와 스타일은 Tailwind CSS와 shadcn/ui를 사용한다. |
| C-TEC-005 | LLM 오케스트레이션은 별도 Python 서버 없이 Vercel AI SDK로 Next.js 내부에서 구현한다. |
| C-TEC-006 | 기본 LLM은 Gemini이며 환경 변수와 AI SDK 표준 인터페이스로 모델을 교체할 수 있어야 한다. |
| C-TEC-007 | 독립 MVP의 배포와 인프라는 Vercel로 단일화하고 Git Push로 Preview·Production 배포를 자동화한다. |

### 2.3 기술 제약 적용 경계

- C-TEC-001~007은 **CardFit 독립 MVP**에 대한 의무사항이다.
- 뱅크샐러드 내부 프로덕션 전체의 기술 스택이나 배포 플랫폼을 규정하지 않는다.
- 실제 통합에서는 Adapter 구현체만 뱅크샐러드 내부 인터페이스로 교체한다.
- 내부 API가 고정 IP·mTLS·전용망·별도 런타임을 요구하면 이를 C-TEC 위반이 아니라 `Production Integration Constraint`로 기록하고 별도 승인 대상으로 분리한다.

---

## 3. 시스템 경계와 목표 아키텍처

### 3.1 CardFit MVP 내부 경계

```text
Next.js App Router
├─ UI
│  ├─ 미래지출 입력
│  ├─ 세 가지 예상 시나리오
│  ├─ 카드 조합·유지 결론
│  ├─ 계산 근거
│  └─ 추천안 이행 자기보고
├─ Server Actions / Route Handlers
│  ├─ 입력 검증
│  ├─ 시나리오 생성
│  ├─ 결정론적 계산·최적화
│  ├─ 근거 조회
│  ├─ Platform Adapter 호출
│  └─ Vercel Cron 이행 관측
├─ Vercel AI SDK / Gemini
│  └─ 계산 결과 설명만 담당
└─ Prisma / Supabase
   └─ CardFit이 생성한 데이터만 저장
```

### 3.2 뱅크샐러드 플랫폼 경계

다음 인터페이스는 CardFit 외부 플랫폼 의존성으로 정의한다.

| Adapter | 입력 | 출력 | MVP 구현 | 실제 통합 |
| --- | --- | --- | --- | --- |
| IdentityAdapter | MVP 사용자 컨텍스트 | 불투명 사용자 ID·권한 | Mock 세션 | 내부 Identity |
| MyDataConsentAdapter | 사용자 ID | 동의 상태·범위·기준일 | Mock 동의 상태 | 내부 MyData 동의 |
| HeldCardAdapter | 사용자 ID | 보유카드·동기화 메타데이터 | 비식별 Fixture | 내부 보유카드 API |
| PastSpendAdapter | 사용자 ID·기간 | 과거 소비 집계 | 비식별 Fixture | 내부 소비 API |
| CardCatalogAdapter | 상품 ID | 상품·혜택·규칙 버전 | Seed 데이터 | 내부 상품 정본 |
| AnalyticsAdapter | 이벤트 | 수집 확인 | DB 이벤트 로그 | 내부 분석 플랫폼 |

### 3.3 Adapter 계약 원칙

- 도메인 계산 모듈은 Mock 또는 실제 Adapter의 종류를 알지 못해야 한다.
- Adapter 응답에는 `data_as_of`, `sync_status`, `completeness`, `source`를 포함한다.
- 실제 내부 사용자 ID와 인증 토큰은 CardFit DB에 저장하지 않는다.
- Adapter 실패는 명시적 도메인 상태로 변환하고 빈 배열로 위장하지 않는다.
- Mock 응답도 실패·부분 응답·오래된 데이터 케이스를 제공해야 한다.

---

## 4. SRS 변경 범위

### 4.1 문서 메타데이터·서론

- 버전을 1.4로 올린다.
- 원천 문서를 PRD v1.2로 교체한다.
- “독립 마이데이터 서비스” 표현을 “뱅크샐러드 내부 기능 확장 MVP”로 변경한다.
- 독립 MVP와 실제 통합의 차이를 범위에 명시한다.
- Vercel 의무 범위가 독립 MVP임을 명확히 한다.

### 4.2 이해관계자

- 외부 마이데이터 사업자를 `뱅크샐러드 플랫폼 팀`으로 교체한다.
- Identity·MyData·Card Catalog·Analytics 인터페이스 Owner를 추가한다.
- MVP 개발자와 실제 내부 통합 담당자의 책임을 분리한다.
- 컴플라이언스는 데이터 동의·보존·관측 목적을 검토한다.

### 4.3 시스템 맥락 및 인터페이스

- 시스템 컨텍스트를 CardFit MVP와 뱅크샐러드 Platform Adapter로 재작성한다.
- 직접 표준 마이데이터 API를 호출한다는 가정을 제거한다.
- Mock Adapter와 Production Adapter 계약을 인터페이스 요구사항으로 정의한다.
- AI는 선택적 설명 인터페이스로 분리한다.

### 4.4 기능 요구사항

- F-02는 “마이데이터 구현”이 아니라 “플랫폼 동의·보유카드·소비 Adapter 사용”으로 변경한다.
- F-11은 PastSpendAdapter 결과로 초기값을 생성하도록 변경한다.
- F-13은 연결 해제와 카드 미관측을 구분하도록 동기화 메타데이터를 요구한다.
- 명시적 해지 상태가 없으면 `VERIFIED_CANCELLED`가 아니라 `INFERRED_CANCELLED` 또는 `INCONCLUSIVE`를 사용한다.
- Mock Adapter만으로도 성공·실패 AC를 실행할 수 있게 테스트 계약을 추가한다.

### 4.5 비기능 요구사항

- p95 5초 계산 SLO에 Adapter 지연 예산을 포함한다.
- 외부 Adapter 타임아웃·Circuit Breaker·캐시 기준일 표시를 정의한다.
- Supabase에는 CardFit 파생 데이터만 저장한다.
- Gemini 장애 시 계산·근거·선택 기능이 정상이어야 한다.
- Cron 배치는 커서·멱등키·호출량 상한을 사용한다.
- Production Adapter의 네트워크 방식은 확인 전 특정하지 않는다.

### 4.6 추적성·부록·검증

- PRD v1.2 Story·AC를 신규 요구사항에 다시 연결한다.
- API 목록에 Adapter 계약과 내부 Cron 엔드포인트를 추가한다.
- ERD에서 원본 마이데이터 저장을 제거하고 외부 참조·스냅샷을 구분한다.
- 기능별 Mock 테스트와 실제 통합 계약 테스트를 분리한다.
- 기능 커버리지 표를 검증 장에 추가한다.

---

## 5. 기능별 구현·커버리지 계획

### 5.1 기능 커버리지 매트릭스

| 기능 | MVP 구현 | 실제 통합 의존성 | 프로토타입 판정 | 실제 통합 판정 |
| --- | --- | --- | :---: | :---: |
| F-01 미래지출 입력 | Next.js Form + Server Action | 없음 | 충족 | 충족 |
| F-02 플랫폼 데이터 연동 | Adapter + Fixture | Identity·MyData API | 충족 | Adapter 조건부 |
| F-03 세 가지 예상 시나리오 | TypeScript Scenario Engine | 없음 | 충족 | 충족 |
| F-04 조합 최적화·게이팅 | 결정론적 TypeScript Engine | 카드 상품 정본 | 충족 | Catalog Adapter 조건부 |
| F-05 결제수단 배분 | Allocation Engine | 없음 | 충족 | 충족 |
| F-06 근거 공개 | Server Component·Route Handler | 규칙 버전 | 충족 | Catalog Adapter 조건부 |
| F-07 단계적 전환 | 결과 정렬 | 없음 | 충족 | 충족 |
| F-08 자유 입력 | UI·정규화 로직 | 없음 | 충족 | 충족 |
| F-09 범위 입력 | UI·검증 로직 | 없음 | 충족 | 충족 |
| F-11 초기값 제안 | PastSpend Fixture·집계 | PastSpendAdapter | 충족 | Adapter 조건부 |
| F-12 스코프 고지 | UI·금지어 검사 | 없음 | 충족 | 충족 |
| F-13 추천안 이행 | 자기보고·관측 Fixture·Cron | 카드 상태·동기화 메타데이터 | 충족 | 해지 의미 조건부 |

### 5.2 커버리지 결론

- 독립 MVP 사용자 흐름은 12/12 기능을 실행할 수 있다.
- 실제 통합에서 9개 기능은 CardFit 내부 구현으로 충분하다.
- F-02·F-11은 내부 Platform Adapter 접근이 필요하다.
- F-13은 해지 상태의 데이터 의미를 확인해야 한다.
- 해지 상태가 없어도 자기보고·`INFERRED_CANCELLED`·`INCONCLUSIVE` 경로로 사용자 여정은 완료된다.
- 따라서 기능적 커버리지는 MVP 관점에서 충분하지만, Mock 성공을 실제 플랫폼 통합 완료로 보고해서는 안 된다.

---

## 6. 핵심 사용자 경험 보존 검토

### 6.1 핵심 가치 전달 구조

CardFit MVP가 반드시 보존해야 하는 경험은 다음 다섯 단계다.

1. 사용자가 미래지출을 한 번 입력한다.
2. 시스템이 `예상보다 적게 쓸 때`·`예상한 만큼 쓸 때`·`예상보다 많이 쓸 때`를 자동 계산한다.
3. 각 상황에서 보유·신규 카드 조합 또는 현재 조합 유지 결론을 보여준다.
4. 사용자가 혜택·비용·제외조건·기준일을 검증한다.
5. 선택 이후 자기보고와 가능한 범위의 관측으로 추천안 이행을 확인한다.

### 6.2 변경에 따른 영향 검토

| 변경 | UX 영향 | 훼손 여부 | 보존 조치 |
| --- | --- | :---: | --- |
| 직접 마이데이터 구현 → Platform Adapter | 사용자는 동일한 연결·데이터 경험을 본다 | 없음 | Adapter 오류를 빈 데이터가 아닌 명시적 상태로 표시 |
| 실제 데이터 → MVP Fixture | 시연 데이터의 출처만 달라진다 | 조건부 없음 | 화면에 데모 데이터임을 표시하고 실제 통합 완료로 표현하지 않음 |
| 별도 백엔드 제거 | 사용자 흐름 변화 없음 | 없음 | Route Handler·Server Action으로 같은 기능 제공 |
| Supabase 저장 범위 최소화 | 원본 데이터 복제를 줄인다 | 없음 | 계산 시 필요한 최소 스냅샷과 기준일 유지 |
| AI를 설명 전용으로 제한 | 계산 정확성과 결정론성이 강화된다 | 개선 | Gemini 실패 시 정형 설명으로 폴백 |
| 해지 확정 → 확정·추정·판정 불가 분리 | 결과가 덜 단정적으로 보일 수 있다 | 가치 보존 | 정확하지 않은 확정보다 신뢰 가능한 상태 설명 우선 |
| Vercel Cron 사용 | 30일 측정 방식은 유지된다 | 없음 | 대상 생성·관측 처리의 멱등성과 지연 상태 표시 |
| 외부 알림 제외 | 사용자가 재방문하지 않으면 자기보고를 못 볼 수 있다 | 부분 영향 | MVP 원칙대로 재방문 시 1회 표시하고 관측 경로를 병행 |

### 6.3 핵심 가치 훼손 여부 판정

**판정: PASS, 단 조건부 통제 필요.**

기술 스택 변경은 계산 대상·결과·근거·선택 흐름을 제거하지 않는다. Adapter는 데이터 출처를 교체할 뿐 사용자 가치의 핵심인 미래지출 기반 조건부 카드설계를 바꾸지 않는다. AI를 계산에서 제외하면 오히려 신뢰성이 강화된다. 해지를 확정·추정·판정 불가로 나누는 것은 기능 축소가 아니라 오판정을 방지하는 품질 개선이다.

다음 조건을 위반하면 사용자 가치가 훼손된 것으로 판정한다.

- 세 가지 예상 시나리오 중 하나라도 결과에서 제거된다.
- `현재 조합 유지`가 정상 결과로 반환되지 않는다.
- 계산 근거 6개 이상과 기준일·미반영 비용이 사라진다.
- Adapter 실패를 보유카드 0개나 미이행으로 표시한다.
- Gemini 실패로 계산 결과를 볼 수 없게 된다.
- Mock 데이터 결과를 실제 사용자 금융데이터 분석으로 표시한다.
- 유지 추천을 행동 완주율에 합산한다.
- 판정 불가를 미완료로 자동 변환한다.

### 6.4 UX 보존 검증 시나리오

| ID | 검증 시나리오 | 합격 조건 |
| --- | --- | --- |
| UX-V-001 | 예상금액 1회 입력 | 추가 시나리오 금액 입력 없이 3개 결과 생성 |
| UX-V-002 | BASE 기본 진입 | `예상한 만큼 쓸 때` 결과가 첫 화면에 표시 |
| UX-V-003 | 조건부 추천 | LOW에서 유지, BASE/HIGH에서 변경 같은 조건 차이를 한 문장으로 설명 |
| UX-V-004 | 근거 확인 | 각 결과에서 근거 6개·기준일·미반영 비용 확인 |
| UX-V-005 | Adapter 장애 | 최근 데이터 기준일 또는 연결 오류를 표시하고 빈 카드로 오인하지 않음 |
| UX-V-006 | Gemini 장애 | 숫자·조합·근거·선택이 정상 동작하고 정형 설명 제공 |
| UX-V-007 | 유지 추천 | 관측 종료 시 유지 준수로 기록하고 행동 완주율에서 제외 |
| UX-V-008 | 해지 상태 부재 | 해지 추정 또는 판정 불가로 표시하고 확정 문구를 사용하지 않음 |

---

## 7. 다이어그램 개정 계획

| 다이어그램 | 변경 내용 | 검증 포인트 |
| --- | --- | --- |
| Use Case | 뱅크샐러드 플랫폼을 보조 액터로 변경 | 사용자가 직접 수행하는 흐름과 플랫폼 의존성 분리 |
| Component | Next.js 경계와 Platform Adapter 경계 표시 | 별도 CardFit 백엔드가 없어야 함 |
| Deployment | Vercel·Supabase·Gemini·Mock/Production Adapter 표시 | Vercel 의무 범위가 MVP로 제한되어야 함 |
| Sequence: 계산 | UI → Server Action/Route → Adapter → Engine → DB | 계산과 AI 호출 분리 |
| Sequence: 이행 | Cron → Adapter → 관측 판정 → 자기보고 병합 | 연결 해제·부분 응답·미관측 분기 포함 |
| Class | Adapter Interface와 Mock·Production 구현체 | 의존성 역전 확인 |
| ERD | CardFit 파생 데이터와 외부 참조 분리 | 원본 마이데이터·토큰 저장 금지 |
| State | VERIFIED·INFERRED·INCONCLUSIVE·UNAVAILABLE 분리 | 데이터 부재의 미완료 전이 금지 |

기존 Sequence Diagram 5개는 유지하되 계산·이행 시퀀스를 Adapter 관점으로 수정한다. 전체 Mermaid 문법과 HTML 렌더링을 다시 검증한다.

---

## 8. 데이터·보안·운영 계획

### 8.1 Prisma·Supabase 저장 범위

저장 대상:

- `FutureSpendPlan`
- `Constraint`
- `Calculation`
- `ScenarioResult`
- `PlanCandidate`
- `Allocation`
- `EvidenceSnapshot`
- `OutcomeLog`
- `OutcomeItem`
- `OutcomeObservation`
- `PolicyVersion`
- MVP Fixture와 Fixture 버전

저장 금지 대상:

- 인증서·마이데이터 토큰
- 원본 전체 소비내역
- 실제 내부 사용자 식별자 원문
- 뱅크샐러드 카드 상품 정본 전체 복제
- Adapter 원본 응답의 장기 보관

### 8.2 인증·권한

- MVP는 Supabase Auth 또는 동등한 단일 인증 경로를 선택해 SRS에서 확정한다.
- 실제 통합에서는 IdentityAdapter가 제공하는 불투명 ID를 사용한다.
- 모든 Server Action과 Route Handler는 사용자 소유권을 검사한다.
- Cron 엔드포인트는 `CRON_SECRET`, 멱등키, 처리 커서를 검증한다.

### 8.3 AI 안전 경계

- 계산 엔진의 입력·출력은 Gemini와 무관하게 결정론적이어야 한다.
- Gemini에는 원본 금융데이터가 아니라 최소화된 계산 결과·근거만 전달한다.
- AI 응답은 재무 결과의 정본이 아니며 계산 결과를 변경할 수 없다.
- 모델 오류·타임아웃 시 정형 템플릿으로 폴백한다.

### 8.4 배포·운영

- Local: Supabase CLI + Prisma migration + seed.
- Preview: Vercel Preview + 별도 Supabase 프로젝트.
- Production MVP: Vercel Production + 별도 Supabase 프로젝트.
- Git Push 배포 전에 lint·typecheck·unit test·migration 검사를 Vercel build 단계에서 실행한다.
- DB migration은 Expand → Data Migration → Contract 순서를 사용한다.
- Vercel Cron은 한 실행에서 제한된 대상만 처리하고 남은 대상은 다음 실행으로 이월한다.

---

## 9. 검증 및 추적성 계획

### 9.1 요구사항 추적성

다음 연결을 모든 요구사항에 적용한다.

```text
PRD v1.2 Story/AC
→ REQ-FUNC / REQ-NF / REQ-METRIC / REQ-GR
→ C-TEC / REQ-ARCH / REQ-DATA / REQ-UI / REQ-AI / REQ-DEPLOY / REQ-SEC
→ Component·API·Entity
→ Test Case
→ 검증 상태
```

### 9.2 테스트 계층

| 계층 | 대상 | 필수 테스트 |
| --- | --- | --- |
| Unit | Scenario·Net Benefit·Allocation·판정 규칙 | 경계값·결정론성·유지 분리 |
| Contract | Adapter Interface | 정상·빈 데이터·부분·지연·오래된 데이터 |
| Integration | Route Handler·Prisma·Supabase | 인증·소유권·transaction·멱등성 |
| E2E | 핵심 사용자 흐름 | 입력 → 3개 결과 → 근거 → 선택 → 이행 |
| Failure | Gemini·Adapter·Cron 장애 | 정형 폴백·PENDING·INCONCLUSIVE |
| Security | Server-only 비밀정보 | 브라우저 번들 키 노출 0건 |

### 9.3 정량 검증 기준

- `POST /calculate` p95 ≤ 5초.
- 세 시나리오 동시 산출 성공률 100%.
- 탭 전환 추가 계산 호출 0건.
- 근거 6개 미만 결과 노출 0건.
- Net Benefit 임계 미달 변경 추천 0건.
- Adapter 실패의 보유카드 0개 오분류 0건.
- Gemini 장애로 인한 계산 실패 0건.
- 자기보고·관측 상태 상호 덮어쓰기 0건.
- 단일 미관측 해지 확정 0건.
- 유지 항목의 행동 완주율 혼입 0건.
- C-TEC-001~007 위반 0건.

---

## 10. 실행 순서

### Phase 1. 기준선과 용어 정리

1. SRS v1.3을 v1.4로 복제하고 v1.3은 보존한다.
2. 원천 문서를 PRD v1.2로 교체한다.
3. 독립 서비스 표현을 뱅크샐러드 내부 확장 MVP 표현으로 변경한다.
4. 중복 C-TEC-003을 정본 하나로 통합한다.
5. `완주`, `해지 확인`, `플랫폼`, `Adapter`, `Fixture` 용어를 정의한다.

### Phase 2. 시스템·요구사항 개정

1. 시스템 경계와 이해관계자를 재작성한다.
2. F-02·F-11·F-13 및 관련 AC를 Adapter 기반으로 수정한다.
3. 비기능·보안·AI·배포 요구사항을 경계에 맞게 수정한다.
4. Production Integration Constraint를 별도 표로 추가한다.

### Phase 3. 인터페이스·데이터 개정

1. Platform Adapter 계약을 정의한다.
2. API 목록과 오류 상태를 수정한다.
3. ERD에서 원본 데이터 복제를 제거한다.
4. Fixture·정책 버전·관측 상태를 추가한다.

### Phase 4. 다이어그램·추적성 개정

1. Component·Deployment·Sequence·Class·ERD·State Diagram을 수정한다.
2. PRD Story·AC와 요구사항을 다시 연결한다.
3. 기능 커버리지와 UX 보존 검증표를 추가한다.

### Phase 5. 문서·HTML 검증

1. 요구사항 ID 중복·누락을 검사한다.
2. Mermaid 개수와 문법을 검사한다.
3. Markdown과 HTML의 버전·표·요구사항·다이어그램을 대조한다.
4. `git diff --check`와 HTML 구조 검사를 수행한다.
5. README의 최신 기준선을 갱신한다.

---

## 11. 완료 게이트

| 게이트 | 합격 조건 |
| --- | --- |
| GATE-01 제품 기준선 | PRD v1.2의 모든 Story·AC가 추적됨 |
| GATE-02 기술 제약 | C-TEC 7개가 중복 없이 검증 요구사항과 연결됨 |
| GATE-03 MVP 실행성 | Mock Adapter로 12개 In-Scope 기능 E2E 실행 가능 |
| GATE-04 통합 정직성 | Mock 성공과 실제 뱅크샐러드 통합 성공을 구분함 |
| GATE-05 데이터 경계 | 원본 금융데이터·인증정보를 Supabase에 저장하지 않음 |
| GATE-06 AI 독립성 | Gemini 없이 계산·근거·선택 흐름 정상 동작 |
| GATE-07 UX 가치 | UX-V-001~008 전부 PASS |
| GATE-08 이행 정확성 | 유지·해지 추정·판정 불가 오분류 0건 |
| GATE-09 문서 품질 | Markdown·HTML 일치, 출처가 마지막에 위치 |

하나라도 실패하면 SRS v1.4를 완료로 판정하지 않는다.

---

## 12. 리스크와 확인사항

| 우선순위 | 항목 | 현재 처리 | 후속 확인 |
| :---: | --- | --- | --- |
| P0 | 실제 카드 해지 상태 제공 여부 | MVP는 확정·추정·판정 불가를 모두 지원 | 내부 데이터 명세 확인 |
| P0 | Identity·MyData Adapter 접근 방식 | Mock 계약으로 먼저 구현 | 내부 API·SDK·권한 확인 |
| P1 | 실제 운영망과 Vercel 호환성 | 독립 MVP까지만 Vercel 의무화 | 고정 IP·mTLS·전용망 확인 |
| P1 | 카드 상품·약관 정본 접근 | Seed 기반 CatalogAdapter 제공 | 내부 Card Catalog 계약 확인 |
| P1 | 후속 관측 동의 목적 | Mock에서 상태 전이 검증 | 컴플라이언스 승인 |
| P2 | 분석 이벤트 통합 | 자체 이벤트 로그 제공 | 내부 Analytics 스키마 확인 |

위 항목은 SRS 작성을 막지 않는다. 확인 전에는 추측한 내부 구현을 확정 요구사항으로 기록하지 않고 Adapter 계약과 통합 제약으로 남긴다.

---

## 13. 결론 및 인사이트

본 변경은 CardFit의 기능을 축소하는 작업이 아니라 역기획의 기준 서비스와 구현 MVP의 경계를 바로잡는 작업이다. 뱅크샐러드가 이미 보유한 인증·마이데이터·카드·소비·상품 역량을 다시 만드는 대신, CardFit은 미래지출 입력·세 가지 예상 시나리오·조합 최적화·유지 게이팅·근거 공개·추천안 이행이라는 신규 가치에 집중한다.

지정한 Next.js·Prisma·Supabase·Tailwind·shadcn/ui·Vercel AI SDK·Gemini·Vercel 스택은 독립 MVP의 12개 In-Scope 기능을 모두 시연하고 검증하기에 충분하다. 실제 통합의 불확실성은 Adapter와 명시적 상태 모델로 격리할 수 있다. 특히 해지 상태를 무리하게 확정하지 않고 추정·판정 불가로 구분해도 핵심 사용자 경험은 훼손되지 않는다. 오히려 계산과 결과에 대한 신뢰가 높아진다.

가장 중요한 실행 원칙은 다음과 같다. **프로토타입은 완전히 실행 가능하게 만들되, Mock으로 검증한 범위와 실제 뱅크샐러드 내부 통합이 필요한 범위를 문서에서 명확히 분리한다.**

---

## 14. 출처

- 제품 기준선: `PRD_CardFit_v1.2.md`
- SRS 기준선: `SRS-Drafts/SRS_CardFit_v1.3.md`, `.html`
- 저장소 변환 원칙: `README.md`
- 기준 SRS 예시: [SRS AD-Core-Platform](https://wildmental.notion.site/SRS-AD-Core-Platform-5f1d03212bd4823ba8428142bc22ef76)
- 요구사항 표준: [ISO/IEC/IEEE 29148:2018 공식 개요](https://committee.iso.org/standard/72089.html)
- 기준 서비스·파트너 역량: [뱅크샐러드 공식 홈페이지](https://www.banksalad.com/)
- 마이데이터 연결·갱신 방식: [뱅크샐러드 고객센터 자산 연결 안내](https://help.banksalad.com/2d2116e2-39f6-8029-a79f-cd0d9aa53988)
