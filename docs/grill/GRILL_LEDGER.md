# Grill Ledger — CardFit 프로토타입 시각화 계획

## 개요

이 문서는 CardFit 프로토타입(로컬 시각 검증 슬라이스)의 **개발 착수 전 미해소 결정 토픽 원장**이다. `/grill-it` 세션이 토픽을 하나씩 해소하며 이 파일을 갱신한다. 세션이 중단되어도 첫 `UNRESOLVED` 토픽부터 재개한다.

- 참조 범위: `PRD/PRD_CardFit_v1.3.md`, 계획 정본 `TASK/task1/prototype-suggestion.md` 19건, `TASK/task2`의 연결 TASK
- 관심 방향: 프로토타입 시각화 계획의 미확정 사항 (화면·상태·데이터·문구·타입 경계)
- 완료 조건: 아래 토픽 전부 `RESOLVED`
- OUTPUT: 시각화 계획 정본 `TASK/task1/prototype-visual-spec.md` + 관련 TASK 문서 + 에이전트 하네스

## 토픽 원장

RESOLVED: 13 / TOTAL: 17

- [x] T1 | CORE  | 실행 슬라이스 확정 | status:RESOLVED | decision:11건 로컬 시각안 + 최소 ViewModel 타입 스케치 | superseded-by:T17
- [x] T2 | CORE  | 프로토타입 코드 거처와 실행 방식 | status:RESOLVED | decision:저장소 루트 Next.js App Router 앱 + npm run dev | applied:prototype-visual-spec.md §2, .agents/rules/006
- [x] T3 | CORE  | 8개 화면의 라우팅 구조 — 단일 라우트 상태전환 vs 라우트 분리 | status:RESOLVED | decision:4개 주요 라우트(`/`, `/onboarding`, `/plan`, `/result`) + 라우트 내부 상태 전환 | superseded-by:T17
- [x] T4 | CORE  | UI가 바인딩할 타입 원천 — SPEC-001 미확정 상태의 ViewModel 처리 | status:RESOLVED | decision:`lib/prototype/view-model.ts` 단일 진입점 + 기능별 ViewModel + 공통 상태 타입 | applied:TASK/task1/prototype-visual-spec.md §4, .agents/rules/006
- [x] T5 | CORE  | Fixture 위치·형식과 상태 전환 조작 수단(상태 스위처) | status:RESOLVED | decision:`fixtures/prototype/*.ts` + 상태별 URL + `review=1` 검토자 전용 패널 | applied:TASK/task1/prototype-visual-spec.md §5, .agents/rules/006
- [x] T6 | CORE  | 상태 언어 7종(loading·empty·partial·stale·error·unavailable·success) 한글 카피 확정 범위 | status:RESOLVED | decision:대표 제목·의미·CTA 확정 + 일반 안내 해요체/조건·고지 합니다체 | applied:TASK/task1/prototype-visual-spec.md §6, TASK/task2/UX-001 Decision Log, .agents/rules/006
- [x] T7 | CORE  | 스코프 고지·금지어 문구 원천 (COMMAND-008 미포함 상태, GR4 직결) | status:RESOLVED | decision:PRD 기반 후보 고지 3종 + 금지 표현 고정, `COMMAND-008` 승인 시 교체 | applied:TASK/task1/prototype-visual-spec.md §7, TASK/task2/UI-002·UX-004·UI-007 Decision Log, .agents/rules/006
- [x] T8 | CORE  | 입력 초기값 정책 충돌 — PRD US-D AC4(업계 평균) vs UI-003 AC3(빈 폼) | status:RESOLVED | decision:빈 값 시작 + 사용자 선택 시 수정 가능한 비개인화 예시 적용, 업계 평균은 승인 후 M2 | applied:PRD v1.3 US-D AC4, prototype-visual-spec.md §8, TASK 정책 로그 DECISION-004, UX-002·UI-003 Decision Log, .agents/rules/006
- [x] T9 | MINOR | SINGLE/RANGE 기본 모드·입력 단계 수·단위별 금액 입력 편의 | status:RESOLVED | decision:`/plan` 2단계 + SINGLE 기본/RANGE 선택 확장 + 선택형 대분류 + 만원 고정 입력·환산 표시 | applied:prototype-visual-spec.md §8.3~8.6, UX-002·UI-003 Decision Log, .agents/rules/006
- [x] T16 | CORE  | 할부 계획 입력과 계산 미반영 경계 — 할부 귀속 정책 미정 | status:RESOLVED | decision:프로토타입 할부 옵션 제외 + 결과 근거에 미반영 항목 고지 + DECISION-005 Open 유지 | applied:prototype-visual-spec.md §8.8, TASK 정책 로그 DECISION-005, UX-002·UI-003 Decision Log, .agents/rules/006
- [x] T14 | CORE  | 미래지출 항목 구조 — 다건·시점 단위·증가/감소·confidence 노출 | status:RESOLVED | decision:다건 + ONE_TIME/MONTHLY + 연·월 + 비교 가능한 경우 방향·차액 자동 표시 + confidence 제외 | applied:PRD F-01·US-F AC2·FutureSpendPlan, SRS REQ-FUNC-001A/B·FutureSpendPlan, prototype-visual-spec.md §8.9, 정책 로그 DECISION-006, UX-002·UI-003 Decision Log, .agents/rules/006
- [x] T15 | CORE  | 수치 미정 입력 상한의 프로토타입 표시·검증 방식 | status:RESOLVED | decision:프로토타입 임의 상한·상한 오류 미구현, 실제 상한은 DECISION-007 Open | applied:prototype-visual-spec.md §8.10, 정책 로그 DECISION-007, UX-002·UI-003 Decision Log, .agents/rules/006
- [x] T17 | CORE | 계획 정본과 최초 실행 경량화 | status:RESOLVED | decision:19건 계획 정본 + P-VIS-01~03 + `/plan`·`/result` | applied:prototype-suggestion.md, prototype-visual-spec.md §1·3, prototype-suggestion-local-visual.md 대체 표기, .agents/rules/006
- [ ] T10 | MINOR | 시나리오 탭 라벨 카피와 유지·동률 결론의 시각 위계                    | depends:T3  | status:UNRESOLVED
- [ ] T11 | MINOR | 근거 패널 기본 펼침 수준과 AI 설명 영역의 프로토타입 노출 여부        | depends:T3  | status:UNRESOLVED
- [ ] T12 | MINOR | 디자인 토큰 출발점(기존 랜딩 계승 여부)·breakpoint·플랫폼 브랜드 표기 | depends:T2  | status:UNRESOLVED
- [ ] T13 | MINOR | 시각 검토 판정 기록 방식과 접근성 리뷰 포함 여부                      | depends:T1  | status:UNRESOLVED

