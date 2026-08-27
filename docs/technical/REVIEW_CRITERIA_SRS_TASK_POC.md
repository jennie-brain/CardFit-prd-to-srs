# SRS 및 AI 개발 TASK 통합 검토 기준

## 1. 목적

이 문서는 PRD에서 작성된 SRS와 SRS에서 추출한 AI 에이전트용 개발 TASK를 반복해서 검토하기 위한 저장소 기준선이다. 검토자는 기능 수가 많거나 문서 형식이 완성되어 있다는 이유만으로 통과 판정을 내리지 않는다. 제품 요구사항의 충실성, 기술적 구현 가능성, PoC 단계의 증명 범위, 데이터 흐름, 자동 검증 가능성, 비용과 일정의 현실성을 함께 확인한다.

검토 결과는 다음 네 상태 중 하나로 기록한다.

| 판정 | 의미 |
| --- | --- |
| `PASS` | 현재 단계에서 구현·검증 가능한 기준선이 완성되어 있다. |
| `CONDITIONAL` | 구현할 수 있지만 정책 승인, 외부 계약 또는 추가 검증이 선행되어야 한다. |
| `FAIL` | 요구사항 충돌, 누락, 순환 의존성 또는 검증 불가능성 때문에 착수할 수 없다. |
| `NOT_EVALUATED` | 실제 환경·계약·데이터가 없어 현 단계에서 평가할 수 없다. |

## 2. 검토 대상과 기준선

검토할 때 다음 문서의 최신 기준선을 먼저 확인한다.

1. 최신 PRD
2. 최신 SRS
3. 전체 개발 TASK 리스트
4. 개별 TASK 문서
5. 전체 의존성 매트릭스
6. GitHub Project의 실제 Issue·Milestone·Dependency

문서 간 충돌은 `법·규제·보안 필수조건 → 승인된 PRD → 승인된 제품 정책 → SRS → TASK → 구현` 순서로 판단한다. 하위 문서가 상위 문서에 없는 기능이나 정책을 임의로 확정해서는 안 된다.

## 3. 공통 검토 관점

### 3.1 개발 난이도와 MVP 단계 적절성

- 현재 단계가 PoC, 저장 가능한 MVP, 운영 베타, 실제 통합 중 어디에 해당하는지 명시되어 있는가?
- 핵심 가설을 증명하지 않는 부가기능이 선행 단계의 완료 조건에 포함되지 않았는가?
- 초급 개발자와 AI 보조 기준의 일정에 정책 결정, Fixture 작성, 테스트, 배포, 문서화 시간이 포함되어 있는가?
- `H/M/L` 복잡도에 예상 작업일, 기술적 불확실성, 외부 의존성과 테스트 준비량의 근거가 있는가?
- 외부 승인이나 계약이 필요한 작업을 개발 완료율에 포함하지 않고 `Blocked` 또는 후속 단계로 분리했는가?

### 3.2 기술 스택

- 모든 기술이 명시적으로 정의되어 있는가?
- 같은 책임을 수행하는 프레임워크나 데이터베이스가 중복 도입되지 않았는가?
- 오픈소스 구성요소와 관리형 상용 서비스를 구분했는가?
- 개인 PoC에 별도 백엔드, 별도 VM, 자체 호스팅 같은 불필요한 운영 복잡성을 추가하지 않았는가?
- 개발·Preview·Production 환경의 데이터베이스 종류와 migration이 호환되는가?
- 기술 선택의 허용 범위와 금지 범위가 C-TEC 또는 ADR로 기록되어 있는가?

CardFit의 권장 기술 기준선은 다음과 같다.

| 영역 | 기준선 | 검토 기준 |
| --- | --- | --- |
| 애플리케이션 | Next.js App Router 단일 풀스택 | 프론트엔드와 별도 백엔드를 중복 구축하지 않는다. |
| 서버 로직 | Server Actions·Route Handlers·Server Components | 쓰기, 외부 HTTP 계약, 조회의 책임을 구분한다. |
| 언어·검증 | TypeScript·Zod | 클라이언트와 서버가 같은 입력 계약을 사용한다. |
| 데이터 | Prisma ORM·PostgreSQL | 로컬 Supabase CLI와 배포 Supabase에서 같은 schema·migration을 재현한다. |
| UI | Tailwind CSS·shadcn/ui | token과 공통 컴포넌트를 사용한다. |
| 테스트 | Vitest·Playwright | 단위·계약·핵심 E2E를 자동 실행한다. |
| AI | Vercel AI SDK·Gemini | AI는 설명만 담당하고 계산·추천 결론에 관여하지 않는다. |
| 배포 | Vercel Git Integration | 앱 배포와 DB migration 절차를 분리한다. |

