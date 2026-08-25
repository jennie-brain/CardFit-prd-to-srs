# TASK-002: Next.js 단일 풀스택 프로젝트 기반 구축

## Summary

- 기능명: `[TASK-002 프로젝트 기반] Next.js App Router 단일 풀스택 및 UI·서버 경계 구축`
- 목적: 이후 모든 CardFit TASK가 같은 프로젝트 구조·실행환경·코딩 경계를 사용하도록 M0 공통 기반을 정의하고 검증한다.
- 단계: `M0`
- 우선순위: `priority:critical`
- 상태: `Blocked by TASK-001`
- 담당: MVP 개발 엔지니어
- 검토자: 제품 PM, 기술 검토자

## Description

### 배경

CardFit 독립 MVP는 별도 프론트엔드와 백엔드 서버를 만들지 않고 하나의 Next.js App Router 프로젝트로 구현한다. UI는 Tailwind CSS와 shadcn/ui를 사용하며, 서버 로직은 Server Actions·Route Handlers·Server Components의 서버 경계 안에 둔다. 계산 엔진은 이후 TASK에서 순수 TypeScript 도메인 모듈로 구현하고, Prisma·Supabase는 M1 단계에서 추가한다.

이 TASK는 실제 프로젝트 기반을 구축하기 위한 풀버전 작업 명세다. 현재 문서 작성 단계에서는 패키지 설치, 프로젝트 생성, 코드 작성 또는 배포를 수행하지 않는다.

TASK-001의 정책 기준선이 없으면 시나리오·정책 관련 도메인 폴더와 명명 규칙을 확정할 수 없다. 따라서 이 TASK 본문은 작성하되 실제 착수 상태는 `Blocked by TASK-001`로 유지한다.

### SRS 참조

- 기술 제약: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md#87-구현-기술-제약-c-tec`
- 허용·금지 기술 경계: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md#871-허용금지-기술-경계`
- 기술 아키텍처: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md#88-기술-아키텍처`
- 기술 요구사항: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md#89-기술-요구사항`
- Next.js 인터페이스 배치: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md#810-nextjs-인터페이스-배치`
- 단계별 구현 기준선: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md#121-단계별-구현-기준선`

### 관련 요구사항

| ID | 이번 TASK의 책임 |
| --- | --- |
| C-TEC-001 | 실행 가능한 Next.js App Router 애플리케이션을 하나만 둔다. |
| C-TEC-002 | 서버 로직을 Server Actions 또는 Route Handlers로 구현할 기반을 만든다. |
| C-TEC-004 | Tailwind CSS와 shadcn/ui를 기본 UI 체계로 설정한다. |
| C-TEC-007 | 이후 Vercel Git 배포가 가능한 단일 프로젝트 구조를 사용한다. |
| REQ-ARCH-001 | 별도 CardFit 백엔드 없이 단일 Next.js 앱을 사용한다. |
| REQ-ARCH-002 | 비밀정보·DB·서버 전용 모듈을 client bundle과 분리한다. |
| REQ-ARCH-003 | UI 변경 명령을 배치할 Server Action 경계를 정의한다. |
| REQ-ARCH-004 | 외부 HTTP 계약을 배치할 Route Handler 경계를 정의한다. |
| REQ-ARCH-005 | 순수 TypeScript 도메인 로직을 UI·인프라와 분리할 위치를 만든다. |
| REQ-ARCH-008 | 상시 Worker·요청 간 메모리 공유를 전제하지 않는다. |
| REQ-UI-001~003 | Tailwind·shadcn/ui·design token 기반을 구성한다. |

### 제안 디렉터리 경계

아래 구조는 구현 시 검토할 기준이며, 세부 파일명은 실제 Next.js 버전과 프로젝트 상태에 맞춰 조정할 수 있다.

```text
app/
  (product)/              # 사용자 제품 화면
  api/                    # Route Handlers
  layout.tsx
  page.tsx
components/
  ui/                     # shadcn/ui 기반 공용 요소
  cardfit/                # CardFit 제품 컴포넌트
lib/
  domain/                 # 순수 TypeScript 정책·계산·타입
  application/            # 유스케이스 조정
  adapters/               # Mock/Production 외부 경계
  server/                 # server-only 모듈·환경 변수·DAL
  validation/             # 공유 입력 schema
styles/                   # 전역 token 또는 필요한 최소 스타일
tests/
  unit/
  integration/
  e2e/
```

