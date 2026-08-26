# CardFit 개발 하네스

멀티벤더 샘플([AI-multivender-harness-sample](https://github.com/wild-mental/AI-multivender-harness-sample))의 구조만 참고하고 CardFit에 맞게 다시 작성한 공통 하네스다. 특정 에이전트용 규칙을 중복 생성하지 않고 루트 `AGENTS.md`, 프로젝트 `rules`, 실행 `workflows`, 선택형 `skills`로 구성한다.

샘플의 Java/Spring, MySQL/JPA, FastAPI/LangChain, Kafka, Flutter, Vite SPA 규칙은 C-TEC-001~007과 충돌하여 가져오지 않았다. 샘플의 다른 프로젝트 설명과 도구별 중복 규칙도 제외했다.

## 구성

```
AGENTS.md                  공통 상위 규칙 (Cursor·Antigravity가 직접 읽음)
CLAUDE.md                  @AGENTS.md 를 import + Claude Code 전용 안내
.agents/
  rules/                   세부 규칙 5개
  workflows/               구현·검토 절차
  issue-tracker.md         GitHub Issue 조회 절차
  skills -> ../.claude/skills   링크. git 미포함, setup 스크립트로 생성
.claude/
  skills/                  선택형 스킬 9개 (실체, 저장소 포함)
  commands/                슬래시 커맨드
  agents/                  서브에이전트
scripts/setup-harness.*    .agents/skills 링크 생성 (Cursor·Antigravity용, 선택)
```

## 도구별 적용 범위

| 도구 | 규칙 | 스킬 | 추가 설정 |
|---|---|---|---|
| Claude Code | `CLAUDE.md` → `@AGENTS.md` import | `.claude/skills/` 직접 읽음 | 없음 |
| Cursor · Antigravity | `AGENTS.md` 직접 읽음 | `.agents/skills` 링크 | `scripts/setup-harness.*` 1회 |

Claude Code는 `AGENTS.md`도 `.agents/skills/`도 읽지 않는다. 그래서 `CLAUDE.md`가 `@AGENTS.md`를 import하고, 스킬 실체는 Claude Code가 직접 읽는 `.claude/skills/`에 두어 저장소에 포함했다. **주 도구인 Claude Code는 clone 직후 아무 설정 없이 동작한다.**

`.agents/skills`는 링크라서 git으로 전달되지 않는다. Cursor·Antigravity를 함께 쓸 때만 setup 스크립트로 생성한다.

## 규칙 우선순위

`법·규제·보안 → PRD → SRS → 정책 결정 로그 → TASK → 구현` 순서로 판단한다. 외부 스킬이 이 순서를 바꾸지 못한다. 스킬이 범위 밖 서비스를 제안하더라도 승인된 TASK가 없으면 도입하지 않는다.

스킬 채택·제외 근거는 [`SKILLS.md`](SKILLS.md)에 있다.
