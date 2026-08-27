# CardFit v1.5 포트폴리오·MVP 3층 구조 정합화 계획

| 항목 | 내용 |
| --- | --- |
| 계획 ID | PLAN-CARDFIT-PORTFOLIO-002 |
| 버전 | 1.5 |
| 작성일 | 2026-08-25 |
| 제품 기준선 | `PRD/PRD_CardFit_v1.2.md` |
| SRS 기준선 | `SRS-Drafts/SRS_CardFit_v1.4.md`, `.html` |
| 후속 목표 산출물 | `PRD/PRD_CardFit_v1.3.md`, `.html` 및 `SRS-Drafts/SRS_CardFit_v1.5.md`, `.html` |
| 문서 상태 | 실행 완료(2026-08-25) |

## 개요

본 계획은 CardFit의 포트폴리오 설명, MVP 구현 범위, 실제 도입 조건을 다음 세 층으로 분리한다.

1. **제품 목표**: CardFit은 뱅크샐러드의 공개된 사용자 경험을 바탕으로 제안한 비공식 내부 기능 확장 역기획이다.
2. **검증용 구현물**: 실제 내부 시스템에 접근하지 않고 지정 기술 스택과 비식별 Fixture·Mock Adapter로 실행하는 독립 MVP다.
3. **실제 도입 조건**: 제품 채택 후 Mock Adapter를 뱅크샐러드 내부 Identity·MyData·Card Catalog·Analytics 인터페이스로 교체한다.

이 구조의 목적은 독립 서비스나 제휴 사업으로 오해될 가능성을 줄이면서도, 실행 가능한 소프트웨어 설계와 핵심 사용자 경험 검증을 포트폴리오에서 보여주는 것이다. 지정 기술 스택은 검증용 MVP에만 적용하며 뱅크샐러드의 실제 운영 기술이나 조직 구조를 추정하지 않는다.

## 목차

1. 결정사항과 대안
2. 3층 시스템 경계
3. 기술 스택 적용 원칙
4. PRD 변경 계획
5. SRS 변경 계획
6. 기능 커버리지 평가 계획
7. 핵심 사용자 경험 보존 계획
8. 포트폴리오 표현 원칙
9. 수정 대상 파일
10. 실행 순서와 완료 게이트
11. 리스크와 대응
12. 결론 및 인사이트
13. 출처

---

## 1. 결정사항과 대안

### 1.1 채택안

**내부 기능 확장 제안 + 독립 검증 MVP + 실제 도입 시 Adapter 교체**를 채택한다.

### 1.2 대안 비교

| 대안 | 장점 | 핵심 문제 | 판정 |
| --- | --- | --- | :---: |
| 독립 CardFit 서비스 | 구현물의 독립성이 분명함 | 마이데이터 인가·제휴·동의·사업 모델이 제품 가치보다 큰 선결조건이 됨 | 기각 |
| 외부 제휴 서비스 | 사업개발 역량을 보여줄 수 있음 | 확인되지 않은 계약·데이터 제공·수익 배분을 과도하게 가정함 | 보조 대안 |
| 내부 확장 + 검증 MVP | 제품 맥락과 구현 가능성을 동시에 확보함 | 실제 내부 통합 완료로 오인되지 않도록 경계를 엄격히 표시해야 함 | 채택 |

### 1.3 ADR 작성 기준

- 결정 ID는 `ADR-008`로 추가한다.
- 결정문은 “CardFit은 공개 정보를 기반으로 한 비공식 내부 기능 확장 역기획이며, 구현물은 독립 검증 MVP다”로 작성한다.
- 외부 제휴는 실제 내부 도입이 불가능하거나 전략적으로 외부화할 때 검토하는 대안으로 남긴다.
- 실제 뱅크샐러드 시스템·API·기술 스택을 알고 있다는 표현은 사용하지 않는다.

---

## 2. 3층 시스템 경계