`lib/domain`은 React, Next.js, Prisma, Supabase, Gemini SDK에 의존하지 않는다. `lib/server`는 `server-only` 경계를 사용하며 Client Component에서 import할 수 없다. M0에서는 `lib/adapters`에 비식별 Fixture 인터페이스 자리만 만들고 실제 Mock Adapter 구현은 TASK-011에서 다룬다.

## Scope

### 포함 범위

1. Next.js App Router·TypeScript 기반 단일 애플리케이션의 생성 기준을 정한다.
2. Tailwind CSS와 shadcn/ui의 기본 설정 및 design token 관리 위치를 정한다.
3. Server Component와 Client Component의 사용 원칙을 정한다.
4. Server Actions·Route Handlers의 책임과 사용 기준을 정한다.
5. `domain`·`application`·`adapters`·`server` 모듈의 의존 방향을 정의한다.
6. 서버 전용 코드의 위치와 Client Component에서의 import 금지 규칙을 정한다.
7. lint·type check·build·최소 smoke test 명령을 정의한다.
8. 환경 변수 예제 파일에는 변수명과 공개·서버 구분만 제공하고 실제 비밀값을 포함하지 않는다.
9. 이후 Vercel 연결을 방해하지 않는 표준 빌드 구조를 사용한다.

### 제외 범위

- Net Benefit 정책·시나리오 변동 폭 결정
- CardFit 도메인 엔터티 상세 구현
- 카드·사용자 Fixture 및 Seed 생성
- 계산 엔진·조합 최적화 구현
- Prisma·Supabase 설치·schema·migration
- 인증·사용자 계정 구현
- Vercel 프로젝트 실제 연결·배포
- Gemini·Vercel AI SDK 설치 및 호출
- Cron·Outcome 계측 구현
- Production Platform Adapter 구현

## Architecture Rules

| 규칙 | 허용 | 금지 |
| --- | --- | --- |
| 애플리케이션 수 | Next.js App Router 프로젝트 1개 | 별도 Frontend·Backend 저장소 |
| 서버 로직 | Server Actions, Route Handlers, Server Components | Express·NestJS·Spring 등 별도 API 서버 |
| 도메인 계산 | 순수 TypeScript 함수 | React hook·DB client·AI SDK에 결합된 계산 |
| 클라이언트 상태 | 화면 상호작용에 필요한 최소 상태 | 비밀키·DB 연결·금융 원본 데이터 보관 |
| UI | Tailwind CSS, shadcn/ui, design token | 별도 UI 프레임워크, 무제한 inline style |
| 외부 연결 | Adapter 인터페이스 경유 | 화면 컴포넌트에서 외부 API 직접 호출 |
| 장기 작업 | 후속 Route Handler·Vercel Cron | 상시 Worker·프로세스 타이머 |
| 환경 변수 | 서버 전용 변수와 공개 변수 명시적 분리 | 비밀값에 `NEXT_PUBLIC_` 사용 |

## Dependency Direction

```text
UI → application → domain
Route Handler / Server Action → application → domain
application → adapter interface
adapter implementation → external service or Fixture
server / DAL → infrastructure

domain -X→ React / Next.js / Prisma / Supabase / Gemini
client -X→ server-only / DAL / secret environment variables
```

상위 계층이 하위 구현체에 직접 결합되지 않도록 한다. 특히 `domain`은 모든 후속 기능이 공유하는 안정된 중심이므로 프레임워크와 인프라 import를 허용하지 않는다.

## Acceptance Criteria (GWT)

### AC-001: 단일 Next.js 애플리케이션

- Given: 빈 작업 공간에서 CardFit M0 프로젝트 기반을 생성한다.
- When: 프로젝트 구조와 package script를 검사한다.
- Then: 실행 가능한 Next.js App Router 애플리케이션은 정확히 1개다.
- And: 별도 Backend 애플리케이션·서버·저장소는 0개다.

### AC-002: 기본 빌드 검증

- Given: 의존성이 설치되고 필요한 비밀값 대신 안전한 개발 기본 설정이 제공돼 있다.
- When: lint, type check, test, production build를 실행한다.
- Then: 모든 명령이 exit code 0으로 종료된다.
- And: TypeScript 오류와 lint error는 0건이다.

