# CardFit 경량 시각 체크포인트 — 시각 검토 기록

목표 프롬프트: `docs/goals/cardfit-visual-prototype_run-20260827-1533.md`
(원본 `docs/goals/cardfit-visual-prototype.md`에서 프롬프트 본문만 분리한 실행본)

ROUND: 5
NOGO_STREAK: 0
FULL_PASS: 0

## 사전 조건 게이트 (착수 첫 명령)

| 명령 | 출력 | 판정 |
| --- | --- | --- |
| `node -v` | `v24.19.0` | PASS |
| `npm -v` | `11.17.0` | PASS |
| `npm ping` | `PONG 685ms` (exit 0) | PASS |

목표 문서는 2026-08-27 시점에 이 머신에 Node.js가 없다고 기록했으나, 착수 시점에는
`C:\Program Files\nodejs`에 설치되어 있어 `STOP REASON: TOOLCHAIN_MISSING` 조건에 해당하지 않는다.

## BASELINE_DIRTY

착수 첫 턴 `git status --porcelain` 출력이다. 종료 방법 6)의 판정은 이 기준선과의 차이만 본다.

```
 M .agents/issue-tracker.md
 M README.md
 M "TASK/task1/08_GitHub_Project_\354\227\260\353\217\231_\353\205\270\355\212\270.md"
 M reports/benchmarks/cardfit-overseas-benchmark.html
```

## CONFLICT / ASSUMPTION

- `CONFLICT:` 목표 문서 §2는 스캐폴딩 위치를 `./.scaffold-tmp`로 지정하지만 `create-next-app@16.3.3`은
  npm 이름 규칙(`name cannot start with a period`)으로 마침표로 시작하는 디렉터리를 거부한다.
  같은 의도(저장소 안·비대화형·문서 자산 미오염)를 유지하며 `./scaffold-tmp`로 스캐폴드하고 삭제했다.
  루트 `.gitignore`에는 두 이름을 모두 줄 추가했다.
- `CONFLICT:` spec §4.2 타입 스케치는 `activeScenario: "low" | "base" | "high"`이고 §9.1은 내부 값을
  `LOW`·`BASE`·`HIGH`로 확정했다. §9.1이 더 늦은 결정(T10, 2026-08-27)이고 "내부 값"을 명시하므로
  `ScenarioKey = "LOW" | "BASE" | "HIGH"`를 따랐다. §4.2의 구조(기능별 ViewModel 조합)는 유지했다.
- `CONFLICT:` spec §4.2 `ResultViewModel`은 `evidence`와 `selection`을 함께 두지만, 근거 1~3번은
  결론이 가리키는 조합의 금액을 그대로 읽어야 값이 어긋나지 않고(§10.2), 조합 선택은 이번 범위 밖이다
  (`UI-007` 연기, rules 006). 공통 근거만 `ResultViewModel.evidence`에 두고 시나리오별 적용 조건은
  `ScenarioResultViewModel.applicationConditions`로 두고 `selection`은 만들지 않았다.
- `ASSUMPTION:` 색상·서체 token과 breakpoint·화면 최대 폭은 spec §11 미확정이다. 새 token을 확정하지
  않기 위해 shadcn/ui 중립(neutral) 기본 팔레트와 운영체제 기본 서체 스택(+한글 fallback), Tailwind
  기본 `max-w-screen-sm`을 사용했다. 화면에 브랜드 색·브랜드 서체를 새로 정의하지 않았다.
- `ASSUMPTION:` 카드 조건 단계의 기본값(최대 카드 수 3장·연회비 한도 10만 원·신규 발급 허용)은 예시
  초기값이다. 화면에 예시임을 표시하고, 계산에 반영하지 않으며, 결과 근거의 `이 계산에 포함되지 않은
  항목`에 `카드 조건 단계의 예시 초기값`으로 적었다.
- `ASSUMPTION:` 최대 카드 수 선택 후보는 1~5장이다. PRD 차별 가치표의 `최대 5장 설정 시 2⁵−1=31개
  조합` 기준을 그대로 상한으로 썼고 새 정책을 만들지 않았다.
