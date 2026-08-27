/goal

## 1) 작업 핵심 목표 및 범위

- **목표**: CardFit 최초 경량 시각 체크포인트(`P-VIS-01~03`)를 `/plan`·`/result` 두 라우트의 Next.js 앱으로 구현하고, `aztks-agent` EVALUATE 판정에서 `VERDICT: GO`와 `SCORECARD: A:P Z:P T:P K:P S:P`(5축 전부 PASS)를 **동시에** 받는다.
- **시작 지점**: `master` 브랜치 HEAD. 저장소 루트에 앱 스캐폴딩이 없다(`package.json` 없음).
- **문서 지위 (착수 전에 이 관계를 먼저 확인한다)**:
  - 계획 정본은 `TASK/task1/prototype-suggestion.md`의 **19건**이고, 최초 실행 단위는 그 문서의 **`P-VIS-01~03` 경량 체크포인트**다.
  - `TASK/task1/prototype-suggestion-local-visual.md`는 상단에 **"상태: 축약 실행 참고본(2026-08-27)"** 표기가 있고 "11건을 독립 정본으로 취급하지 않는다"고 스스로 밝힌 문서다. **이 목표는 그 문서의 「프로토타입 완료 기준」 9항목만 판정 기준으로 사용한다.**
  - 구현 방식은 전부 `TASK/task1/prototype-visual-spec.md`를 따른다. 다른 문서와 충돌하면 이 문서가 우선이다.
- **착수 전 읽을 문서**:
  1. `TASK/task1/prototype-visual-spec.md` — §3 라우팅, §4 ViewModel, §5 Fixture, §6 상태 언어, §7 스코프 고지, §8 입력 정책, §9 결과 시나리오, §10 결과 요약·근거 패널
  2. `.agents/rules/006-prototype-visual-scope.md`, `AGENTS.md` — 착수 가능 범위와 금지 사항
  3. `TASK/task1/prototype-suggestion-local-visual.md` — 「프로토타입 완료 기준」 9항목과 「아직 확정하지 않은 사항」
  4. `PRD/PRD_CardFit_v1.3.md` 1~4장 — 목표 G1~G6, 고객 여정, 차별 가치, US-A/B/D/F의 AC, Guardrail GR1~GR5
- **작업 대상**: 저장소 루트의 Next.js App Router 앱 — `app/`, `components/`, `lib/prototype/`, `fixtures/prototype/`, 부트스트랩이 생성하는 루트 설정 파일(`package.json`, `tsconfig.json`, `next.config.ts`, `components.json`, `eslint.config.mjs`, `postcss.config.mjs`).
- **구현 범위 — 라우트 2개** (`prototype-visual-spec.md` §3.1 확정안):

  | 라우트 | 사용자 목적 | 포함 화면·상태 |
  | --- | --- | --- |
  | `/plan` | 미래지출과 카드 제약 입력 | 미래지출 입력, 카드 조건 단계, 입력 오류 |
  | `/result` | 조건별 결과 비교와 핵심 근거 확인 | 세 시나리오 결과, 유지·변경 결론, 예상 순혜택, 정형 근거, 기준일·미반영 항목 |

- **이번 범위에서 구현하지 않는 것** (후속 체크포인트로 미룬 항목 — spec §3.2, `rules/006`): `/`·`/onboarding` 라우트, 플랫폼 연동 상태 화면, 계산 진행·데이터 품질 상태 전체, 조합 선택과 외부 이동, `review=1` 검토자 상태 패널, RANGE 입력, AI 설명.
- **작업 자율성**: 사용자 승인 요청으로 중단하지 않고 종료 조건까지 자율 진행한다. `npm install`, 파일 생성·수정, 로컬 빌드·타입체크·린트 실행, 로컬 커밋은 승인 없이 수행한다.

## 2) 작업 세부 규칙