## 해소 기록

### T1 — 실행 슬라이스 확정 (CORE)

- 결정: 11건 로컬 시각안(UX-001~004 · UI-001~007)을 실행하되, 화면이 바인딩할 **최소 ViewModel 타입 스케치**를 선행 고정한다. 계약 TASK 8건은 착수하지 않는다.
- 이유: 원안 19건이 지적한 재작업 위험이 "타입 정의 위치" 한 지점에 몰려 있어, 계약 8건 대신 타입 스케치 한 곳만 선행하면 화면 속도와 재작업 차단을 동시에 얻는다.
- 반영: `TASK/task1/prototype-visual-spec.md` §1 신설 · `.agents/rules/006-prototype-visual-scope.md` 신설 · `CLAUDE.md` 세부 규칙 표에 006 행 추가

### T2 — 프로토타입 코드 거처와 실행 방식 (CORE)

- 결정: 저장소 루트에 Next.js App Router 앱(TypeScript · Tailwind · shadcn/ui)을 부트스트랩하고 `npm run dev`로 실행한다. `src/` 없이 루트 `app/`·`components/`·`lib/`·`fixtures/`를 사용한다.
- 이유: `AGENTS.md`의 "앱 하나만 둔다" 원칙에 정합하고, 프로토타입 코드가 본 개발이 이어받는 같은 앱이어야 T1의 타입 스케치 결정이 의미를 갖는다.
- 반영: `prototype-visual-spec.md` §2 신설(디렉터리 배치·비작성 목록 포함) · `.agents/rules/006`에 코드 거처 절 추가