- `ASSUMPTION:` 시점 선택의 연 후보는 Fixture `dataAsOf`(2026-08-27)에서 5년을 결정론적으로 만든다.
  `Date.now()`를 쓰지 않아 서버·클라이언트 렌더가 갈리지 않는다.
- `NOTE:` `next dev`가 루트 `AGENTS.md`에 자기 규칙 블록을 덧붙였다. 보호 대상 파일이므로
  `git checkout -- AGENTS.md`로 되돌리고 `next.config.ts`에 `agentRules: false`를 설정해 재발을 막았다.
  이후 재기동에서 `Generated AGENTS.md` 줄이 사라지고 `git status --porcelain AGENTS.md`가 비었음을 확인했다.

## Round 1

### 구현 요약

저장소 루트에 Next.js 16 App Router 앱을 부트스트랩하고 `/plan`·`/result` 두 라우트를 구현했다.
`app/page.tsx`는 범위 밖이라 삭제했고 루트 경로는 404다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:C Z:P T:C K:C S:P

TOP_FIX: `/plan` 미래지출 항목에 수정(편집) 경로를 추가하라 — 없다면 `components/prototype/plan-flow.tsx:317-318`의 "자유롭게 수정·삭제할 수 있습니다" 문구를 실제 동작(삭제·재입력)으로 맞춰라. spec §8.1·§8.9는 "추가·수정·삭제"를 확정했는데 구현은 `addItem`/`removeItem`만 있다.

EVIDENCE:
- Z: `npx tsc --noEmit` exit 0, `npm run lint` exit 0, `npm run build` exit 0(`/plan`·`/result` static). 실서버 확인: plan=200, result=200, `?state=partial`=200, root=404. `/result` SSR에 `role=tablist`+`aria-selected="true"` 1건, accordion `h3`+`aria-expanded="false"` 확인 — 완료 기준 1·3·7 근거 성립.
- 완료 기준 4·6: 렌더 텍스트에 예상 순혜택 연 153,000원 / 총 예상 혜택 / 연회비 / `생활 할인은 월 최대 1만 원까지` / 할부 미반영 고지 / `예시 데이터 result-success-01` 모두 접힌 상태에서 노출.
- T: `components/prototype/plan-flow.tsx:81-145`(수정 함수 없음), `components/prototype/future-spend-item-card.tsx:19`(`onRemove`만).
- A: `/result` 어디에도 "카드 신청·발급·해지를 대신 진행하지 않습니다" 경계가 없다(`app/result/page.tsx`, `result-screen.tsx`). PRD US-C AC8은 온보딩과 **결과 화면** 모두 고지를 전제한다. GR2 위반은 없다(delta 0 / 93,000 / 147,000 — 임계 50,000원 구간 회피).