| 층 | 책임 | 포함 | 포함하지 않음 |
| --- | --- | --- | --- |
| 제품 제안 | 뱅크샐러드 카드 경험의 문제와 가치 정의 | 미래지출, 세 가지 예상 범위, 조합·유지 결론, 근거, 이행 확인 | 실제 조직 승인·로드맵 확정 주장 |
| 독립 검증 MVP | 사용자 가치와 기능 커버리지 검증 | Next.js 앱, Fixture, Mock Adapter, 계산 엔진, Supabase, in-app 계측 | 실사용자 금융정보, 실제 내부 API 연결 |
| 실제 도입 | 내부 플랫폼 계약과 운영 통제 | Production Adapter, 내부 인증·동의·상품 정본·분석 연동 | 독립 MVP의 Vercel 스택을 내부 운영에 강제 |

### 2.1 명칭 규칙

- `CardFit 서비스`라는 단독 표현보다 `CardFit 내부 기능 확장 제안`을 우선한다.
- 실행 산출물은 `독립 서비스`가 아니라 `독립 실행형 검증 MVP`라고 부른다.
- `마이데이터 제휴 선결`은 제품 착수 조건에서 제거하고 `실제 통합 인터페이스 확인`으로 교체한다.
- `프로덕션 통합 완료`와 `프로토타입 기능 충족`을 별도 상태로 관리한다.

---

## 3. 기술 스택 적용 원칙

| ID | 검증용 MVP의 의무 기준 | 실제 도입 시 해석 |
| --- | --- | --- |
| C-TEC-001 | Next.js App Router 단일 풀스택 | 내부 운영 구조를 규정하지 않음 |
| C-TEC-002 | Server Actions·Route Handlers로 서버 로직 구현 | Production Adapter의 호출 방식은 내부 계약에 따름 |
| C-TEC-003 | Prisma ORM, 로컬 Supabase CLI PostgreSQL, 배포 Supabase PostgreSQL | 내부 데이터 저장소로의 이전 가능성을 Adapter·Repository 경계로 보장 |
| C-TEC-004 | Tailwind CSS·shadcn/ui | 사용자 흐름과 디자인 토큰을 이식 가능한 형태로 유지 |
| C-TEC-005 | 별도 Python 서버 없이 Vercel AI SDK 사용 | AI는 설명 전용이며 제거해도 계산이 동작해야 함 |
| C-TEC-006 | Gemini 기본, 환경 변수로 모델 교체 | 내부 승인 모델로 교체 가능한 표준 인터페이스 유지 |
| C-TEC-007 | Vercel Git 배포 | 독립 MVP에만 적용하고 내부 프로덕션에는 강제하지 않음 |

### 3.1 스택 적합성 결론

- 12개 In-Scope 기능은 지정 스택 안에서 모두 시연할 수 있다.
- 실제 금융 데이터 없이도 정상·오류·부분 응답·오래된 데이터·연결 해제·해지 추정 시나리오를 Fixture로 재현할 수 있다.
- Gemini는 설명에만 사용하므로 장애나 제거가 계산·추천 결정을 훼손하지 않는다.
- 전용망·mTLS·고정 IP·내부 런타임 요구는 C-TEC 위반이 아니라 실제 도입 단계의 `Production Integration Constraint`로 분류한다.

---

## 4. PRD 변경 계획

### 4.1 반드시 수정할 충돌

`PRD/PRD_CardFit_v1.2.md`에는 독립 마이데이터 서비스 관점이 남아 있다. 다음 항목을 v1.3에서 수정한다.

| 위치 | 현재 문제 | 변경 방향 |
| --- | --- | --- |
| F-02 | 마이데이터 API가 유일한 외부 수집 채널로 표현됨 | 뱅크샐러드 플랫폼 데이터 사용, MVP는 Mock Adapter로 표현 |
| 기능 의존성 | `마이데이터 인가·제휴`가 Must 기능의 선결조건임 | 실제 통합 Adapter 계약으로 변경 |
| 리스크 | 인가·제휴 미확정 시 제품 전체가 성립하지 않는다고 표현됨 | 독립 MVP에는 영향 없음, 실제 도입에만 조건부 적용 |
| A5 | 마이데이터 인가·제휴 확보 가능성을 핵심 가정으로 둠 | 내부 인터페이스 접근과 데이터 의미 확인 가능성으로 변경 |
| 의존성·중단 조건 | 제휴 미체결 시 베타 진입 불가 | Fixture 검증 실패 시 MVP 베타 불가, 실제 통합은 별도 게이트 |
| API 설명 | Vercel Cron이 실제 마이데이터를 직접 관측하는 것으로 읽힘 | MVP 관측 Fixture와 Production Adapter를 분리 |