로컬 SQLite와 Production PostgreSQL을 같은 Prisma migration 기준선으로 혼용하지 않는다. Prisma migration은 provider별 SQL을 생성하므로 개발과 배포 환경 모두 PostgreSQL을 사용한다.

### 3.3 운영 소요 비용

- 월 비용이 서비스별 고정비, 사용량 비용, 선택 비용, 미산정 비용으로 분리되어 있는가?
- 가격 기준일, 모델 ID, token 수, 호출량, 저장량, egress와 세금·환율 제외 조건이 기록되어 있는가?
- 무료 플랜의 개인·비상업 용도와 상업 베타의 유료 플랜을 구분했는가?
- 실제 MyData, 내부 Adapter, 법무, 카드 약관 수집처럼 알 수 없는 비용을 `UNKNOWN`으로 유지했는가?
- 비용 상한의 80%·100% 도달 시 어떤 기능을 중단하는지 정의했는가?

기본 예비 산정은 다음 세 시나리오로 분리한다.

| 단계 | 기본 구성 | 월 목표 비용 |
| --- | --- | ---: |
| 개인 PoC | Vercel Hobby·JSON Fixture·AI 비활성 | $0, 선택적 도메인 비용 별도 |
| 저장 가능한 포트폴리오 | Vercel Hobby·Supabase Free·AI 비활성 | $0, 무료 한도 초과분 별도 |
| 업무·상업 베타 | Vercel Pro·Supabase Pro·제한된 Gemini | 기본 클라우드 약 $45~50, 외부 연동 비용 별도 `UNKNOWN` |

## 4. PoC 검토 기준

### 4.1 현 단계에서 반드시 증명할 요소

CardFit PoC는 다음 세 가지 주장을 우선 증명한다.

1. 미래지출이 달라지면 카드 유지·변경 결론이 합리적으로 달라진다.
2. 동일한 입력, Rule, policy version과 clock에서 동일한 결과가 재현된다.
3. 사용자가 차액, 배분과 추천 근거를 확인하고 이해할 수 있다.

이를 위해 다음 기능과 검증을 포함한다.

- 미래지출 입력
- LOW·BASE·HIGH 시나리오
- 결정론적 계산
- Net Benefit 유지·변경 게이트
- 결제수단 배분과 합계 불변조건
- 근거 6항목과 기준일·제외 비용
- 정상·경계·실패 Fixture
- Golden Vector 기반 단위·계약 테스트
- 입력부터 결과·근거까지의 핵심 E2E

### 4.2 현 단계에서 증명할 수 없는 요소

다음 항목은 실제 사용자, 계약, 내부 시스템 또는 장기 운영 데이터가 없으면 증명할 수 없다.

- 실제 마이데이터와 내부 Identity·Consent·Catalog 연동 가능성
- 실제 사용자 선택률과 근거 공개의 신뢰 향상 효과
- 실제 추천안 발급·해지 이행률
- 카드 8개사 전체 약관의 정확성과 최신성
- 법률·컴플라이언스 최종 적합성
- 99.5% 가용성과 대규모 트래픽 비용
- 뱅크샐러드 Production 인프라 적합성

이 항목은 `CONDITIONAL` 또는 `NOT_EVALUATED`로 표시하며 PoC 성공으로 주장하지 않는다.

### 4.3 Dummy·Mock으로 대체할 요소

다음 요소는 비식별 Fixture와 Mock Adapter로 대체할 수 있다.

- Identity·Consent
- HeldCard·PastSpend
- Card Catalog와 대표 카드 10~20개
- Analytics 이벤트 저장
- 정상·부분·오래된 데이터·동의 만료·연결 해제
- D+30 clock과 자기보고·관측 상태
- 외부 API 장애와 Gemini 장애

Mock의 성공은 Production 통합 성공으로 집계하지 않는다.

### 4.4 PoC 단계별 범위

| 단계 | 목적 | 필수 | 제외 가능 |
| --- | --- | --- | --- |
| M0 | 핵심 계산·UX 가설 증명 | TypeScript 계약, JSON Fixture, 계산·게이팅·배분·근거, 자동 테스트 | 인증, 물리 DB, Gemini, Cron, 실제 연동 |
| M1 | 저장 가능한 포트폴리오 | M0 + Prisma·로컬 Supabase·배포 Supabase, Mock Adapter, 스냅샷 저장 | 자동 관측, 실제 연동, AI 필수화 |
| M2 | 제한적 운영·측정 | Gemini 선택 설명, 일 1회 Cron, 자기보고·관측 Fixture, 비용·Guardrail | 실제 내부 API, 대규모 운영 |
| M3 | 실제 통합 준비도 검증 | Production Adapter와 계약·보안·네트워크 승인 | 확인되지 않은 내부 구조의 추정 구현 |