### AC-003: 최소 server-only 구조 경계

- Given: `lib/server`에 향후 DB·AI·Adapter 코드를 배치할 서버 전용 경계가 있다.
- When: 프로젝트 구조와 import 규칙을 검토한다.
- Then: Client Component에서 `lib/server`를 import하지 않는다는 규칙과 검사 방법이 문서화돼 있다.
- And: M0 예제 코드에는 서버 전용 모듈을 Client Component에서 import한 사례가 0건이다.
- And: 실제 DB·AI·Production Adapter 비밀정보 검사는 TASK-012·014·019·020의 완료 조건으로 이관된다.

### AC-004: 도메인 독립성

- Given: `lib/domain`에 정책·타입·계산 함수가 위치한다.
- When: 도메인 모듈의 import graph를 검사한다.
- Then: React, Next.js, Prisma, Supabase, Vercel AI SDK와 Gemini provider import는 0건이다.
- And: 도메인 단위 테스트는 Next.js runtime 없이 실행할 수 있다.

### AC-005: Actions·Routes 책임 분리

- Given: UI 변경 명령과 외부 HTTP 계약의 예제 경계가 필요하다.
- When: 각각의 최소 placeholder 또는 문서화된 예제를 검토한다.
- Then: UI에 결합된 변경 명령은 Server Action 위치에 정의된다.
- And: 외부 호출·HTTP 응답이 필요한 계약은 Route Handler 위치에 정의된다.
- And: 두 경계 모두 입력 검증·세션·소유권 검사를 후속 구현에서 수행해야 한다는 공통 규칙을 가진다.

### AC-006: UI 체계

- Given: 기본 레이아웃과 최소 smoke 화면을 작성한다.
- When: 스타일과 컴포넌트 import를 검사한다.
- Then: Tailwind CSS utility와 design token을 사용한다.
- And: 기본 상호작용 요소는 shadcn/ui 컴포넌트 사용을 원칙으로 한다.
- And: 비허용 UI 프레임워크와 무제한 inline style은 0건이다.

### AC-007: 환경 변수 최소 규칙

- Given: M0 프로젝트에 `.env.example` 또는 환경 변수 목록이 있다.
- When: 예제 파일과 명명 규칙을 검토한다.
- Then: 실제 비밀값을 포함하지 않고 변수의 목적과 공개·서버 구분만 기록한다.
- And: `NEXT_PUBLIC_`는 브라우저 공개가 허용된 값에만 사용한다는 규칙이 문서화돼 있다.
- And: 실제 credential 주입·bundle 검사·secret scanning은 해당 외부 서비스를 도입하는 후속 TASK에서 수행한다.

### AC-008: 실패 사례

- Given: M0에는 DB·AI·Production Adapter가 아직 도입되지 않았다.
- When: 실제 credential 없이 애플리케이션을 build하고 smoke 화면을 실행한다.
- Then: 외부 서비스 credential을 요구하지 않고 정상 실행된다.
- And: 향후 필요한 환경 변수는 도입 TASK·목적·공개 여부만 목록화하며 임의의 실제 값이나 그럴듯한 placeholder secret을 넣지 않는다.

### AC-009: TASK-001 차단 준수

- Given: TASK-001 정책 기준선이 작성·승인되지 않았다.
- When: TASK-002 착수 가능 상태를 평가한다.
- Then: TASK-002 상태는 `Blocked by TASK-001`로 유지된다.
- And: 시나리오 enum·정책 파일·Net Benefit 계산 구현을 임의로 생성하지 않는다.

## Non-Functional Constraints

- 빌드 신뢰성: clean install 후 lint·type check·test·build 성공률은 100%여야 한다.
- 구조 일관성: 실행 가능한 Next.js 앱과 배포 단위는 각각 1개여야 한다.
- 보안: M0 예제 파일에 실제 credential을 기록하지 않고 서버 전용 import·환경 변수 명명 규칙을 문서화해야 한다.
- 의존성 경계: `domain`의 React·Next.js·Prisma·Supabase·AI SDK import는 0건이어야 한다.
- UI 일관성: 기본 화면에서 Tailwind·shadcn/ui 이외의 UI 프레임워크 사용은 0건이어야 한다.
- 접근성: 기반 smoke 화면에 WCAG 2.2 AA critical 오류가 없어야 한다.
- 성능: 빈 기반 화면의 성능은 후속 제품 기능의 SLO를 방해하지 않아야 하며, 계산 API p95 5초는 이 TASK의 직접 합격 기준이 아니다.
- 비용: M0 기반 구축에서 유료 외부 서비스 호출과 클라우드 리소스 생성은 0건이어야 한다.
- 재현성: 지원되는 개발 환경에서 문서화된 단일 명령 흐름으로 설치·검증할 수 있어야 한다.