### T3 — 화면 라우팅 구조 (CORE)

- 결정: 시작·온보딩·입력·결과를 `/`, `/onboarding`, `/plan`, `/result` 네 개 주요 라우트로 나누고, 계산 진행·데이터 품질·근거·선택 같은 세부 화면은 해당 라우트 내부 상태로 전환한다.
- 이유: 사용자에게는 하나의 연속 흐름을 유지하면서 개발·시각 검토에는 의미 있는 직접 진입점과 새로고침 가능성을 제공한다.
- 반영: `TASK/task1/prototype-visual-spec.md` §3 신설 · `.agents/rules/006`에 라우팅 규칙 추가

### T4 — ViewModel 타입 원천 (CORE)

- 결정: `lib/prototype/view-model.ts`를 화면 데이터 타입의 단일 진입점으로 사용하고, 온보딩·입력·결과 기능별 ViewModel에 7종 공통 상태 타입을 조합한다.
- 이유: 화면마다 데이터 이름과 구조가 달라지는 것을 막으면서 하나의 거대한 타입이 모든 화면 책임을 뒤섞는 문제를 피한다.
- 반영: `TASK/task1/prototype-visual-spec.md` §4 신설 · `.agents/rules/006`의 ViewModel 경로·구성 규칙 구체화

### T5 — Fixture와 상태 전환 수단 (CORE)

- 결정: 타입이 적용된 Fixture를 `fixtures/prototype/`에 두고, 허용된 `state` query로 상태를 재현한다. 상태 선택 패널은 `review=1`에서 개발자·검토자에게만 표시한다.
- 이유: 사용자가 데이터 상태를 선택하는 잘못된 경험을 만들지 않으면서 정상·부분·오래됨·실패 등 모든 시각 상태를 빠르게 재현하고 공유한다.
- 반영: `TASK/task1/prototype-visual-spec.md` §5 신설 · `.agents/rules/006`에 Fixture·검토 모드 규칙 추가

### T6 — 상태 언어와 카피 (CORE)

- 결정: 7종 상태의 대표 제목·의미·기본 CTA를 공통 사전으로 확정한다. 상태 제목·일반 안내는 차분한 해요체, 계산 사실·조건·고지는 합니다체, CTA는 행동형 명사구를 사용한다.
- 이유: 뱅크샐러드의 문맥별 문체를 따르면서 금융 판단 조건과 책임 경계는 단정하고 정확하게 전달한다.
- 반영: `TASK/task1/prototype-visual-spec.md` §6 신설 · `TASK/task2/UX-001` Decision Log · `.agents/rules/006` 상태 언어 규칙

### T7 — 스코프 고지와 금지 표현 (CORE)

- 결정: PRD ADR-002·GR4에 근거한 온보딩·조합 선택·외부 이동 후보 고지와 금지 표현을 프로토타입에 고정하고, `COMMAND-008` 승인 시 교체한다.
- 이유: 계약 TASK를 범위에 추가하지 않으면서 신청·발급·해지 대행 오인과 혜택 보장 표현을 시각 검토 단계부터 차단한다.
- 반영: `TASK/task1/prototype-visual-spec.md` §7 신설 · `TASK/task2/UI-002·UX-004·UI-007` Decision Log · `.agents/rules/006` 스코프 고지 규칙

### T8 — 입력 초기값 정책 (CORE)

- 결정: 미래지출 입력은 빈 값으로 시작하고 사용자가 명시적으로 선택한 경우에만 수정 가능한 비개인화 예시를 적용한다. 업계 평균은 출처·기준일·최신성·편향 검토 승인 후 M2에서만 활성화한다.
- 이유: 빈 폼의 입력 부담을 낮추면서 출처 없는 수치를 실제 통계나 개인화 값으로 오인하는 위험을 차단한다.
- 반영: `PRD/PRD_CardFit_v1.3.md` US-D AC4 정정 · `TASK/task1/prototype-visual-spec.md` §8 신설 · `TASK/task1/04_정책_결정_로그.md` DECISION-004 · `TASK/task2/UX-002·UI-003` Decision Log · `.agents/rules/006` 입력 초기값 규칙