### 4.2 추가할 포트폴리오 고지

PRD 서두에 다음 취지의 고지를 추가한다.

> 본 문서는 뱅크샐러드의 공개된 서비스 경험을 바탕으로 작성한 비공식 역기획이며, 실제 내부 시스템·API·조직·기술 스택을 알고 있거나 대변하지 않는다. 구현 산출물은 핵심 가치를 검증하기 위한 독립 실행형 MVP다.

---

## 5. SRS 변경 계획

SRS v1.4는 3층 구조를 상당 부분 반영했지만, 기존 v1.3에서 승계된 독립 서비스 표현을 v1.5에서 제거해야 한다.

### 5.1 정합성 수정

- A5의 `마이데이터 인가·제휴 확보`를 `내부 Adapter 계약과 접근 승인`으로 변경한다.
- 리스크 표의 `직접 인가 또는 기존 사업자 제휴`를 제거한다.
- 의존성의 `마이데이터 카드 업권 API 인가·제휴`를 Production Adapter 계약으로 변경한다.
- REQ-FUNC-010의 해지 미관측을 High 신뢰도 확정으로 표현한 문장을 `INFERRED_CANCELLED`로 통일한다.
- Preview·Production 환경 변수의 `MyData 설정`을 `Platform Adapter 설정`으로 변경한다.
- 이해관계자·Use Case·Sequence·Component·Class Diagram에서 외부 마이데이터 사업자와 내부 플랫폼 Adapter를 혼용하지 않는다.

### 5.2 검증 상태 분리

| 평가 축 | 상태값 |
| --- | --- |
| 프로토타입 기능 커버리지 | `SATISFIED` / `NOT_SATISFIED` |
| 핵심 사용자 경험 보존 | `PASS` / `FAIL` |
| 실제 통합 준비도 | `READY` / `CONDITIONAL` / `UNKNOWN` |
| 프로덕션 스택 적합성 | `NOT_EVALUATED`를 기본값으로 사용 |

Mock 성공을 실제 통합 성공으로 집계하거나 표현하지 않는다.

---

## 6. 기능 커버리지 평가 계획

### 6.1 프로토타입 평가

- F-01·03·05·07·08·09·12는 자체 구현으로 검증한다.
- F-02·11은 Mock Adapter의 성공·부분·실패 계약 테스트로 검증한다.
- F-04·06은 Seed Card Catalog와 버전 고정 규칙으로 검증한다.
- F-13은 자기보고, 명시적 상태, 연속 미관측, 연결 해제, 부분 동기화, 충돌을 Fixture로 검증한다.
- 합격 기준은 In-Scope 12개 기능의 E2E 실행 12/12다.

### 6.2 실제 통합 준비도 평가

- Identity·Consent·HeldCard·PastSpend·Card Catalog·Analytics Adapter별 계약 상태를 기록한다.
- `data_as_of`, `sync_status`, `completeness`, `source` 필드 제공 여부를 확인한다.
- 카드 발급·해지의 명시적 상태와 상품 식별키 안정성을 확인한다.
- 동의 목적·보존기간·후속 관측 허용 범위를 컴플라이언스 게이트로 둔다.

---

## 7. 핵심 사용자 경험 보존 계획

다음 가치 전달 흐름을 유지해야 한다.

```text
미래지출 1회 입력
→ 세 가지 예상 범위 확인
→ 카드 조합 또는 유지 결론
→ 계산 근거 확인
→ 추천안 선택
→ 자기보고와 관측을 통한 이행 확인
```

| 게이트 | 합격 조건 |
| --- | --- |
| UX-01 | 한 번의 입력으로 LOW·BASE·HIGH를 생성함 |
| UX-02 | `예상한 만큼 쓸 때`를 기본 결과로 표시함 |
| UX-03 | 유지 결론도 정상적인 성공 결과로 제시함 |
| UX-04 | 근거 6개·기준일·미반영 항목을 제공함 |
| UX-05 | Adapter 실패를 빈 카드 목록으로 위장하지 않음 |
| UX-06 | Gemini 실패 시에도 계산·근거·선택이 동작함 |
| UX-07 | 유지 준수를 행동 완주율에서 분리함 |
| UX-08 | 해지 확정·추정·판정 불가를 구분함 |