NOTES:
- K: `amount-field.tsx:57-63` `undo()`가 setState 업데이터 안에서 `onValueChange`를 호출(비순수). `evidence-disclosure.tsx:69`만 `format.ts` 헬퍼 대신 인라인 `toLocaleString` 사용.
- K/S: `React.ReactNode`를 import 없이 참조(`future-spend-item-card.tsx:22`, `scenario-result-panel.tsx:22`, `evidence-disclosure.tsx:28`) — 다른 파일은 `import type { ReactNode }`. `Row` 헬퍼 2곳 중복.
- T: README 62-66행이 "현재 저장소에는 본문 서비스 라우트가 없으므로"라고 남아 있어 `/plan`·`/result` 추가와 모순. 실행 진입 URL은 `docs/loop/PROTOTYPE_WALKTHROUGH.md:23`에만 기록됨.
```

**판정 해석**: `VERDICT: GO`이지만 `A`·`T`·`K` 세 축이 `C`다. 목표 문서 §5에 따라 5축 전부 `P`가 아니면
완수가 아니므로 `TOP_FIX` 하나만 처리하고 다음 라운드로 간다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 2

### 처리한 TOP_FIX

`/plan` 미래지출 항목에 수정(편집) 경로를 추가했다. 문구를 약화시키는 대안 대신 spec §8.9의
`추가·수정·삭제`를 그대로 구현하는 쪽을 골랐다.

- 항목 카드에 `수정하기` 버튼과 `수정 중` 배지를 두고, 누르면 그 항목이 입력 폼으로 불러와진다.
- 수정 모드에서 폼 제목은 `미래지출 수정`, CTA는 `수정 내용 저장하기` + `수정 취소하기`로 바뀐다.
- 수정은 항목 `id`·`pastMonthlyAverageWon`·`isExampleValue`를 보존한다. 과거 월평균이 남아 있으므로
  바뀐 미래 금액으로 방향·차액이 다시 표시된다(spec §8.9). 예시 값도 그대로 수정할 수 있다(spec §8.1).
- 수정 중인 항목을 삭제하거나 예시를 적용·지우면 편집 상태를 함께 초기화한다.
- `exampleApplied`를 별도 state에서 `items.some((item) => item.isExampleValue)` 파생값으로 바꿨다.
  수정·삭제가 생긴 이상 별도 state는 목록과 어긋날 수 있어 TOP_FIX 처리에 필요한 범위로 함께 고쳤다.

스코어카드 `NOTES`의 항목(비순수 `undo`, 인라인 `toLocaleString`, `React.ReactNode` import 방식,
`Row` 중복, README 모순)은 이번 라운드에서 손대지 않았다. 목표 문서 §2 "한 라운드에는 `TOP_FIX`
하나만 처리한다"를 따른다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### 라운드 진행 중 발생한 외부 이벤트

- `NOTE:` Round 2 EVALUATE 1차 디스패치가 판정 전에 세션 사용 한도(HTTP 429)로 중단됐다.
  판정이 아니라 실행 실패이므로 `ROUND`·`NOGO_STREAK`을 올리지 않고 같은 라운드를 재디스패치했다.
- `NOTE:` 같은 시각 다른 세션이 `TASK/task1` 문서 이름을 번호 체계로 바꿨다.
  `prototype-suggestion.md` → `07_시각_프로토타입_전체_계획.md`,
  `prototype-suggestion-local-visual.md` → `09_시각_프로토타입_실행_요약.md`,
  `prototype-visual-spec.md` → `10_시각_프로토타입_화면_명세.md`,
  `reports/cardfit-overseas-benchmark.html` → `reports/benchmarks/`.
  완료 기준 9항목 원문은 그대로다. 이 목표의 산출물과 분리한 실행 프롬프트의 참조 경로도 함께
  갱신되어 있어 추가 수정이 필요하지 않았고, 이름 변경 후 검증 3종을 다시 실행해 모두 exit 0을 확인했다.

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:C Z:P T:C K:C S:C

TOP_FIX: `/result`에 스코프 경계 고지를 추가하라 — `ScopeNotice`(또는 §7.2 문구 중 "카드 신청·발급·해지를 대신 진행하지 않습니다")를 `components/prototype/result-screen.tsx`에 렌더해, `/result` 직접 진입·새로고침(spec §3.2)에서도 "계산만 하고 실행은 대행하지 않는다"가 전달되게 하라. 검증: `curl -s localhost:3000/result | grep "대신 진행하지 않습니다"` >= 1.

EVIDENCE
- Z: 내가 직접 실행 — `npx tsc --noEmit`/`npm run lint`/`npm run build` 모두 exit 0, dev 서버 `/plan`=200 `/result`=200 `/`=404 `?state=partial`=200. `/result` SSR에 `role=tablist` 1·`aria-selected=true` 1·`aria-expanded=false` 1. Fixture 산술 전건 일치(48,000/153,000/231,000, delta 0/93,000/147,000 → GR2 임계 50,000 회피).
- A: `curl /result | grep "카드 신청"` = 0건 vs `/plan` 2건. PRD US-C AC8은 온보딩과 **결과 화면** 모두 고지를 전제.
- T: 완료 기준 1~9 충족(기준 8 금지어 grep 0건, 기준 9 `gh issue list --state closed` = `[]` + `docs/loop/PROTOTYPE_REVIEW_LOG.md` 체크포인트 기록).

NOTES
- T: spec §8.5 "입력값에 천 단위 구분을 표시한다" 미구현 — `amount-field.tsx`는 원문 그대로 표시하고 구분자는 환산 줄에만 있다.
- K: `evidence-disclosure.tsx:69` 인라인 `toLocaleString`이 `format.ts` 헬퍼 단일 경로 원칙을 우회. `amount-field.tsx:57-63` `undo()`가 setState 업데이터 안에서 `onValueChange` 호출(비순수). 3개 파일이 import 없이 `React.ReactNode` 참조.
- S: `README.md`에 앱·`npm run dev`·진입 URL(`/plan`) 언급이 0건 — 기준 1 근거가 `docs/loop/PROTOTYPE_WALKTHROUGH.md:23`에만 존재. 기준 7은 측정값이 아니라 클래스 구조 기반 분석 증거뿐(브라우저 미사용).
```

