# CardFit 경량 시각 체크포인트 — 시각 검토 기록

목표 프롬프트: `docs/plans/cardfit-visual-prototype_run-20260827-1533.md`
(원본 `docs/plans/cardfit-visual-prototype.md`에서 프롬프트 본문만 분리한 실행본)

ROUND: 11
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
 M "docs/tasks/task1/08_GitHub_Project_\354\227\260\353\217\231_\353\205\270\355\212\270.md"
 M reports/benchmarks/cardfit-overseas-benchmark.html
```

**Round 6 재기록.** 위 기록은 착수 첫 턴(Round 1) 시점이다. 그 사이 다른 세션이 해당 파일들을
커밋하고 문서 재정리를 넣었다가 revert했다. `reports/benchmarks/cardfit-overseas-benchmark.html`은
revert로 사라진 경로이므로 낡은 기준선과 비교하면 종료 게이트가 틀린 판정을 낸다.

Round 6 시점 `git status --porcelain`은 **이 목표가 방금 고친 파일만** 출력한다. 즉 다른 세션이
남긴 dirty 파일이 없다.

```
 M components/prototype/evidence-disclosure.tsx
```

따라서 종료 방법 6)은 `git status --porcelain` 출력이 1)의 작업 대상과 `docs/reports/` 안에만
있는지로 판정한다.

**Round 7 추가.** 그 사이 다른 세션이 빈 디렉터리 `features/cardfit-prototype/{components,fixtures,lib,ui}/.gitkeep`를
만들었다. 이 목표가 만든 것이 아니고 작업 대상 밖이므로 손대지 않는다. 종료 판정에서
`?? features/`는 이 목표의 변경으로 세지 않는다.

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
- `CONFLICT:` spec §6.2 상태 사전은 `success`의 대표 제목을 `계산이 완료됐어요`, 기본 CTA를
  `결과 확인하기`로 정하고 §6.3은 "대표 제목·상태 의미·기본 CTA는 이 사전을 따른다"고 한다.
  `/result` Fixture는 `status: "success"`인데 화면 제목은 `조건별 결과를 확인해요`이고 마지막 CTA는
  `미래지출 다시 입력하기`다. 사전 문구를 그대로 쓰지 않은 이유는 세 가지다.
  - `결과 확인하기`는 **결과 화면으로 이동하는** CTA다. 이미 `/result`에 있는 사용자에게 붙이면
    자기 자신을 가리키는 링크가 되어 다음 행동을 알려주지 못한다.
  - `계산이 완료됐어요`는 **계산 진행 상태 화면이 완료를 알리는** 제목이다. 그 화면(`UI-004`
    계산 중·완료 상태)은 이번 범위 밖으로 미뤄져 있어 사전 문구가 놓일 자리가 아직 없다.
  - 이 구현은 상태 사전을 "상태를 알리는 블록"에 적용한다. `/plan`은 `status: "empty"`의 사전 문구
    (`아직 입력한 미래지출이 없어요` + `미래지출 입력하기`)를 목록 영역 상태 블록에 그대로 쓴다.
    `/result`는 상태가 `success`여서 알릴 상태 블록 자체가 없고 결과를 바로 표시한다.
  - `success` 사전 문구는 `UI-004` 계산 진행·완료 화면을 구현하는 후속 체크포인트에서 그 화면에
    적용한다. 이번 범위에서 사전 문구를 앞당겨 배치하지 않는다.
- `CONFLICT:` **Round 8 진행 중 다른 세션이 프로토타입 코드 전체를 `features/cardfit-prototype/`으로
  옮겼다.** 커밋되지 않은 워킹트리 변경이며 아래 상태다.
  - `components/prototype/*` → `features/cardfit-prototype/components/*`
  - `components/ui/*` → `features/cardfit-prototype/ui/*`
  - `lib/prototype/*`·`lib/utils.ts` → `features/cardfit-prototype/lib/*`
  - `fixtures/prototype/*` → `features/cardfit-prototype/fixtures/*`
  - `app/plan/page.tsx`·`app/result/page.tsx` import 경로 재작성, `components.json` alias 재작성
  - 이동 후에도 `npx tsc --noEmit`·`npm run lint`·`npm run build` 모두 exit 0이다(완전하고 일관된 이동).

  그런데 **근거 문서는 여전히 루트 배치를 지정한다.**
  - spec §2.2 디렉터리 배치: `app/` · `components/` · `lib/` · `fixtures/`
  - rules 006 「코드 거처와 실행」: "공통 UI는 `components/`, 타입·로더는 `lib/`, Fixture는 `fixtures/`에 둔다"
  - rules 006 「ViewModel 타입 규칙」: 단일 진입점은 `lib/prototype/view-model.ts`
  - 이 목표 §1 작업 대상: `app/`, `components/`, `lib/prototype/`, `fixtures/prototype/`
  - 이 목표 종료 방법 5): `ls fixtures/prototype lib/prototype` — 현재 두 경로가 존재하지 않아 실패한다.

  목표 문서 §2는 충돌 시 "`CONFLICT:`를 남긴 뒤 spec을 따른다"고 정했지만, spec을 따르려면 다른
  세션의 커밋되지 않은 이동을 되돌려야 한다. `features/`는 이 목표의 작업 대상이 아니고 다른 세션의
  작업을 지우는 행위이므로 임의로 실행하지 않았다. 이 목표의 마지막 커밋(`8474711`)에는 루트 배치
  코드가 그대로 남아 있어 유실된 산출물은 없다.

  **해소 — 사용자 결정(2026-08-27).** 사용자가 "루트 배치로 되돌리고 계속"을 선택했다. 조치는 아래다.
  - 다른 세션의 이동본 26개 파일을 scratchpad `backup-features-relocation/`에 복사해 복구 가능하게 둔 뒤
    `features/`를 제거하고, `git checkout`으로 `components/`·`lib/`·`fixtures/`·`app/plan/page.tsx`·
    `app/result/page.tsx`·`components.json`을 마지막 커밋 상태로 복원했다.
  - 복원 후 `ls fixtures/prototype lib/prototype`이 정상 출력되고 import 경로가 `@/components/...`로
    돌아왔음을 확인했다.

  **남은 위험 — 문서 쪽 마이그레이션이 진행 중이다.** 사용자에게 질문한 시점에는 spec §2.2·rules 006이
  루트 배치를 지정했지만, 그 뒤 확인한 결과 다른 세션이 커밋하지 않은 상태로 아래를 함께 `features/`
  배치로 고치고 있다.
  - `.agents/rules/006-prototype-visual-scope.md` — ViewModel 단일 진입점·Fixture 경로
  - `docs/tasks/task1/prototype-visual-spec.md` — §4.1 단일 진입점, §5.1 Fixture 경로·트리, Decision Log T4
  - `docs/plans/cardfit-visual-prototype.md`와 분리한 실행 프롬프트 — §1 작업 대상, 종료 방법 5)

  즉 이 목표의 코드는 사용자 결정에 따라 루트 배치이고, 문서 일부는 `features/` 배치를 향해 가는
  중이다. 이 목표는 사용자 결정을 기준으로 진행하고, 종료 방법 5)는 루트 경로(`ls fixtures/prototype
  lib/prototype`)와 목표 문서 현재 문구(`ls features/cardfit-prototype`) 양쪽을 실행해 차이를 그대로
  보고한다. 두 배치 중 무엇을 정본으로 삼을지는 이 목표의 결정 범위가 아니다.
  이 목표는 `docs/tasks/`·`.agents/` 문서를 수정하지 않는다.

  **재발 — 복원이 되돌려졌다.** 루트 배치 복원과 검증 3종(exit 0) 직후, 같은 세션이 이동을 다시
  적용했다. 현재 워킹트리는 또 `features/cardfit-prototype/` 배치이고 루트 `components/`·`lib/`·
  `fixtures/`는 삭제 상태다. 같은 세션이 이 검토 로그와 워크스루 안의 **과거 스코어카드 인용 경로까지
  일괄 치환**해 판정 원문과 달라졌던 것도 이번 라운드에 되돌렸다(감사 기록은 판정 원문과 같아야 한다).

  이 시점에서 루프를 멈춘다. 근거는 두 가지다.
  - 사용자 결정을 다시 적용해도 동시 편집 세션이 즉시 되돌리므로 라운드가 진전하지 않고, 반복 복원은
    상대 세션의 커밋되지 않은 작업을 반복 삭제하는 행위가 된다.
  - 이 목표의 종료 조건·작업 대상·종료 방법 5)가 모두 코드 배치에 묶여 있어, 배치가 확정되지 않으면
    `AZTKS_FULL_PASS` 판정 자체가 어느 트리를 대상으로 한 것인지 확정할 수 없다.

  유실은 없다. 이 목표의 산출물은 커밋 `8474711`(루트 배치 코드)과 `8e0b680`(기록)에 있고, 상대
  세션의 이동본 26개 파일은 scratchpad `backup-features-relocation/`에 사본이 있으며 워킹트리에도
  그대로 있다.

  **재개 판단 — 현재 트리에서 라운드를 이어간다.** 근거 문서가 지금 자기모순 상태여서 어느 한쪽을
  "정본"으로 확정할 수 없다.
  - rules 006 17행(「코드 거처와 실행」)은 루트 `components/`·`lib/`·`fixtures/`, 같은 파일 22·38행은
    `features/cardfit-prototype/`을 지정한다.
  - spec §2.2 디렉터리 배치는 루트, 같은 문서 §4.1·§5.1은 `features/cardfit-prototype/`을 지정한다.
  - 이 목표의 실행 프롬프트 §1 작업 대상은 `features/cardfit-prototype/`으로 바뀌었다(상대 세션 편집).

  배치 확정은 이 목표의 결정 범위가 아니고, 남은 작업(`feeCapError` 비차단 결함, 미참조
  `public/*.svg`)은 **파일이 어느 디렉터리에 있든 동일한 수정**이다. 따라서 배치 복원을 반복하지 않고
  현재 워킹트리(= `features/cardfit-prototype/` 배치, 실행 프롬프트 §1이 지정하는 위치)에서 라운드를
  계속한다. 배치가 나중에 확정되면 수정 내용이 그대로 따라간다.

  워크스루의 파일 경로 서술은 현재 트리 실제 위치로 맞췄다. 과거 스코어카드 인용문은 판정 원문이므로
  그대로 둔다.
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
- T: README 62-66행이 "현재 저장소에는 본문 서비스 라우트가 없으므로"라고 남아 있어 `/plan`·`/result` 추가와 모순. 실행 진입 URL은 `docs/reports/PROTOTYPE_WALKTHROUGH.md:23`에만 기록됨.
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
- `NOTE:` 같은 시각 다른 세션이 `docs/tasks/task1` 문서 이름을 번호 체계로 바꿨다.
  `prototype-suggestion.md` → `07_시각_프로토타입_전체_계획.md`,
  `prototype-suggestion-local-visual.md` → `09_시각_프로토타입_실행_요약.md`,
  `prototype-visual-spec.md` → `10_시각_프로토타입_화면_명세.md`,
  `docs/reports/cardfit-overseas-benchmark.html` → `reports/benchmarks/`.
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
- T: 완료 기준 1~9 충족(기준 8 금지어 grep 0건, 기준 9 `gh issue list --state closed` = `[]` + `docs/reports/PROTOTYPE_REVIEW_LOG.md` 체크포인트 기록).

NOTES
- T: spec §8.5 "입력값에 천 단위 구분을 표시한다" 미구현 — `amount-field.tsx`는 원문 그대로 표시하고 구분자는 환산 줄에만 있다.
- K: `evidence-disclosure.tsx:69` 인라인 `toLocaleString`이 `format.ts` 헬퍼 단일 경로 원칙을 우회. `amount-field.tsx:57-63` `undo()`가 setState 업데이터 안에서 `onValueChange` 호출(비순수). 3개 파일이 import 없이 `React.ReactNode` 참조.
- S: `README.md`에 앱·`npm run dev`·진입 URL(`/plan`) 언급이 0건 — 기준 1 근거가 `docs/reports/PROTOTYPE_WALKTHROUGH.md:23`에만 존재. 기준 7은 측정값이 아니라 클래스 구조 기반 분석 증거뿐(브라우저 미사용).
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
- PRD 근거 확인: `docs/product/PRD_CardFit_v1.3.md:208` US-C AC8 "온보딩 및 결과 화면" — Round 3 `/result` 고지 추가의 근거가 실재함
NOTES:
- T: 명세 §8.5 "입력값에 천 단위 구분을 표시한다"가 미구현입니다. `components/prototype/amount-field.tsx`의 `<Input value={value}>`는 `1200`을 그대로 보여주고 §8.2·§8.5 예시(`1,200`)와 어긋납니다(2라운드 이상 이월). 완료 기준 9항목 자체는 모두 충족합니다.
- K: `public/`의 `next.svg`·`vercel.svg` 등 스캐폴딩 SVG 5개가 어디서도 참조되지 않습니다. `BenefitLimitPeriod`/`limitPeriod`, `PlanInputViewModel.inputMode`, `meta.status`는 Fixture에 채우지만 UI가 읽지 않습니다(app·components 내 참조 0건).
- S: `README.md`에 프로토타입 실행 절차와 진입 URL이 없습니다. `/`가 404이므로 신규 검토자는 `docs/reports/PROTOTYPE_WALKTHROUGH.md`를 먼저 읽어야 `/plan`을 찾을 수 있습니다.
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
측정 결과는 `docs/reports/PROTOTYPE_WALKTHROUGH.md`의 「뷰포트 증거 — 실측」·「상호작용 실측」 절에 있다.

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
- T 근거: `docs/tasks/task1/10_시각_프로토타입_화면_명세.md:424` "입력값에 천 단위 구분을 표시한다" vs `components/prototype/amount-field.tsx:68-79`(원문 그대로 표시). 3라운드 이월.
- 완료 기준: 1·3·4·6·8은 실렌더 텍스트로, 5는 `evidence-disclosure.tsx`의 근거 6종 + Fixture로, 9는 이슈 조작·`Done` 기록 없음으로 확인. `fixtures/prototype/result.ts` 6개 조합 전부 월합×12=총혜택, 총혜택−연회비=순혜택, 차액 0/93,000/147,000 일치.
NOTES:
- K: `evidence-disclosure.tsx:88`이 `toLocaleString`을 인라인 호출해 `lib/prototype/format.ts` 상단의 "화면은 이 파일만 사용" 규칙과 어긋납니다(`formatMonthlyWon` 사용 가능).
- K: `public/*.svg` 5개 미참조, `limitPeriod`·`inputMode`·`meta.status`는 UI 참조 0건으로 view-model.ts의 "최소 필드만 둔다" 주석과 상충합니다.
- S: `README.md`에 실행 절차·진입 URL이 없고 `/`가 404여서 신규 검토자는 `docs/reports/PROTOTYPE_WALKTHROUGH.md`를 먼저 읽어야 합니다(이번 목표 범위 밖).
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

- `NOTE:` Round 2 NOTE에 적은 `docs/tasks/task1` 문서 번호 재정리가 다른 세션에서 **되돌려졌다**
  (`c8587af docs: reorganize CardFit repository artifacts` → `e3a71f9 Revert`). 현재 존재하는
  이름은 원래대로 `prototype-suggestion.md`·`prototype-suggestion-local-visual.md`·`prototype-visual-spec.md`다.
  재정리 때 새 이름으로 바뀌었던 `lib/prototype/view-model.ts`·`fixtures/prototype/scope-notice.ts`의
  주석은 revert 대상에 포함되지 않아 존재하지 않는 경로를 가리키고 있었다. 두 주석을 실제 경로로
  되돌려 저장소 안에 깨진 문서 참조가 남지 않게 했다. 목표 문서와 분리한 실행 프롬프트는 revert로
  함께 원래 경로로 돌아왔고 본문 동일성(`diff`)도 유지된다.

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:P Z:P T:P K:C S:C

TOP_FIX: `components/prototype/evidence-disclosure.tsx:69`의 인라인 `월 ${area.limitAdjustmentMonthlyWon.toLocaleString("ko-KR")}원`을 `formatMonthlyWon(area.limitAdjustmentMonthlyWon)`으로 교체하라. 두 식의 출력이 `월 -2,500원`으로 완전히 동일해 화면 변화 0이며, `lib/prototype/format.ts:2`가 스스로 선언한 "화면은 이 파일만 사용" 규칙 위반을 없앤다. 검증: `grep -rn toLocaleString components/` 결과가 0건, 그 뒤 `npx tsc --noEmit` + `npm run build` exit 0.

EVIDENCE:
- Z 게이트 3종 실측: `npx tsc --noEmit` exit 0 / `npm run lint` exit 0 / `npm run build` exit 0 (`/plan`·`/result` 정적 prerender).
- Fixture 산술 자체 검증: 6개 조합 전부 `benefitAreas` 합 × 12 = `totalBenefitAnnualWon`, `net = total − fee`, 차액 3건(0 / +93,000 / +147,000) 일치.
- 빌드 산출 HTML 직접 grep: `대신 진행하지 않습니다` 두 화면 각 1건, 근거 6종·`prototype-2026.08-r1`·`생활 할인은 월 최대 1만 원` 존재, `role="tab"`×3 / `aria-selected="true"`×1 / `aria-expanded="false"`×1, 금지어 0건.
- 기준 9: `git diff --stat HEAD -- docs/tasks/`가 빈 출력, `Done` 승격 0건. 앞당김 없음은 라우트 3개와 `review=1`·RANGE·AI·Route Handler·Prisma 미존재로 확인.

NOTES:
- K: 미조회 ViewModel 필드 3건 — `cardLabels`, `limitPeriod`, `CardCombinationViewModel.id`. `meta.status`·`isExample`·`inputMode` 미조회는 spec §4.3이 존재를 강제하므로 죽은 코드로 보지 않는다. 별도로 create-next-app 잔여 `public/*.svg` 5개가 미참조.
- S: `PROTOTYPE_REVIEW_LOG.md`의 BASELINE_DIRTY가 revert 후 존재하지 않는 경로를 기록해 종료 게이트가 낡은 기준선과 비교한다. 다음 라운드 첫 턴에 재기록 필요.
- T(비차단): `/`는 404이고 진입은 `/plan`이다. spec §3.2·rules 006이 `/` 생성을 금지하므로 위반이 아니다. `README.md` 실행 절차 부재는 부트스트랩 규칙상 수정 불가로 잔여 위험으로만 남긴다.
```

**판정 해석**: `T`가 `C`에서 `P`로 올라왔다(천 단위 구분 구현 효과). 남은 것은 `K`·`S` 두 축이다.
`NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 6

### 처리한 TOP_FIX

`evidence-disclosure.tsx`의 인라인 `toLocaleString`을 `formatMonthlyWon`으로 교체했다.
`lib/prototype/format.ts` 상단이 "화면은 이 파일만 사용하고 컴포넌트에서 금액을 다시 계산하지
않는다"고 선언했는데 이 한 곳만 그 규칙을 우회하고 있었다.

검증 결과다.

```
grep -rn toLocaleString app components   → 0건 (format.ts 단일 경로 유지)
```

브라우저에서 근거 disclosure를 펼쳐 표시값이 교체 전과 같은지 확인했다.

| 탭 | 확인한 행 | 결과 |
| --- | --- | --- |
| 예상한 만큼 | `월 12,500원` / `월 -2,500원` / `월 10,000원` | 각 1건 |
| 예상한 만큼 | `적용된 차감 없음` / `이 영역에는 적용 한도가 없습니다.` | 2건 / 1건 |
| 더 많이 | `월 15,000원` / `월 -5,000원` / `월 10,000원` | 각 1건 |
| 더 적게 | `적용된 차감 없음` (한도 미도달) | 1건 |
| 375px | `scrollWidth === clientWidth === 375` | 가로 스크롤 없음 |

### 함께 처리한 기록 정정

스코어카드 `S` 축이 지적한 대로 `BASELINE_DIRTY`를 재기록했다. 코드 개선이 아니라 목표 문서 §2가
요구하는 기준선 부기이고, 종료 방법 6)의 판정이 존재하지 않는 경로와 비교하지 않게 하려면 필요하다.
Round 1 기록은 이력으로 남기고 Round 6 기준선을 함께 적었다.

`NOTES`의 나머지(미조회 ViewModel 필드 3건, 미참조 `public/*.svg` 5개, `README.md`)는 이번 라운드에서
손대지 않았다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:P Z:P T:C K:C S:P

TOP_FIX: `lib/prototype/view-model.ts`의 미조회 필드 4개(`CardCombinationViewModel.id`·`cardLabels`, `BenefitAreaViewModel.limitPeriod`+`BenefitLimitPeriod`, `PlanInputViewModel.inputMode`)를 화면에서 읽게 하거나 타입·Fixture에서 함께 삭제한 뒤 tsc·lint·build 재통과를 확인하라.

EVIDENCE:
- `lib/prototype/view-model.ts:97,115,131,136,137` — 위 4개 필드가 `app`·`components` 어디에서도 참조 0건(grep). spec §4.1 "화면이 읽고 판단하는 최소 필드만 둔다"와 어긋남 → T·K CONCERN.
- 게이트 실측: `npx tsc --noEmit`=0, `npm run lint`=0, `npm run build`=0. `git archive HEAD`로 만든 `.next` 없는 순수 체크아웃에서도 tsc=0 → `app/layout.tsx` 주석 주장 검증됨.
- `next start` 직접 실측: `/plan` 200, `/result` 200, `/result?state=partial|zzz` 200(대표 Fixture 되돌림), root 404, 스코프 고지 각 화면 1건, 금지어 0건. Fixture 6개 조합 산술 일치(GR2 임계 미달 변경 유도 없음).

NOTES:
- 완료 기준 9항목은 코드·워크스루 실측·서버 실측으로 전부 충족 확인. T:C는 기준 누락이 아니라 spec §4.1 이탈만 가리킨다.
- K: `public/` 스캐폴드 svg 5개 미참조.
- 위생: 커밋된 `next-env.d.ts`가 `.next/dev/types`를 가리켜 `next build` 실행만으로 tracked 파일이 dirty가 된다.
```

**판정 해석**: `S`가 `C`에서 `P`로 올라왔다(기준선 재기록 효과). `T`는 완료 기준 누락이 아니라
spec §4.1 이탈만 가리킨다고 평가자가 명시했다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 7

### 처리한 TOP_FIX

미조회 ViewModel 필드 4개를 타입·Fixture에서 함께 삭제했다. "화면에서 읽게 한다" 쪽은
읽을 이유가 없는 분기를 만드는 것이라 골라내지 않았다.

| 삭제한 것 | 삭제 근거 |
| --- | --- |
| `CardCombinationViewModel.id` | 조합은 목록으로 렌더되지 않아 key·id 용도가 없다 |
| `CardCombinationViewModel.cardLabels` | `label`이 `예시 카드 A + 예시 카드 B`를 이미 담아 중복이다 |
| `BenefitAreaViewModel.limitPeriod` · `BenefitLimitPeriod` | 한도 기간은 `limitLabel` 문장(`생활 할인 월 최대 1만 원`)에 이미 들어 있다 |
| `PlanInputViewModel.inputMode` | 이번 체크포인트는 `SINGLE`만 구현해 화면이 모드를 분기할 일이 없다 |

- `CONFLICT:` spec §4.2 타입 스케치에는 `inputMode`가 있다. 같은 §4.1이 "화면이 읽고 판단하는 최소
  필드만 둔다"고 정했고 §4.2 스스로 "필드명을 영구 확정하는 API 계약이 아니라 구조의 기준"이라고
  밝히므로, 이번 범위에서는 §4.1을 따라 제거하고 `RANGE`를 도입하는 후속 체크포인트에서 §4.2
  스케치대로 다시 추가한다는 주석을 타입 파일에 남겼다.
- `FutureSpendItemViewModel.id`와 `FutureSpendCategoryViewModel.id`는 목록 key·수정·삭제에서 실제로
  읽으므로 유지했다.

삭제 후 화면 표시가 그대로인지 실측했다.

| 확인 | 결과 |
| --- | --- |
| 근거 disclosure 한도 행 (예상한 만큼) | `월 12,500원` / `월 -2,500원` / `월 10,000원` 각 1건 |
| 근거 disclosure 한도 행 (더 많이) | `월 15,000원` / `월 -5,000원` / `월 10,000원` 각 1건 |
| 한도 없는 영역 | `이 영역에는 적용 한도가 없습니다.` 1건 |
| 탭별 결론·금액 | 유지/연 48,000원/연 0원 · 변경/연 153,000원/연 +93,000원 · 변경/연 231,000원/연 +147,000원 |
| 8개 상태 375px | 전부 `scrollWidth === clientWidth === 375` |
| 금지 표현 | 두 화면 0건 |

### 함께 처리한 종료 게이트 정합성

스코어카드 「위생」 지적대로 `next build`가 tracked 파일 `next-env.d.ts`를 매번 다시 써서
빌드만 해도 워킹트리가 dirty가 됐다. 종료 방법 6)이 `git status --porcelain`으로 판정하므로
그대로 두면 최종 판정이 이 목표의 변경으로 오인한다.

- `git rm --cached next-env.d.ts` + 루트 `.gitignore`에 `next-env.d.ts` 줄 추가(줄 추가만 허용 규칙 준수).
  Next.js 기본 템플릿도 이 파일을 추적하지 않는다.
- 파일이 없어도 `npx tsc --noEmit`이 exit 0임을 먼저 확인한 뒤 untrack했다(갓 clone한 저장소에서
  build 전에 타입 검사가 통과해야 하기 때문).
- 조치 후 `npm run build` 실행에도 tracked 파일이 dirty가 되지 않음을 확인했다.

`public/*.svg` 5개 미참조는 이번 라운드에서 손대지 않았다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:P Z:P T:C K:C S:P

TOP_FIX: `/result`가 `status: "success"`를 렌더하면서 spec §6.2 대표 제목 `계산이 완료됐어요`·기본 CTA `결과 확인하기`를 쓰지 않는 이유를 `docs/reports/PROTOTYPE_REVIEW_LOG.md`에 `CONFLICT:`로 기록하라(`inputMode` 선례와 동일 형식). 기록 대신 카피를 사전에 맞추는 선택도 가능하다.

EVIDENCE:
- 게이트 실측(직접 실행): `npx tsc --noEmit` exit 0 · `npm run lint` exit 0 · `npm run build` exit 0.
- 브라우저 실측(375×812, Edge): 9개 기준 전부 재현 — `/plan` 미입력 차단 → `예시 금액 적용하기` 2건 → 주소 이동 없는 2단계(`url=/plan`) → `/result` 탭별 `유지/연 48,000원/연 0원`·`변경/연 153,000원/+93,000원`·`변경/연 231,000원/+147,000원`, `aria-selected` 1개만 true, `계산 근거 보기` 키보드 Enter로 `aria-expanded=false→true`, 근거 6종 전문, 접힌 상태 할부 고지, 4개 상태 전부 `scrollWidth==clientWidth==375`, 금지어 8종 0건, `root=404`.
- 산술 자체정합: 영역합×12 = 총 예상 혜택, 총−연회비 = 순혜택, 차액 일치(6개 조합 전부).

NOTES:
- T: spec §6.2~§6.3·rules 006은 상태 사전의 대표 제목·기본 CTA 준수를 요구하는데 `/result`(status `success`)는 `조건별 결과를 확인해요`/`미래지출 다시 입력하기`를 쓴다. 이 편차가 로그·워크스루 어디에도 없다.
- T/Z: `plan-flow.tsx`의 `feeCapError`가 표시만 되고 `결과 확인하기` Link를 막지 않는다(실측: 연회비 한도 `-5` 오류 표시 상태에서 링크 enabled, `/result`로 이동). 1단계는 차단하는데 2단계만 비차단이다.
- K: `public/` svg 5개가 tracked인데 참조 0건.
```

**판정 해석**: `S`가 `P`를 유지하고 `T`·`K`가 `C`로 남았다. 평가자가 `T:C`는 완료 기준 누락이 아니라
spec §6.2 편차 미기록만 가리킨다고 명시했다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 8

### 처리한 TOP_FIX

`/result`가 `status: "success"`에서 spec §6.2 상태 사전 문구를 쓰지 않는 이유를 위 「CONFLICT /
ASSUMPTION」 절에 `CONFLICT:`로 기록했다. 카피를 사전에 맞추는 대안은 고르지 않았다 —
`결과 확인하기`는 결과 화면으로 이동하는 CTA라 `/result`에서는 자기 자신을 가리키는 링크가 되고,
`계산이 완료됐어요`는 이번 범위 밖인 계산 진행 화면(`UI-004`)의 제목이기 때문이다.

### 라운드 진행 중 발생한 구조 충돌과 사용자 결정

다른 세션이 프로토타입 코드 전체를 `features/cardfit-prototype/`으로 옮기고 근거 문서 일부를 함께
고치는 마이그레이션을 진행했다. 상세와 사용자 결정(루트 배치 복원)은 위 「CONFLICT / ASSUMPTION」
절에 기록했다. 복원 후 검증 3종을 다시 실행해 모두 exit 0을 확인했다.

`NOTES`의 나머지(`feeCapError` 비차단, 미참조 `public/*.svg` 5개)는 이번 라운드에서 손대지 않았다.
`feeCapError`가 2단계 CTA를 막지 않는 것은 실제 결함이므로 다음 `TOP_FIX`로 올라오면 처리한다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:P Z:P T:C K:C S:P

TOP_FIX: `plan-flow.tsx`의 2단계 `결과 확인하기`를 `feeCapError !== null`일 때 차단하십시오(1단계 `goToConstraints`처럼 Alert + focus 이동). 검증: 연회비 한도에 `-5` 입력 후 CTA를 눌러도 `/result`로 이동하지 않고 오류가 유지되는지 확인.

EVIDENCE:
- `validateFeeCap`은 오류 문구만 세팅하고 `<Link href="/result">`에는 어떤 가드도 없다. 같은 파일의 1단계는 동일 성격의 이동을 차단하므로 두 단계의 오류 처리가 모순이다.
- 게이트 3종 현재 트리 실측: `npx tsc --noEmit` exit 0 / `npm run lint` exit 0 / `npm run build` exit 0.
- 완료 기준 1~9 전부 근거 확인. 기준 4 금액 산술 정합(BASE 13,500×12=162,000, −9,000=153,000, Δ93,000; LOW Δ0→KEEP; HIGH 240,000−9,000=231,000). PRD GR2/US-A AC7 임계(50,000원) 위반 조합 없음.

NOTES:
- K: `public/{next,vercel,file,globe,window}.svg` 5개가 tracked·미참조. `next.svg`·`vercel.svg`는 서드파티 로고 자산이라 화면 렌더는 0건이어도 기준 8·rules 006 「로고 금지」의 문자적 경계에 닿는다. 삭제가 가장 저렴한 정리다.
- T: 기준 1은 충족되나 `/`가 404이고 앱 내 진입 안내가 없어 진입 URL 지식이 워크스루 밖에는 없다(README는 수정 범위 밖).
- A/S 확인: 스코프 고지가 두 화면에서 `scope-notice.ts` 한 곳을 읽으며, 미룬 항목을 앞당긴 구현이 없다. 페이지가 Fixture import 한 줄만 Query로 바뀌는 구조라 화면 재작성 없이 교체 가능하다.
```

**판정 해석**: `A`·`Z`·`S`가 `P`를 유지하고 `T`·`K`가 `C`로 남았다. TOP_FIX는 Round 7 `NOTES`에서
예고된 실제 결함이 승격한 것이다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 9

### 처리한 TOP_FIX

2단계 `결과 확인하기`가 카드 조건 오류를 무시하고 이동하던 결함을 고쳤다. 1단계는 미입력 시
이동을 막는데 2단계만 비차단이어서 같은 화면 안에서 오류 처리가 갈리고 있었다.

- `guardResultNavigation`을 추가해 `feeCapError !== null`이면 `preventDefault`로 이동을 막고,
  2단계에도 차단 사유 Alert(`결과를 확인할 수 없어요`)을 띄우고 연회비 한도 필드로 focus를 옮긴다.
- `aria-disabled`를 함께 걸어 보조기기에도 상태를 전달한다. `aria-disabled`는 권고 속성이라 실제
  차단은 `preventDefault`가 담당한다.
- 값을 고쳐 오류가 사라지면 `validateFeeCap`이 차단 문구를 지우고 이동이 다시 열린다.
- `미래지출 다시 입력하기`로 1단계로 돌아갈 때 단계 오류 문구가 새지 않게 함께 초기화한다.
- `/result` 직접 접근은 spec §3.2대로 계속 열어 둔다. 가드는 흐름 CTA에만 걸고 라우트를 잠그지 않는다.

### 실측 검증 (375×812 실브라우저)

| 단계 | 결과 |
| --- | --- |
| 정상 상태(`10`) | `aria-disabled=false` |
| `-5` 입력 | `입력 오류: 0원 이상 금액을 입력해 주세요.` 1건, `aria-disabled=true` |
| 오류 상태에서 CTA 강제 클릭 | `url=/plan` 유지 — 이동하지 않음. `결과를 확인할 수 없어요` 1건, 차단 본문 1건, focus `annual-fee-cap` |
| 차단 중 입력 보존 | 오류 문구 1건 유지, 입력값 `-5` 유지 |
| 차단 중 375px | `scrollWidth === clientWidth === 375` |
| `12`로 수정 | 차단 문구 0건, `aria-disabled=false` |
| 수정 후 CTA 클릭 | `/result` 이동, 결과 제목 1건 |
| `/result` 직접 접근 | 결과 제목 1건 — spec §3.2 유지 |

`NOTES`의 `public/*.svg` 5개는 이번 라운드에서 손대지 않았다. 평가자가 `next.svg`·`vercel.svg`를
서드파티 로고 자산으로 지적해 완료 기준 8과 닿는다고 판단한 만큼, 다음 `TOP_FIX`로 올라오면 처리한다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:P Z:P T:C K:C S:P

TOP_FIX: `public/{next,vercel,file,globe,window}.svg` 5개를 삭제하십시오(`git rm`). 검증: `git ls-files public` 빈 출력 · `grep -rn "\.svg" app features` 0건 · `npm run build` exit 0.

EVIDENCE:
- 게이트 3종 현재 트리 실측: `npx tsc --noEmit` exit 0 / `npm run lint` exit 0 / `npm run build` exit 0 (라우트 3개=`/_not-found`·`/plan`·`/result`).
- 완료 기준 1~9 전부 근거 확인. 기준 3~6은 `.next/server/app/result.html` 실렌더 텍스트와 근거 6종으로 확인. 산술 정합: LOW 48,000=48,000→KEEP Δ0 / BASE 13,500×12−9,000=153,000 Δ93,000 / HIGH 20,000×12−9,000=231,000 Δ147,000.
- 기준 9: `gh issue list --state closed` 빈 출력, `git diff HEAD~3 -- docs/tasks/`는 경로 문자열 교체뿐 `Done` 승격 0건.
- Round 9 TOP_FIX 반영 확인: `guardResultNavigation`이 `feeCapError !== null`에서 `preventDefault`+Alert+`feeCapRef.focus()`로 차단.

NOTES:
- T/K: `git ls-files public`의 svg 5개가 tracked·미참조. `next.svg`·`vercel.svg`는 배포 시 공개 경로로 서빙되는 서드파티 로고 자산이라 기준 8·rules 006 「로고 금지」의 문자적 경계에 닿는다.
- T: 2단계 고지가 `카드 조건의 기본값은 … 계산에 반영하지 않습니다`로 한정돼, 입력한 미래지출도 결과에 반영되지 않는다는 사실은 결과 화면의 예시 고지에만 의존한다.
- T: 기준 1은 충족되나 `/`가 404(spec §3.2·rules 006 준수)이고 진입 URL 안내가 워크스루 밖에 없다(README는 범위 밖).
```

**판정 해석**: `A`·`Z`·`S`가 `P`를 유지하고 `T`·`K`가 `C`로 남았다. 두 축의 `C` 근거가 같은 항목
(미참조 서드파티 로고 자산)으로 수렴했다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 10

### 배치 충돌 해소

다른 세션이 마이그레이션을 커밋했다(`e705b80 refactor: consolidate visual prototype code`).
워킹트리가 깨끗해졌고 `features/cardfit-prototype/` 배치가 커밋된 정본이 됐다. Round 8 `CONFLICT:`에
적었던 "어느 트리를 판정한 것인지 확정할 수 없다"는 꼬리가 사라졌다. 이후 라운드와 종료 판정은
이 커밋된 배치를 대상으로 한다.

### 처리한 TOP_FIX

`create-next-app` 잔재인 `public/` svg 5개를 `git rm`으로 삭제했다.

평가자가 제시한 검증을 그대로 실행했다.

```
git ls-files public          → 빈 출력
grep -rn "\.svg" app features → 0건
npm run build                → exit 0 (라우트 3개 정적 prerender)
```

- `next.svg`·`vercel.svg`는 화면에 렌더되지 않아도 배포 시 공개 경로로 서빙되는 **서드파티 로고
  자산**이다. 완료 기준 8과 rules 006 「로고 금지」의 문자적 경계에 닿으므로 삭제가 맞는 정리다.
- `public/`이 비어 git에서 사라졌다. `app/favicon.ico`는 App Router 규약으로 쓰이므로 영향이 없고,
  Next.js는 `public/` 없이도 빌드된다.
- 삭제 후 흐름 실측을 다시 돌려 Round 9 가드와 전체 완주 경로가 그대로임을 확인했다
  (오류 상태 차단 `url=/plan` 유지, 수정 후 `/result` 이동, `/result` 직접 접근, 375px 무스크롤).

`NOTES`의 나머지 둘은 이번 라운드에서 손대지 않았다.
- 2단계 고지가 "카드 조건 기본값"에 한정돼 미래지출 미반영 사실이 결과 화면 고지에만 의존한다는 지적.
- `/`가 404여서 진입 URL 안내가 워크스루 밖에 없다는 지적(README는 이 목표의 수정 범위 밖).

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### 라운드 진행 중 발생한 외부 이벤트

- `NOTE:` Round 10 EVALUATE 1차 디스패치가 판정 전에 세션 사용 한도(HTTP 429)로 중단됐다.
  Round 2와 같은 사유이고 판정이 아니라 실행 실패이므로 `ROUND`·`NOGO_STREAK`을 올리지 않고
  같은 라운드를 재디스패치했다.
- `NOTE:` 그 사이 다른 세션이 저장소 문서 구조를 전면 재구성해 커밋했다
  (`fbea58d docs: consolidate repository documentation`, `7872d3a docs: fix consolidated prototype paths`).
  - `PRD/` → `docs/product/`, `SRS-Drafts/` → `docs/technical/`, `TASK/` → `docs/tasks/`,
    `reports/` → `docs/reports/`, `docs/goals/` → `docs/plans/`, `docs/loop/` → `docs/reports/`
  - 이 목표의 산출물 두 개(이 검토 로그, 분리한 실행 프롬프트)가 워킹트리에서 **삭제 상태**였다.
    HEAD에는 남아 있어 두 파일만 `git checkout`으로 복원했다. 다른 세션이 삭제 중인 나머지 파일
    (PRD·SRS 구버전 등)은 이 목표의 대상이 아니라 손대지 않았다.
  - 분리한 실행 프롬프트가 원본과 개행문자만 달라져 있어(내용은 동일) 원본 본문에서 다시 생성해
    정확히 일치시켰다. 141줄, `diff` 무차이.
  - 재구성 후 검증 3종을 다시 실행해 모두 exit 0을 확인했다. 앱 코드는 `app/`·`features/`에 있어
    문서 이동의 영향을 받지 않는다.
  - 이후 라운드의 근거 문서 경로는 `docs/tasks/task1/prototype-visual-spec.md`,
    `docs/tasks/task1/prototype-suggestion-local-visual.md`, `docs/product/PRD_CardFit_v1.3.md`,
    `docs/reports/PROTOTYPE_WALKTHROUGH.md`를 사용한다.

### aztks-agent EVALUATE 결과

```
VERDICT: GO
SCORECARD: A:C Z:P T:P K:P S:C

TOP_FIX: fixtures/result.ts 의 excludedItems 에 "1단계에서 입력한 미래지출(이 프로토타입 결과는 고정 예시 값입니다)" 한 줄을 추가하고, plan-flow.tsx 2단계 고지를 카드 조건 + 미래지출 양쪽 미반영으로 확장하라. 검증: npx tsc --noEmit exit 0 + /result 렌더 텍스트에 해당 문구 1건.

EVIDENCE:
- 검증 3종 실측: npx tsc --noEmit exit 0 / npm run lint exit 0 / npm run build exit 0. git ls-files public 빈 출력, grep .svg app features 0건.
- 완료 기준 3~6·8 렌더 실증: .next/server/app/result.html 추출 텍스트에 세 탭 라벨, 예상 순혜택, 총 예상 혜택, 연회비, "생활 할인은 월 최대 1만 원까지 적용됩니다", 할부 미반영 고지, "계산 근거 보기", "카드 신청·발급·해지를 대신 진행하지 않습니다" 모두 존재. 근거 6종 순서가 spec §10.2와 일치. Fixture 산술 정합(BASE 13,500×12=162,000 − 9,000 = 153,000, delta 93,000).
- 완료 기준 9: gh issue list --state closed 출력 없음(Done 0건), 체크포인트는 검토 로그·워크스루에만 기록. 워킹트리 clean.

NOTES:
- A: 결과가 사용자 입력을 반영하지 않는다는 사실이 FixtureExampleNotice 의 일반 문구에만 의존한다(excludedItems 에 카드 조건 예시값만 명시).
- S: / 가 404(spec §3.2 준수)여서 진입 URL http://localhost:3000/plan 안내가 워크스루 밖에 없다. README는 범위 밖.
- K: plan-flow.tsx 534줄·useState 18개가 두 단계 상태를 한 클라이언트 컴포넌트에 모은다. 죽은 코드·인라인 ViewModel 타입은 없다.
```

**판정 해석**: `T`와 `K`가 처음으로 함께 `P`가 됐다(천 단위 구분·최소 필드·§6.2 기록·2단계 차단·svg
정리 누적 효과). 대신 `A`가 `P`에서 `C`로 내려갔다 — 같은 사안(입력 미반영 고지)이 Round 9·10에서는
`NOTES`였다가 A축 `C` 근거로 승격했다. `NOGO_STREAK`은 `GO`이므로 0을 유지한다.

## Round 11

### 처리한 TOP_FIX

프로토타입이 사용자 입력을 계산에 쓰지 않는다는 사실을 두 지점에서 명시했다. 기존에는 결과 화면의
일반 예시 고지에만 의존해, 사용자가 방금 입력한 미래지출이 결과에 반영된 것으로 오해할 수 있었다.

- `fixtures/result.ts` `excludedItems`에 `1단계에서 입력한 미래지출(이 프로토타입 결과는 고정 예시
  값입니다)`를 추가했다. 근거 5번 「이 계산에 포함되지 않은 항목」에서 확인된다.
- `plan-flow.tsx` 2단계 고지를 확장했다. 이전에는 카드 조건 기본값만 언급했고, 지금은
  `이 프로토타입은 입력값으로 계산하지 않습니다. 1단계에서 입력한 미래지출과 이 단계의 카드 조건은
  모두 화면 확인용이며 결과에 반영하지 않고, 결과 화면은 고정된 예시 값을 보여줍니다.`로 양쪽을 덮는다.

### 실측 검증 (375×812 실브라우저)

| 확인 | 결과 |
| --- | --- |
| `/plan` 2단계 고지 | `입력값으로 계산하지 않습니다` 1건 · 양쪽 미반영 문구 1건 · `고정된 예시 값` 1건 |
| `/result` 근거 5번 | `1단계에서 입력한 미래지출(이 프로토타입 결과는 고정 예시 값입니다)` 1건 |
| 제외 항목 목록 | 7개 (할부 수수료 / 월별 실적 반영 차이 / 카드사별 무이자 할부 조건 / 포인트 소멸과 자동납부 승계 비용 / **미래지출** / 카드 조건 예시 초기값 / 다중 후보 순위) |
| 375px | 2단계·근거 펼침 모두 `scrollWidth === clientWidth === 375` |
| 금지 표현 | 두 화면 0건 |

### 라운드 진행 중 발생한 외부 이벤트 — 산출물 삭제

- `NOTE:` 다른 세션이 `53c4e49 docs: remove completed prototype logs`로 이 목표의 산출물 두 개를
  **커밋으로 삭제**했다.
  - `docs/plans/cardfit-visual-prototype_run-20260827-1533.md` (141줄) — 사용자가 명시적으로 요청한
    "프롬프트 본문 분리 + 실행 시각 파일명" 산출물
  - `docs/reports/PROTOTYPE_REVIEW_LOG.md` (782줄) — 이 목표의 감사 기록. 종료 방법 1)·4)가 이 파일에
    `STOP REASON:`을 적고 `cat`으로 출력하라고 지정한 대상이다.

  이 목표가 아직 진행 중이므로 "completed"가 아니다. `92b2a0c`에서 두 파일을 복원했고 분리본은
  원본 본문과 내용 동일성을 다시 확인했다. 반복 삭제에 대비해 사용자 요청 산출물(불합격 해설)은
  저장소 밖에도 별도로 남긴다.

### 남은 지적

- `S`: `/`가 404여서 진입 URL 안내가 앱 안에 없다. `README.md`는 부트스트랩 규칙상 수정 금지다.
  다음 라운드에 이 항목이 `TOP_FIX`로 오면 `app/not-found.tsx`(404 처리기이며 `page.tsx`가 아니므로
  종료 방법 5)의 "`page.tsx` 두 개" 기대값을 깨지 않고 spec §3.2의 `/` 라우트 금지도 위반하지 않음)로
  진입 안내를 제공하는 방안을 적용한다.
- `K`(비차단 NOTE): `plan-flow.tsx` 534줄·`useState` 18개. 평가자가 죽은 코드·인라인 타입은 없다고
  확인하고 `K:P`를 줬으므로 이번 범위에서 분해하지 않는다.

### 검증

| 명령 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (`/plan`·`/result` 정적 prerender) |

### aztks-agent EVALUATE 결과

*(디스패치 후 기록)*