**사전 검토 결과: PASS.** 3층 구조는 데이터 출처와 배포 책임을 분리하지만 사용자가 경험하는 입력·판단·근거·이행 흐름을 제거하지 않는다.

---

## 8. 포트폴리오 표현 원칙

### 8.1 반드시 보여줄 내용

- 공개 정보 기반의 비공식 역기획이라는 사실
- 내부 확장, 독립 검증 MVP, 실제 도입 조건의 구분
- 독립 MVP의 12/12 기능 커버리지와 실제 통합의 조건부 상태
- 확인된 사실·제품 가정·설계 결정·미확인 통합 조건의 라벨
- 내부 확장안과 제휴안 비교 후 내부 확장안을 선택한 ADR
- 기술 스택을 선택한 이유와 스택 밖 요구사항의 처리 방식

### 8.2 피해야 할 표현

- “뱅크샐러드가 사용하는 내부 API는 다음과 같다.”
- “뱅크샐러드 프로덕션은 Vercel·Supabase로 구현한다.”
- “마이데이터 연동을 완료했다.”
- “카드 해지를 검증했다.”라는 표현을 미관측 추정에 사용하는 행위
- 뱅크샐러드의 승인·제휴·채택을 받은 것처럼 보이는 표현

---

## 9. 수정 대상 파일

### 9.1 필수 수정

| 파일 | 이유 | 후속 버전 |
| --- | --- | --- |
| `PRD/PRD_CardFit_v1.2.md` | 인가·제휴 선결조건과 외부 사업자 관점이 내부 확장 제안과 충돌함 | `PRD/PRD_CardFit_v1.3.md`, `.html` |
| `SRS-Drafts/SRS_CardFit_v1.4.md` | A5·리스크·의존성·REQ-FUNC-010 일부에 이전 관점이 남아 있음 | `SRS_CardFit_v1.5.md`, `.html` |
| `README.md` | 최신 PRD·SRS·계획 문서와 프로젝트 성격을 안내해야 함 | 동일 파일 수정 |

### 9.2 조건부 수정

| 파일 | 수정 조건 |
| --- | --- |
| `PRD/diagrams/usecase_diagram_cardfit_v1.2.svg`, `.png` | 외부 마이데이터 액터가 표시되어 있다면 뱅크샐러드 Platform Adapter로 교체할 때 수정 |
| `PRD/PRD_CardFit_v1.1.html` | 최신 포트폴리오 제출물로 계속 노출할 경우에만 수정하고, 과거 버전 보존 목적이면 수정하지 않음 |
| `reports/cardfit-overseas-benchmark.html` | CardFit을 독립 서비스나 제휴 사업으로 규정한 문장이 있을 때만 정정 |
| `PRD/p26-29_PRD.md` | Master Deck 원본이면 수정하지 않고 출처 자료로 보존. 최신 발표 원고로 사용할 때만 새 버전 생성 |

### 9.3 수정하지 않을 파일

- 확정 이력인 PRD v1.0·v1.1과 SRS v1.0~v1.4는 삭제하거나 덮어쓰지 않는다.
- 과거 버전의 HTML은 해당 Markdown과 한 쌍으로 보존한다.
- Master Deck 원본은 근거 자료이므로 새 결정에 맞추어 소급 수정하지 않는다.

---

## 10. 실행 순서와 완료 게이트

### 10.1 실행 순서

1. PRD v1.3을 새 파일로 생성하고 포트폴리오 고지와 3층 구조를 추가한다.
2. F-02·A5·리스크·의존성·중단 조건에서 제휴 선결 관점을 제거한다.
3. PRD v1.3의 기능·KPI·AC ID가 유지되는지 검증한다.
4. PRD v1.3을 기준으로 SRS v1.5를 새 파일로 생성한다.
5. SRS의 Adapter 계약, 상태 모델, 다이어그램, 추적성 매트릭스를 동기화한다.
6. Markdown에서 HTML을 생성하고 요구사항 수·다이어그램 수·버전을 비교한다.
7. README와 제출용 포트폴리오 안내를 최신화한다.

### 10.2 완료 게이트