**판정 해석**: `VERDICT: GO`이지만 `A`·`T`·`K`·`S` 네 축이 `C`다. Round 1 대비 `S`가 `P`에서 `C`로
내려갔고 `T`의 지적 내용이 바뀌었다(수정 경로 → 천 단위 구분 표시). 완수가 아니므로 `TOP_FIX`
하나만 처리하고 다음 라운드로 간다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 3

### 처리한 TOP_FIX

`/result`에 스코프 경계 고지를 추가했다.

- 두 화면이 같은 문구를 쓰므로 `fixtures/prototype/scope-notice.ts`에 `SCOPE_NOTICE_CANDIDATE`를
  두고 `plan.ts`·`result.ts`가 함께 읽게 했다. 문구 중복을 만들지 않고, `COMMAND-008` 승인 문구가
  확정되면 이 파일 한 곳만 교체하면 두 화면이 같이 바뀐다(spec §7.1 후보 지위 관리).
- `ResultViewModel`에 `scopeNotice: ScopeNoticeViewModel`을 추가하고 `result-screen.tsx`가 결과 아래,
  `미래지출 다시 입력하기` 위에 렌더한다. 결과를 보고 실제 카드 행동을 판단하는 지점이다.
- 새 문구를 만들지 않고 spec §7.2 후보 문구를 그대로 썼다(rules 006 스코프 고지 규칙).

평가자가 제시한 검증 명령을 그대로 실행해 확인했다.

```
result_scope_grep=1      (curl -s localhost:3000/result | grep -c "대신 진행하지 않습니다")
plan_scope_grep=1
result_status=200  plan_status=200  root_status=404  state_unknown_status=200
```

`NOTES`의 항목(천 단위 구분 표시, 인라인 `toLocaleString`, 비순수 `undo`, `React.ReactNode` import,
README 언급)은 이번 라운드에서 손대지 않았다. 목표 문서 §2 "한 라운드에는 `TOP_FIX` 하나만
처리한다"를 따른다. `README.md`는 이 목표의 작업 대상이 아니고 부트스트랩 3단계가 "루트 README.md는
그대로 둔다"고 정했으므로, `S` 축의 README 지적은 이 목표 범위에서 처리할 수 없다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### 라운드 진행 중 발생한 환경 문제