## Dependencies and Interactions

### 선행 의존성

| 선행 TASK·문서 | 상태 | 영향 |
| --- | :---: | --- |
| TASK-001 정책 기준선 | 미작성 | 시나리오·정책 명명을 확정할 수 없어 TASK-002 착수 차단 |
| SRS v1.6 C-TEC | 존재 | 기술 스택과 금지 경계를 제공함 |
| TASK 템플릿 | 존재 | 본문 필수 구조를 제공함 |

### 후속 TASK 상호작용

| 후속 순서 | 전달할 기반 | 잘못 설계했을 때의 영향 |
| :---: | --- | --- |
| 3 도메인 모델 | `lib/domain` 경계·테스트 위치 | 도메인이 React·DB에 결합됨 |
| 4 Fixture·Seed | Fixture 위치·import 방향 | 테스트 데이터가 UI·DB에 중복됨 |
| 5 미래지출 입력 | app route·공용 UI·validation 위치 | 클라이언트·서버 검증이 달라짐 |
| 6~9 계산·결과 | domain·application·Route 경계 | 계산이 화면·HTTP와 결합됨 |
| 11 Adapter | adapter interface·server 경계 | UI가 외부 API를 직접 호출함 |
| 12 Prisma·Supabase | server/DAL 자리·환경 변수 규칙 | Prisma가 client bundle에 포함될 수 있음 |
| 13 통합 UI·API | 단일 앱·공통 스크립트 | 기능별 실행·배포 방식이 달라짐 |
| 19 Gemini | server-only AI Adapter 위치 | AI key 또는 금융 데이터가 브라우저에 노출됨 |

## Deliverables

1. 단일 Next.js App Router 프로젝트 구조
2. TypeScript·Tailwind CSS·shadcn/ui 기본 설정
3. `domain`·`application`·`adapters`·`server` 의존 방향 문서
4. Server Action·Route Handler 사용 기준
5. server-only 위치·import 금지 규칙과 환경 변수 공개·서버 구분 기준
6. lint·type check·test·build package scripts
7. `.env.example`과 환경 변수 공개·서버 명명 규칙
8. 최소 smoke 화면과 smoke test
9. 후속 TASK가 사용할 디렉터리·import 규칙

## Work Checklist

- [ ] TASK-001 승인 여부를 확인하고 차단 상태를 해제한다.
- [ ] Next.js App Router·TypeScript 단일 프로젝트를 생성한다.
- [ ] Tailwind CSS와 shadcn/ui 기본 설정을 적용한다.
- [ ] design token 위치와 사용 규칙을 정의한다.
- [ ] 계층별 디렉터리와 공개 import 경계를 만든다.
- [ ] `domain`의 프레임워크 독립성 검사를 구성한다.
- [ ] `server-only` 위치와 Client Component import 금지 규칙을 구성한다.
- [ ] Actions·Routes 책임 분리 예제를 작성한다.
- [ ] lint·type check·unit test·build 명령을 구성한다.
- [ ] 최소 smoke 화면과 테스트를 작성한다.
- [ ] `.env.example`에 변수명과 공개·서버 구분만 기록한다.
- [ ] 실제 secret 검증을 TASK-012·014·019·020의 의존성으로 연결한다.
- [ ] 아키텍처 규칙과 실행 방법을 README에 기록한다.

## Definition of Ready

- TASK-001 정책 기준선이 승인됐다.
- 지원할 Node.js·package manager·Next.js 버전이 기록됐다.
- 프로젝트 생성 경로와 기존 문서 저장소와의 배치 방법이 결정됐다.
- M0에서는 Prisma·Supabase·Gemini를 도입하지 않는다는 범위가 확인됐다.
- 기술 검토자가 단일 Next.js 앱과 계층 경계를 승인했다.

## Definition of Done