## 5. SRS 검토 기준

### 5.1 PRD 충실성

- PRD의 모든 Story, AC, 기능, NFR, KPI, Guardrail, 가정과 의존성이 SRS에 존재하는가?
- PRD에서 제외한 기능을 SRS가 임의로 추가하지 않았는가?
- SRS에서 구체화한 내용에 `[Derived]`, `[Design Decision]`, `[TBD]`와 근거가 있는가?
- PRD와 SRS의 정책값과 상태가 일치하는가?

### 5.2 기술 명세 완비성

- 시스템 맥락, Use Case, Sequence, Component, Flow, Class와 ERD가 있는가?
- API 요청·응답·오류·인가·멱등성 경계가 정의되어 있는가?
- 엔터티 필드, PK/FK, 상태 전이, 무결성, 보존과 삭제 기준이 정의되어 있는가?
- 개발·Preview·Production 배포와 migration 전략이 정의되어 있는가?
- 성능, 보안, 가용성, 데이터 최신성, 비용과 관측 기준이 측정 가능한가?

### 5.3 구현 가능성

- `Proposed` 또는 `TBD`인 핵심 정책을 확정 요구사항처럼 사용하지 않았는가?
- 미확정 정책마다 Owner, 기한과 이를 해결할 Decision TASK가 있는가?
- 실제 외부 연동 없이도 Mock으로 핵심 가치 경로를 실행할 수 있는가?
- 초급 개발자가 학습을 통해 검토할 수 있도록 기술 용어, 실패 사례와 확인 명령이 제공되는가?

### 5.4 추적성

모든 요구사항은 다음 경로로 추적되어야 한다.

```text
PRD Source → SRS REQ → DATA/API Contract → TEST → COMMAND/QUERY → UI/NFR → Evidence
```

`REQ-UI-001~005`와 같은 범위 축약만 사용하지 않고 개별 ID를 기록한다. 테스트 파일, 실행 결과, Fixture version과 policy version을 증거로 연결한다.

## 6. AI 에이전트용 TASK 검토 기준

### 6.1 데이터 흐름과 보관 체계 우선

- 화면 TASK보다 데이터 계약과 외부 인터페이스 계약이 먼저 존재하는가?
- 엔터티, DTO, 상태, 오류, 버전, 보존과 민감정보 금지 기준이 정의되어 있는가?
- PoC가 물리 DB를 생략하더라도 TypeScript·Zod 계약과 JSON Fixture를 먼저 고정했는가?
- 계산 입력, Rule, policy version과 결과 hash를 재현할 수 있는가?

### 6.2 단일 목적과 CQRS 분리

- 하나의 TASK가 하나의 결과물과 완료 조건만 갖는가?
- 데이터 변경은 Command, 읽기 전용은 Query로 분리했는가?
- 계산, 게이팅, 배분, 영속화와 이벤트 기록을 한 TASK에 과도하게 묶지 않았는가?
- UX 결정과 Frontend 구현을 분리했는가?

### 6.3 TDD와 자동 채점

권장 실행 순서는 다음과 같다.

```text
Contract → 실패하는 Test → Command/Query 구현 → Test 통과 → NFR·E2E → UX·Frontend Gate
```

- TEST가 구현 Command·Query에 선행하는가?
- TEST가 구현 TASK에 의존하여 순환 관계를 만들지 않는가?
- 정상, 경계, 실패, 권한, 멱등성과 fallback 사례가 있는가?
- DoD가 자동 테스트 경로와 실행 증거를 요구하는가?

### 6.4 GitHub Project 관리 가능성

모든 TASK는 다음 정보를 포함한다.

- Summary와 사용자 가치
- SRS·PRD·정책 출처
- In Scope와 Out of Scope
- Task Breakdown
- BDD/GWT Acceptance Criteria
- Technical·NFR Constraints
- Definition of Done
- 실제 Issue 링크 기반 `Depends on`과 `Blocks`
- Open Decisions
- Status, Priority, Size, Milestone, Iteration, Owner, Phase, Blocked reason

문서 frontmatter만으로 GitHub Issue 또는 Project 관계가 생성된다고 간주하지 않는다.

### 6.5 순차·병렬 계획

- 데이터·API 계약이 고정된 뒤 테스트와 Mock을 병렬 작성할 수 있는가?
- 테스트 기준이 고정된 뒤 Command와 Query를 독립적으로 구현할 수 있는가?
- API·ViewModel 계약 이후 Frontend가 서버 구현과 병렬 진행할 수 있는가?
- 외부 승인 작업은 핵심 PoC 경로를 차단하지 않도록 별도 Gate로 분리했는가?