- `NOTE:` `timeout`으로 `npm run dev`를 끊으면 npm 래퍼만 종료되고 `next dev` 자식이 포트를 계속
  점유한다. 다음 기동이 `Another next dev server is already running.`으로 거부되어 curl이 전부
  `000`을 반환했다. 증거 캡처 스크립트가 기동 전후로 해당 포트를 듣는 PID를 `taskkill`하도록 고쳤다.

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:P Z:P T:C K:C S:C
TOP_FIX: `TabsList`에 명시적 높이(예: `h-11 w-full`)를 주어 `h-10` 트리거가 32px 리스트를 벗어나지 않게 고치고, 375px에서 `document.documentElement.scrollWidth === clientWidth`를 측정해 완료 기준 7을 실측 증거로 남기십시오.
EVIDENCE:
- 게이트 실측: `npx tsc --noEmit`·`npm run lint`·`npm run build` 모두 exit 0 (`/plan`·`/result` 정적 prerender)
- 런타임 실측(포트 3100 정리 후 `npm run dev`): `plan=200 result=200 root=404 state_unknown=200`, `plan_scope=1 result_scope=1 result_installment=1`, 탭 3종 `role="tab"`·`aria-selected` 1/2, `netbenefit 153,000=1`
- `components/ui/tabs.tsx:30`(리스트 `group-data-horizontal/tabs:h-8`) vs `components/prototype/result-screen.tsx:44`(트리거 `h-10 flex-1`)
- Fixture 정합: `fixtures/prototype/result.ts` 6개 조합 모두 월 실적용액×12 = 총 예상 혜택, 총액−연회비 = 순혜택, 차액 0/93,000/147,000 일치
- PRD 근거 확인: `PRD/PRD_CardFit_v1.3.md:208` US-C AC8 "온보딩 및 결과 화면" — Round 3 `/result` 고지 추가의 근거가 실재함
NOTES:
- T: 명세 §8.5 "입력값에 천 단위 구분을 표시한다"가 미구현입니다. `components/prototype/amount-field.tsx`의 `<Input value={value}>`는 `1200`을 그대로 보여주고 §8.2·§8.5 예시(`1,200`)와 어긋납니다(2라운드 이상 이월). 완료 기준 9항목 자체는 모두 충족합니다.
- K: `public/`의 `next.svg`·`vercel.svg` 등 스캐폴딩 SVG 5개가 어디서도 참조되지 않습니다. `BenefitLimitPeriod`/`limitPeriod`, `PlanInputViewModel.inputMode`, `meta.status`는 Fixture에 채우지만 UI가 읽지 않습니다(app·components 내 참조 0건).
- S: `README.md`에 프로토타입 실행 절차와 진입 URL이 없습니다. `/`가 404이므로 신규 검토자는 `docs/loop/PROTOTYPE_WALKTHROUGH.md`를 먼저 읽어야 `/plan`을 찾을 수 있습니다.
```

**판정 해석**: `A`가 `C`에서 `P`로 올라왔다(Round 3 `/result` 고지 추가 효과). `T`·`K`·`S` 세 축이
`C`로 남아 완수가 아니다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 4

### 처리한 TOP_FIX

TOP_FIX가 두 부분이었고 둘 다 처리했다.

**(1) 탭 높이 넘침 수정 — 실제 레이아웃 버그였다.**
`TabsList` 기본 높이는 32px(`group-data-horizontal/tabs:h-8`)인데 트리거에 `h-10`(40px)을 직접 주어
트리거가 리스트를 8px 넘고 있었다. 1차 수정으로 리스트에 접두사 없는 `h-12`를 줬으나 실측에서
리스트가 여전히 32px였다 — `cn()`의 tailwind-merge는 `group-data-horizontal/tabs:h-8`과 `h-12`를
서로 다른 modifier로 보아 충돌 처리하지 않는다. 같은 접두사(`group-data-horizontal/tabs:h-12`)로
덮어써서 해결했다.

| 시점 | TabsList 실측 | 트리거 실측 | 넘침 |
| --- | --- | --- | --- |
| 수정 전 | 343 × 32 | 112 × 40 | 발생 |
| 1차 수정(`h-12`) | 343 × 32 | 112 × 25 | 없음(트리거가 눌려 25px) |
| 2차 수정(variant 접두사) | 343 × 48 | 112 × 41 | 없음 |

**(2) 완료 기준 7 실측 증거 확보.**
설치된 Edge를 `playwright-core`로 구동해 375×812 뷰포트에서 8개 상태의
`scrollWidth`/`clientWidth`를 측정했다. 전 상태 `375 === 375`로 가로 스크롤이 없다.
같은 세션에서 완료 기준 2·3·5의 상호작용도 실측했다(탭별 결론 배지·대표 금액·차액이 모두 다름,
`aria-expanded` false→true, 근거 6종 전부 1건, 금지 표현 0건).
측정 결과는 `docs/loop/PROTOTYPE_WALKTHROUGH.md`의 「뷰포트 증거 — 실측」·「상호작용 실측」 절에 있다.

- `ASSUMPTION:` 측정 도구는 저장소 의존성으로 추가하지 않았다. `npm install --no-save playwright-core`로
  설치해 `package.json`·`package-lock.json`이 바뀌지 않음을 `git status --porcelain`으로 확인했고,
  측정 스크립트와 스크린샷은 scratchpad에만 두었다. 이 단계의 완료 근거로 자동 테스트 Gate를
  제시하지 않는다는 rules 006 「완료 처리 규칙」을 지키기 위해, 측정은 시각 검토 증거로만 쓴다.
- 측정 중 화면 서체가 monospace로 보여 확인했으나 computed `font-family`는 의도한 시스템 스택
  (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Malgun Gothic", …`)이었다. headless 렌더링
  특성이고 코드 결함이 아니므로 고치지 않았다.