- [ ] AC-001~009가 모두 충족됐다.
- [ ] clean install 후 lint·type check·test·build가 성공한다.
- [ ] 별도 Backend·상시 Worker·추가 UI 프레임워크가 없다.
- [ ] M0 예제 코드에서 Client Component의 `lib/server` import가 0건이다.
- [ ] 예제 환경 변수 파일에 실제 비밀값이 없다.
- [ ] `domain`이 React·Next.js·DB·AI SDK에 의존하지 않는다.
- [ ] 최소 smoke 화면이 Tailwind·shadcn/ui 기반으로 렌더링된다.
- [ ] 후속 TASK가 사용할 디렉터리·import·검증 규칙이 문서화됐다.
- [ ] 실제 클라우드·DB·AI 유료 리소스를 생성하지 않았다.

## PM Review Gate

| 확인 질문 | 승인 기준 | 미충족 시 |
| --- | --- | :---: |
| 실행 가능한 애플리케이션이 하나뿐인가? | Next.js App Router 프로젝트 1개, 별도 Backend 0개 | 보완 필요 |
| 초급자가 구조를 설명할 수 있는가? | 각 주요 디렉터리의 책임을 한 문장으로 설명 가능 | 보완 필요 |
| 기술이 M0 가치 검증보다 앞서지 않는가? | Prisma·Supabase·Gemini·Cron을 이 TASK에서 제외 | 승인 필수 |
| 계산 로직이 UI·DB와 분리되는가? | domain import 금지 규칙과 단위 테스트 경계 존재 | 승인 필수 |
| 이후 비밀정보가 잘못 배치되지 않을 구조인가? | server-only 위치·import 금지·`NEXT_PUBLIC_` 사용 규칙이 문서화됨 | 승인 필수 |
| AI가 임의 구조를 추가하기 어려운가? | 허용·금지 기술과 import 방향이 문서화됨 | 보완 필요 |
| 후속 TASK가 같은 기반을 재사용할 수 있는가? | 공용 실행·검증 명령과 경로가 정의됨 | 승인 필수 |

## Risks and Mitigations

| 위험 | 영향 | 대응 |
| --- | --- | --- |
| 프로젝트 기반에서 과도한 추상화를 도입함 | 핵심 기능 개발이 지연됨 | M0에서 실제로 필요한 계층과 placeholder만 생성함 |
| Clean Architecture를 형식적으로 복제함 | 파일 이동과 boilerplate가 증가함 | 의존 방향만 강제하고 불필요한 interface는 만들지 않음 |
| Prisma·Supabase를 조기 설치함 | Docker·migration 학습이 M0를 지연함 | TASK-012까지 DB 구현을 금지함 |
| Server Action과 Route Handler를 중복 구현함 | 동일 기능에 두 경로가 생김 | UI 명령과 HTTP 계약의 선택 기준을 문서화함 |
| shadcn/ui 코드를 무분별하게 추가함 | 사용하지 않는 컴포넌트와 스타일이 증가함 | smoke 화면에 필요한 최소 컴포넌트만 추가함 |
| 기반 TASK에서 보안 검증을 과도하게 구현함 | M0 착수가 지연되고 후속 서비스가 없는 상태에서 불필요한 검사가 늘어남 | TASK-002는 구조·명명 규칙만 정하고 실제 검증은 TASK-012·014·019·020으로 이관함 |
| TASK-001 없이 시나리오 enum을 확정함 | 다음 단계에서 명명과 schema를 다시 수정함 | 차단 상태를 유지하고 placeholder 정책 구현을 금지함 |

## Labels

- `type:foundation`, `area:fullstack`, `area:architecture`, `mvp:m0`, `priority:critical`, `status:blocked`, `stack:nextjs`, `stack:tailwind`, `stack:shadcn`

## Suggested GitHub Project Fields

| 필드 | 값 |
| --- | --- |
| Status | Blocked |
| Priority | Critical |
| Phase | M0 |
| Type | Foundation |
| Owner | MVP Developer |
| Dependency | TASK-001 |
| Blocks | TASK-003~TASK-20의 공통 프로젝트 기반 |

## Notes for the Next Prompt

다음 순서인 TASK-003 도메인 모델은 TASK-001과 TASK-002가 승인된 뒤에만 작성하는 것이 원칙이다. 사용자의 별도 확인 전에는 TASK-003 문서 작성, TASK-002 구현, 패키지 설치 또는 프로젝트 생성을 진행하지 않는다.