## 7. CardFit TASK 수와 통합 기준

현재 개발 TASK 기준선은 **50개**다. 정책 결정 3건은 개발 TASK가 아니라 Decision Log로 관리한다. 각 TASK 내부에는 원자적 하위 체크리스트를 유지하되 모든 모듈과 endpoint를 별도 Issue로 만들지 않는다.

| 변경 | 기존 | 수정 | 순감 |
| --- | ---: | ---: | ---: |
| 기존 기준선 | 53 | 53 | 0 |
| 공통 읽기 ViewModel 계약을 QUERY-001~004가 소유 | 1 | 0 | -1 |
| 결과 근거 UX와 조합 선택 UX를 같은 wireflow로 통합 | 2 | 1 | -1 |
| Rule 최신성을 Command·Query·Test·Guardrail AC로 분산 | 1 | 0 | -1 |
| **개발 TASK 합계** | **53** | **50** | **-3** |

정책 결정은 다음 세 기록으로 관리하며 관련 TASK의 Blocker로 연결한다.

1. Net Benefit 정책 기준선
2. Golden Vector와 expected 결과
3. 동률·반올림·계산 기간 규칙

### 7.1 통합 안전 기준

- `H+H`는 통합하지 않는다.
- `H+M`은 원칙적으로 통합하지 않는다.
- `M+M`은 동일 사용자 흐름·산출물·완료 시점이고 통합 후에도 범위가 검토 가능할 때만 허용한다.
- 계약과 구현, 테스트와 구현, UX 설계와 Frontend 구현, M1과 M2의 독립 Gate는 합치지 않는다.
- 별도 Issue를 제거한 요구사항은 소비 TASK의 Scope·AC·DoD·추적성에 모두 재배치한다.
- 통합 후 예상 작업량이 팀의 단일 Sprint 허용치를 넘으면 TASK 수 목표보다 분리를 우선한다.

50개는 절대 상한이 아니다. 신규 SRS 요구사항이 승인되거나 통합 TASK의 복잡도가 허용치를 넘으면 근거를 기록하고 다시 분리한다. 반대로 단순히 개수를 맞추기 위해 요구사항, 테스트 또는 운영 책임을 삭제하지 않는다.

## 8. 검토 결과 보고 형식

각 검토에서는 다음 순서로 결과를 작성한다.

1. 전체 판정과 착수 가능 여부
2. `P0` 개발 착수 전 결함
3. `P1` PoC·MVP 범위와 구조 결함
4. `P2` 운영·GitHub 관리 품질 개선
5. 현 단계에서 증명·증명 불가·Dummy 대체할 요소
6. 기술 스택 적합성 및 오픈소스·상용 구분
7. 개발 일정과 월 비용 산식
8. 요구사항·TASK·TEST 누락 및 미존재 ID
9. 권장 수정 순서와 수정 후 TASK 수

모든 결함에는 대상 문서·요구사항 또는 TASK ID, 영향, 수정안과 완료 조건을 기록한다.

## 9. 최종 체크리스트

### SRS

- [ ] PRD의 모든 요구사항과 제외 범위를 추적할 수 있다.
- [ ] 기술 스택과 아키텍처 다이어그램이 완비되어 있다.
- [ ] API·데이터·상태·보안·배포·비용 명세가 측정 가능하다.
- [ ] 핵심 정책의 상태와 Owner가 명확하다.
- [ ] PoC, M1, M2, M3의 합격 조건이 분리되어 있다.
- [ ] Mock 성공과 Production 통합 성공을 구분한다.

### TASK

- [ ] 데이터와 API 계약이 UI보다 먼저 정의되어 있다.
- [ ] Command와 Query가 분리되어 있다.
- [ ] 하나의 TASK에는 하나의 목적이 있다.
- [ ] 실패하는 테스트가 구현보다 먼저 작성된다.
- [ ] 모든 TASK가 SRS를 커버하며 SRS를 넘어가지 않는다.
- [ ] 모든 의존 ID가 실제로 존재한다.
- [ ] 순환 의존성이 없다.
- [ ] GitHub Issue와 Project 필드로 실행할 수 있다.

### PoC·운영

- [ ] 지금 증명할 주장과 증명할 수 없는 주장을 구분한다.
- [ ] 외부 연동은 비식별 Dummy·Mock으로 대체할 수 있다.
- [ ] 일정에 정책·테스트·문서화 시간이 포함되어 있다.
- [ ] 비용 산식에 가격 기준일과 미산정 비용이 표시되어 있다.
- [ ] PoC 핵심 경로가 AI·Cron·실제 연동 없이 동작한다.