`NOTES`의 항목(천 단위 구분 표시, 미사용 `public/*.svg`, UI가 읽지 않는 ViewModel 필드, README)은
이번 라운드에서 손대지 않았다. 목표 문서 §2 "한 라운드에는 `TOP_FIX` 하나만 처리한다"를 따른다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:P Z:P T:C K:C S:C
TOP_FIX: `components/prototype/amount-field.tsx`의 `<Input value={value}>`에 천 단위 구분 표시를 넣어 명세 §8.5·§8.2 예시(`1,200`)와 일치시키십시오(입력 중 caret·`parseManwonInput` 정규화 유지). 구현하지 않기로 한다면 09 문서 「아직 확정하지 않은 사항」에 이월 사유를 기록해 문서-구현 모순을 없애십시오.
EVIDENCE:
- Z: 직접 실행 — `npx tsc --noEmit` exit 0 / `npm run lint` exit 0 / `npm run build` exit 0(`/plan`·`/result` 정적 prerender). `npm run dev`(:3111)에서 plan=200, result=200, `?state=partial`=200(동일 Fixture), `/`=404. 렌더 HTML의 `data-slot="tabs-list"` class에 `group-data-horizontal/tabs:h-12`·`w-full`만 남아 Round 4 (a) 수정이 실렌더로 확인됩니다. `aria-selected=true` 1건/false 2건.
- T 근거: `TASK/task1/10_시각_프로토타입_화면_명세.md:424` "입력값에 천 단위 구분을 표시한다" vs `components/prototype/amount-field.tsx:68-79`(원문 그대로 표시). 3라운드 이월.
- 완료 기준: 1·3·4·6·8은 실렌더 텍스트로, 5는 `evidence-disclosure.tsx`의 근거 6종 + Fixture로, 9는 이슈 조작·`Done` 기록 없음으로 확인. `fixtures/prototype/result.ts` 6개 조합 전부 월합×12=총혜택, 총혜택−연회비=순혜택, 차액 0/93,000/147,000 일치.
NOTES:
- K: `evidence-disclosure.tsx:88`이 `toLocaleString`을 인라인 호출해 `lib/prototype/format.ts` 상단의 "화면은 이 파일만 사용" 규칙과 어긋납니다(`formatMonthlyWon` 사용 가능).
- K: `public/*.svg` 5개 미참조, `limitPeriod`·`inputMode`·`meta.status`는 UI 참조 0건으로 view-model.ts의 "최소 필드만 둔다" 주석과 상충합니다.
- S: `README.md`에 실행 절차·진입 URL이 없고 `/`가 404여서 신규 검토자는 `docs/loop/PROTOTYPE_WALKTHROUGH.md`를 먼저 읽어야 합니다(이번 목표 범위 밖).
```

**판정 해석**: Round 3과 같은 `A:P Z:P T:C K:C S:C`다. Round 4 수정(탭 높이·실측)이 실렌더로 확인됐고
`T`의 지적이 천 단위 구분 하나로 좁혀졌다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 5

### 처리한 TOP_FIX

spec §8.5 "입력값에 천 단위 구분을 표시한다"를 구현했다. 이월 사유를 문서에 적는 대안 대신
명세를 구현하는 쪽을 골랐다 — 명세가 확정한 사항이고 §8.2·§8.5 예시가 `1,200`을 그대로 보여준다.

- `lib/prototype/plan-input.ts`에 `formatManwonInputDisplay`와 `caretIndexAfterDigits`를 추가하고
  `AmountField`가 표시값만 포맷하도록 했다. 상태에는 사용자 입력 원문이 그대로 남고
  `parseManwonInput`이 쉼표·공백을 정리하므로 정규화 경로는 바뀌지 않는다.
- **비숫자 입력에는 구분자를 넣지 않는다.** 숫자 외 문자를 지우면 `NOT_NUMERIC` 오류 상태에
  도달할 수 없게 되어 spec §8.10이 정한 검증 대상 하나가 사라진다. 숫자만으로 이뤄진 입력에만
  구분자를 넣고 그 밖에는 입력 원문을 그대로 표시한다.
- `Number()`를 거치지 않고 정규식으로 세 자리씩 묶어 앞자리 0이 사라지지 않는다.

**1차 구현에서 caret 복원 버그가 나왔고 실측으로 잡았다.**
재포맷 여부와 무관하게 caret을 "앞에 있던 숫자 개수" 위치로 되돌린 탓에, 비숫자를 입력하면
caret이 숫자 뒤로 끌려가 다음 글자가 앞에 끼어들었다.

| 입력 시도 | 1차 구현 표시 | 수정 후 표시 |
| --- | --- | --- |
| `12만원` | `12원만` (문자 순서 뒤집힘) | `12만원` |
| 연회비 한도 `-5` | `5-` → `NOT_NUMERIC` 오류로 오분류 | `-5` → `NEGATIVE` 오류 정상 |

표시값이 입력 문자열과 같으면(=구분자를 넣지도 빼지도 않았으면) 브라우저 caret이 이미 맞으므로
건드리지 않도록 고쳤다.

### 실측 검증 (375×812 실브라우저)

| 확인 | 결과 |
| --- | --- |
| `1200` 타이핑 | 표시 `1,200`, 환산 `12,000,000원 · 1,200만 원` |
| `120000` 타이핑 | 표시 `120,000`, 환산 `1,200,000,000원 · 120,000만 원 · 12억 원` |
| `1,234,567` 3번째 자리에 `9` 삽입 | 표시 `12,934,567`, caret 4 — 보던 자리 유지 |
| ` 1,2 00 ` 붙여넣기 | 표시 `1,200` |
| `12만원` 타이핑 | 표시 유지 + `숫자만 입력해 주세요.` 오류 1건 |
| `0` 입력 | `0원보다 큰 금액을 입력해 주세요.` 오류 1건 |
| 연회비 한도 `-5` | 표시 유지 + `0원 이상 금액을 입력해 주세요.` 오류 1건 |
| 빠른 금액·실행 취소·금액 지우기 | `1,000` → `1,100` → `1,000` → 빈 값 |
| `1200` 제출 | 항목 1건 추가, 카드에 `1,200만 원 · 12,000,000원` |
| 375px 가로 스크롤 | `scrollWidth === clientWidth === 375` |

`NOTES`의 항목(인라인 `toLocaleString`, 미사용 `public/*.svg`, UI가 읽지 않는 ViewModel 필드,
README)은 이번 라운드에서 손대지 않았다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### 라운드 진행 중 발생한 외부 이벤트

- `NOTE:` Round 2 NOTE에 적은 `TASK/task1` 문서 번호 재정리가 다른 세션에서 **되돌려졌다**
  (`c8587af docs: reorganize CardFit repository artifacts` → `e3a71f9 Revert`). 현재 존재하는
  이름은 원래대로 `prototype-suggestion.md`·`prototype-suggestion-local-visual.md`·`prototype-visual-spec.md`다.
  재정리 때 새 이름으로 바뀌었던 `lib/prototype/view-model.ts`·`fixtures/prototype/scope-notice.ts`의
  주석은 revert 대상에 포함되지 않아 존재하지 않는 경로를 가리키고 있었다. 두 주석을 실제 경로로
  되돌려 저장소 안에 깨진 문서 참조가 남지 않게 했다. 목표 문서와 분리한 실행 프롬프트는 revert로
  함께 원래 경로로 돌아왔고 본문 동일성(`diff`)도 유지된다.

### aztks-agent EVALUATE 결과

*(디스패치 후 기록)*