- **구현 규약**: `TASK/task1/prototype-visual-spec.md`와 `.agents/rules/006-prototype-visual-scope.md`를 읽고 그대로 적용한다. 두 문서가 이미 확정한 사항은 **재결정하지 않고 그대로 구현한다.** 재해석이 필요해 보이면 구현을 멈추고 `docs/loop/PROTOTYPE_REVIEW_LOG.md`에 `CONFLICT:` 한 줄을 남긴 뒤 spec을 따른다.
- **미확정 항목 처리 규칙**: spec이 정하지 않은 값·명칭·수치(색상 token, breakpoint, 브랜드 표기, 동률 정렬 규칙 등)를 만나면 새 정책으로 확정하지 말고 (a) 화면에 예시임을 표시하고, (b) 계산에 반영하지 않으며, (c) 근거의 `이 계산에 포함되지 않은 항목`에 적고, (d) `docs/loop/PROTOTYPE_REVIEW_LOG.md`에 `ASSUMPTION:` 한 줄로 남긴다.
- **작업 사이클** — 아래 1라운드를 반복한다.
  1. 구현 또는 직전 라운드의 `TOP_FIX` 반영
  2. `npx tsc --noEmit` → `npm run lint` → `npm run build` 실행, 세 명령 모두 exit 0 확인
  3. `docs/loop/PROTOTYPE_WALKTHROUGH.md` 갱신 (아래 6) 규격)
  4. `aztks-agent` EVALUATE 디스패치 (아래 5) 규격)
  5. 반환된 스코어카드 전문을 `docs/loop/PROTOTYPE_REVIEW_LOG.md`에 라운드 번호와 함께 기록
  6. `VERDICT: GO`이고 5축 전부 `P`이면 종료, 아니면 `TOP_FIX` 하나만 처리하고 1로 돌아간다
- **한 라운드에는 `TOP_FIX` 하나만 처리한다.** 스코어카드에 없는 개선을 임의로 끼워 넣지 않는다.
- **기록 파일과 카운터**: `docs/loop/PROTOTYPE_REVIEW_LOG.md` 상단에 grep 가능한 카운터 세 줄을 유지한다.
  - `ROUND: N` — 라운드마다 +1
  - `NOGO_STREAK: N` — `NO-GO`면 +1, `GO`면 즉시 `0`으로 리셋
  - `FULL_PASS: 0|1` — 5축 전부 `P`인 `GO`를 받은 순간에만 `1`
- **커밋**: 라운드마다 `feat(prototype): <라운드 요약>` 형식으로 로컬 커밋한다. 원격 푸시는 하지 않는다.
- **도구**: 패키지 매니저는 `npm`. 부트스트랩은 `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes` 로 실행한다. **대화형 프롬프트가 하나라도 뜨면 자율 루프가 첫 턴에 멈추므로 모든 선택지를 플래그로 넘긴다** — 사용 중인 버전이 Turbopack 등을 추가로 묻는다면 해당 플래그도 함께 명시한다. shadcn/ui는 `npx shadcn@latest init` 이후 필요한 컴포넌트만 추가한다.
- **부트스트랩 직후 정리**: `create-next-app`이 생성한 `app/page.tsx`를 삭제한다. `/` 라우트는 이번 범위 밖이고(spec §3.2), 종료 방법 5)의 "`page.tsx` 두 개" 기대값과 일치해야 한다. 프로토타입 진입 URL은 `/plan`이며 `/`를 대체하는 리다이렉트나 임시 랜딩을 만들지 않는다.

## 3) 종료 조건 및 종료 방법

- **종료 조건** (아래 중 하나라도 충족되는 순간 루프를 즉시 멈춘다. 둘 이상 동시 충족 시 **위에 적힌 것이 우선**이며 STOP REASON은 하나만 기록한다):
  1. `aztks-agent` EVALUATE 반환값이 `VERDICT: GO`이고 `SCORECARD`의 A·Z·T·K·S 다섯 축이 모두 `P` → **STOP REASON: AZTKS_FULL_PASS** — **이 경로로만 목표 완수로 간주한다.**
  2. `NOGO_STREAK`이 3에 도달 → **STOP REASON: EVAL_STALLED**
  3. 동일한 `TOP_FIX`가 3라운드 연속 반환 → **STOP REASON: FIX_LOOP**
  4. 평가-진행 라운드(turn = `/goal` 평가자가 진행 상태를 한 번 점검하는 메인 에이전트 응답 사이클) 누적 30회 도달 → **STOP REASON: TURN_CAP** (= or stop after 30 turns)