### T9 — 금액 입력 방식 (MINOR)

- 결정: `/plan`을 미래지출·카드 조건 2단계로 구성하고 SINGLE을 기본, RANGE를 선택 확장으로 제공한다. 카테고리는 선택형 대분류와 `기타` 직접 입력을 사용하며 금액은 만원 단위 고정·전체 원 금액 환산으로 표시한다.
- 이유: 현재 공식 금융 화면에서 확인되는 목적별 고정 단위 방식을 따르고, 검증되지 않은 단위 탭 전환·소수 변환 복잡성을 제거하면서 모바일 입력 편의를 확보한다.
- 반영: `TASK/task1/prototype-visual-spec.md` §8.3~8.6 · `TASK/task2/UX-002·UI-003` Decision Log · `.agents/rules/006` 입력 조작 규칙

### T16 — 할부 계획 입력과 계산 경계 (CORE)

- 결정: 로컬 시각 프로토타입에는 할부 선택·개월 입력을 두지 않고 할부 지원을 암시하지 않는다. 결과 근거에는 할부 관련 조건을 미반영 항목으로 표시하며, 본 개발 정책 `DECISION-005`는 Open으로 유지한다.
- 이유: 귀속 정책이 없는 옵션으로 계산 정확성 기대를 만들지 않고 미래지출·시나리오·근거라는 핵심 시각 흐름에 집중한다.
- 반영: `TASK/task1/prototype-visual-spec.md` §8.8 · `TASK/task1/04_정책_결정_로그.md` DECISION-005 · `TASK/task2/UX-002·UI-003` Decision Log · `.agents/rules/006`

### T14 — 미래지출 항목 구조 (CORE)

- 결정: 미래지출은 다건으로 입력하고 각 항목은 `ONE_TIME`·`MONTHLY` 형태와 연·월 시점을 갖는다. 증가·감소를 직접 묻지 않고 비교 가능한 과거 월평균이 있을 때만 변화 방향·차액을 표시하며 `confidence`는 제외한다.
- 이유: 중복 입력 부담을 줄이면서 일회성 총액과 반복 월 금액의 의미를 구분하고 미정 필드를 앞당기지 않는다.
- 반영: `PRD/PRD_CardFit_v1.3.md` F-01·US-F AC2·FutureSpendPlan · `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md` REQ-FUNC-001A/B·FutureSpendPlan · `TASK/task1/prototype-visual-spec.md` §8.9 · `TASK/task1/04_정책_결정_로그.md` DECISION-006 · `TASK/task2/UX-002·UI-003` Decision Log · `.agents/rules/006`

### T15 — 입력 상한 경계 (CORE)

- 결정: 프로토타입에서 최대 입력 금액과 상한 초과 상태를 임의로 만들지 않는다. 실제 상한은 사용자 금액 분포·계산 성능·데이터 타입을 근거로 본 개발 전 `DECISION-007`에서 승인한다.
- 이유: 근거 없는 임시값이 제품 입력 계약과 오류 문구로 굳는 것을 막는다.
- 반영: `TASK/task1/prototype-visual-spec.md` §8.10 · `TASK/task1/04_정책_결정_로그.md` DECISION-007 · `TASK/task2/UX-002·UI-003` Decision Log · `.agents/rules/006`

### T17 — 계획 정본과 최초 실행 경량화 (CORE)

- 결정: `prototype-suggestion.md`의 19건을 계획 정본으로 유지하고 최초 실행은 `P-VIS-01~03`, `/plan`·`/result` 두 라우트로 제한한다.
- 이유: 계약 기반 본 개발 연결성을 잃지 않으면서 입력→결과→핵심 근거의 시각 가설을 먼저 검증한다.
- 반영: `prototype-suggestion.md` 실행 정책·Decision Log · `prototype-visual-spec.md` §1·3 · 11건 축약안 대체 표기 · `.agents/rules/006`