| ID | 합격 조건 |
| --- | --- |
| GATE-01 | 문서 서두에 비공식 역기획 고지가 있음 |
| GATE-02 | 제품·MVP·실제 도입의 세 층이 혼용되지 않음 |
| GATE-03 | C-TEC-001~007이 독립 검증 MVP에만 적용됨 |
| GATE-04 | PRD에서 외부 마이데이터 인가·제휴가 MVP 선결조건으로 남지 않음 |
| GATE-05 | Mock Adapter 기준 기능 커버리지 12/12 |
| GATE-06 | 실제 통합 준비도가 별도 `CONDITIONAL` 또는 `UNKNOWN`으로 표시됨 |
| GATE-07 | 해지 확정·추정·판정 불가가 구분됨 |
| GATE-08 | 핵심 UX 8개가 모두 PASS |
| GATE-09 | PRD→REQ→설계→테스트 추적성 누락 0건 |
| GATE-10 | Markdown·HTML 버전과 내용이 일치함 |
| GATE-11 | 문서 끝에 결론·인사이트·출처가 있음 |

---

## 11. 리스크와 대응

| 리스크 | 영향 | 대응 |
| --- | --- | --- |
| 내부 프로젝트로 오인됨 | 포트폴리오 신뢰 하락 | 모든 최신 문서 서두에 비공식 역기획 고지 |
| Mock 성공을 실제 통합 성공으로 오인함 | 기술적 과장 | 기능 커버리지와 통합 준비도를 별도 평가 |
| 내부 API를 추측함 | 설계 근거 약화 | 도메인 Adapter 계약만 정의하고 전송 방식은 미확인 처리 |
| Vercel을 내부 운영에 강제함 | 현실성 저하 | C-TEC-007을 독립 MVP에만 적용 |
| 해지 미관측을 확정으로 집계함 | KPI 왜곡 | `INFERRED_CANCELLED`와 `INCONCLUSIVE` 사용 |
| PRD와 SRS의 사업 전제가 다름 | 추적성 붕괴 | PRD v1.3을 먼저 확정한 뒤 SRS v1.5 작성 |

---

## 12. 결론 및 인사이트

세 번째 안은 기술 스택과 MVP 분석에서 발생하는 문제를 가장 적게 만든다. 제품은 뱅크샐러드 내부 확장으로 설명하므로 사용자·데이터 맥락이 자연스럽고, 구현물은 독립 검증 MVP로 분리하므로 실제 내부 접근 없이도 실행 가능성을 증명할 수 있다. 실제 도입은 Adapter 교체와 컴플라이언스 승인으로 한정하므로 확인되지 않은 내부 시스템을 아는 것처럼 주장하지 않아도 된다.

다만 현재 PRD v1.2에는 외부 마이데이터 사업자와 인가·제휴를 제품 선결조건으로 둔 문장이 남아 있다. 따라서 다음 작업은 SRS만 다시 수정하는 것이 아니라 PRD v1.3을 먼저 만들어 제품 전제를 정리한 후 SRS v1.5를 파생하는 순서가 적절하다. 이 순서를 지켜야 PRD와 SRS의 추적성 및 포트폴리오 설명이 일치한다.

## 13. 출처

- 제품 기준선: `PRD/PRD_CardFit_v1.2.md`
- 현재 SRS 기준선: `SRS-Drafts/SRS_CardFit_v1.4.md`, `.html`
- 직전 실행 계획: `plans/PLAN_SRS_CardFit_v1.4_MVP_Stack_Alignment.md`
- Master Deck 참고 자료: `PRD/p26-29_PRD.md`, `team-project_2nd/master-deck`
- Next.js App Router: <https://nextjs.org/docs/app>
- Next.js Server Actions·Route Handlers: <https://nextjs.org/docs/app/getting-started/updating-data>, <https://nextjs.org/docs/app/getting-started/route-handlers>
- Supabase CLI 로컬 개발: <https://supabase.com/docs/guides/local-development/cli/getting-started>
- Prisma와 Supabase: <https://www.prisma.io/docs/orm/overview/databases/supabase>
- Tailwind CSS·shadcn/ui: <https://tailwindcss.com/docs/installation/framework-guides/nextjs>, <https://ui.shadcn.com/docs/installation/next>
- Vercel AI SDK Google Provider: <https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai>
- Vercel Git 배포: <https://vercel.com/docs/git>