- **종료 방법**:
  1. `docs/loop/PROTOTYPE_REVIEW_LOG.md` 마지막 줄에 `STOP REASON: <코드>` 한 줄을 덧붙이고 상단 카운터 세 줄을 최종값으로 갱신한다.
  2. `npx tsc --noEmit && npm run lint && npm run build` 를 실행해 세 명령 모두 exit 0 인 출력을 대화에 남긴다.
  3. 마지막 `aztks-agent` EVALUATE 응답 전문(`VERDICT:`·`SCORECARD:`·`TOP_FIX:`·`EVIDENCE:` 줄 포함)을 대화에 그대로 남긴다.
  4. `cat docs/loop/PROTOTYPE_REVIEW_LOG.md` 를 실행해 카운터 세 줄과 `STOP REASON:` 줄이 보이는 출력을 대화에 남긴다.
  5. `find app -name "page.tsx" | sort` 를 실행해 `app/plan/page.tsx`·`app/result/page.tsx` 두 개만 보이는 출력과, `ls fixtures/prototype lib/prototype` 출력을 대화에 남긴다.
  6. `git log --oneline -n 10` 과 `git status --porcelain` 을 실행해 커밋 이력과, 미커밋 파일이 1)의 작업 대상과 `docs/loop/` 안에만 있음을 대화에 남긴다.

## 4) 기타 제약조건

- `master`에 푸시하지 않고, PR을 만들거나 머지하지 않으며, Vercel 등 배포를 유발하지 않는다.
- **다음 파일·디렉터리를 수정하지 않는다** (다른 세션이 동시에 편집 중이다): `docs/grill/`, `TASK/`, `PRD/`, `SRS-Drafts/`, `plans/`, `.agents/`, `AGENTS.md`, `CLAUDE.md`, `.claude/`.
- 위 1)의 작업 대상 밖 파일은 수정하지 않는다. 예외는 `docs/loop/PROTOTYPE_REVIEW_LOG.md`와 `docs/loop/PROTOTYPE_WALKTHROUGH.md` 두 개뿐이다.
- `.agents/rules/006`의 금지 사항을 그대로 지킨다 — Route Handler(`app/api/**`)·Server Action·Prisma·Supabase·인증·미들웨어·AI 호출·실제 카드 혜택 계산을 작성하지 않는다.
- 1)의 "이번 범위에서 구현하지 않는 것"을 앞당겨 구현하지 않는다.
- 실제 카드사·플랫폼의 로고와 실명, 검증되지 않은 사용자 수·절감액·추천 보장 문구를 화면에 넣지 않는다.
- 어떤 TASK Issue도 `Done`으로 닫지 않는다.

## 5) aztks-agent 평가 디스패치 규격

매 라운드 4단계에서 `aztks-agent`를 아래 프롬프트로 디스패치한다. 완료 기준 9항목은 `TASK/task1/prototype-suggestion-local-visual.md`의 「프로토타입 완료 기준」 **원문 그대로**이며, 임의로 바꾸지 않는다.

```
MODE: EVALUATE

목표: CardFit 최초 경량 시각 체크포인트가 "혼인을 앞둔 사용자가 미래지출을 입력하고, 세 시나리오 결과와 근거를 이해하는" 사용자 경험 흐름을 끊김 없이 전달하는지 판정한다.

완료 기준 (9항목 전부 충족돼야 PASS다 — 출처: TASK/task1/prototype-suggestion-local-visual.md 「프로토타입 완료 기준」):
1. 로컬 실행 명령 한 번으로 화면을 열 수 있다.
2. /plan에서 미래지출을 한 건 이상 입력하고 카드 조건 단계로 이동할 수 있다.
3. `더 적게`·`예상한 만큼`·`더 많이`를 전환하면 선택 상태와 결과 설명이 바뀐다.
4. 유지·변경 결론, 예상 순혜택, 총 예상 혜택, 연회비, 영역별 핵심 한도를 확인할 수 있다.
5. 계산식·한도 적용 전후·조건·제외 항목·기준일·규칙 버전을 disclosure에서 확인할 수 있다.
6. 할부 관련 미반영 경계와 Fixture 예시 고지가 보인다.
7. 모바일 폭에서 가로 스크롤 없이 핵심 CTA를 사용할 수 있다.
8. 검증되지 않은 사용자 수·로고·절감액·추천 보장 문구가 없다.
9. 계획 정본 19건 중 어떤 TASK도 Done으로 닫지 않고 시각 검토 체크포인트만 기록한다.

대상:
- 코드: app/plan, app/result, components/, lib/prototype/, fixtures/prototype/
- 화면 워크스루: docs/loop/PROTOTYPE_WALKTHROUGH.md (화면별 카피 전문·상태 전이·뷰포트 증거·완주 경로)

근거 소스:
- TASK/task1/prototype-visual-spec.md — 라우팅 §3, ViewModel §4, Fixture §5, 상태 언어 §6, 고지 §7, 입력 §8, 결과 §9, 근거 패널 §10
- TASK/task1/prototype-suggestion-local-visual.md — 완료 기준 9항목과 「아직 확정하지 않은 사항」
- .agents/rules/006-prototype-visual-scope.md — 착수 가능 범위와 금지 사항
- PRD/PRD_CardFit_v1.3.md 1~4장 — 목표 G1~G6, 고객 여정, 차별 가치, US-A/B/D/F의 AC, Guardrail GR1~GR5

판정할 때 특히 확인할 것:
- A(알아서): PRD 고객 여정의 이탈 지점과 "계산·측정만 하고 실행은 대행하지 않는다"는 경계가 두 화면 안에서 전달되는가. 이번 범위에서 미룬 항목을 앞당겨 구현하지 않았는가.
- Z(잘): npx tsc --noEmit / npm run lint / npm run build 가 실제로 통과하는가. fixtures/prototype 의 Fixture가 lib/prototype/view-model.ts 타입을 만족하는가.
- T(딱): 위 9개 완료 기준에 누락·미완·모순이 있는가. prototype-visual-spec.md 확정 사항과 어긋나는 구현이 있는가.
- K(깔끔): 죽은 코드·중복 컴포넌트·임의 인라인 타입·불필요한 복잡도가 있는가.
- S(센스): 다음 개발자가 실제 Query/Command로 교체할 때 화면을 다시 짜지 않아도 되는 구조인가.

출력은 네 EVALUATE 규격(VERDICT / SCORECARD / TOP_FIX / EVIDENCE / NOTES)을 그대로 따른다. 파일을 수정하지 마라.
```

- 이 디스패치는 **읽기 전용**이다. `aztks-agent`가 코드를 고치게 하지 않는다.
- 반환된 `SCORECARD`에 `F`가 하나라도 있으면 `VERDICT`와 무관하게 NO-GO로 취급한다.
- `VERDICT: GO`이지만 `C`가 하나라도 있으면 **완수가 아니다.** `TOP_FIX`를 처리하고 다음 라운드로 간다.

## 6) 화면 워크스루 산출물 규격

`aztks-agent`는 브라우저를 볼 수 없다. 완료 기준 1·2·7처럼 실행해야 알 수 있는 항목을 판정 가능하게 만들려면, 매 라운드 `docs/loop/PROTOTYPE_WALKTHROUGH.md`에 아래를 기록한다.

- **화면별 기록** — `/plan` 미래지출 입력, `/plan` 카드 조건, `/plan` 입력 오류, `/result` 세 시나리오, `/result` 근거 disclosure 각각에 대해:
  - 접근 URL과 진입 경로
  - 화면에 실제 렌더되는 텍스트 전문 (제목·본문·CTA·고지 문구)
  - 가능한 사용자 행동과 그 결과 이동 지점
  - 사용하는 Fixture 파일과 ViewModel 타입 이름
  - 충족하는 완료 기준 번호(1~9)
- **실행 증거 (기준 1)** — `npm run dev` 실행 로그에서 서버가 기동한 줄과 접속 URL을 그대로 붙인다.
- **뷰포트 증거 (기준 7)** — 폭 375px 기준으로 각 화면의 최상위 컨테이너 클래스, 가로 스크롤이 발생할 수 있는 요소(표·긴 금액·탭)와 그 처리 방식(`overflow-x-auto` 래핑 또는 줄바꿈), 핵심 CTA의 위치와 최소 터치 영역을 적는다.
- **완주 경로 (기준 2)** — `/plan` 첫 진입부터 `/result` 근거 disclosure 열람까지 이어지는 클릭 순서를 화살표로 적고, 각 단계에서 새로고침이 필요 없음을 명시한다.
- **범위 준수 증거 (기준 9)** — 이번 라운드에서 GitHub Issue 상태를 변경하지 않았음을 한 줄로 명시한다(`gh issue` 계열 명령을 실행하지 않았다는 사실 포함). 평가자가 명령으로 확인할 수 없는 항목이므로 이 기록이 유일한 판정 근거다.
