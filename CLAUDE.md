@AGENTS.md

# Claude Code 전용 안내

위 `AGENTS.md`가 이 저장소의 공통 규칙이다. 아래는 Claude Code에서만 적용되는 사용 안내다.

## 스킬

스킬 12개는 `.claude/skills/`에 저장소와 함께 들어 있다. clone 직후 추가 설정 없이 로드된다.

Cursor·Antigravity를 함께 쓴다면 `.agents/skills` 링크를 만든다(선택).

```bash
bash scripts/setup-harness.sh                                    # macOS / Linux
powershell -ExecutionPolicy Bypass -File scripts/setup-harness.ps1  # Windows
```

## 세부 규칙 위치

`AGENTS.md`가 상위 규칙이고, 아래 문서가 세부 규칙이다. 충돌하면 `AGENTS.md`와 SRS가 우선한다.

| 파일 | 내용 |
| --- | --- |
| `.agents/rules/001-project-scope.md` | 단계별 범위와 금지 항목 |
| `.agents/rules/002-backend-architecture.md` | Server Action·Route Handler·Query·Domain·Adapter 경계, Prisma 규칙 |
| `.agents/rules/003-data-security.md` | 저장 금지 데이터, 인가·소유권, 로그 마스킹 |
| `.agents/rules/004-testing-quality.md` | TDD 순서와 Unit·Contract·Integration·E2E 구분 |
| `.agents/rules/005-delivery-operations.md` | 배포·migration·Cron·비용 상한 |

## 슬래시 커맨드

| 커맨드 | 용도 |
| --- | --- |
| `/implement-task <TASK-ID>` | TASK 하나를 계약 → 실패 테스트 → 구현 → 검증 순서로 수행 |
| `/review-task <TASK-ID 또는 비교 기준>` | 구현 결과를 SRS·TASK 기준으로 판정 |

## 서브에이전트

| 에이전트 | 위임 시점 |
| --- | --- |
| `contract-guardian` | `DATA`·`API`·`SPEC` 계약 또는 Prisma schema를 바꿀 때 후행 영향 점검 |
| `security-boundary-reviewer` | 서버 진입점·로그·응답의 인가·소유권·마스킹 점검 |

## 작업 기준

TASK는 GitHub Issue로 관리한다. 이슈 번호와 TASK ID 매핑, 일정·트랙·우선순위 필드는 [GitHub Project](https://github.com/users/jennie-brain/projects/1)에 있다. 이슈 조회 방법은 `.agents/issue-tracker.md`를 따른다.

한 TASK = 한 PR = 한 Issue다. 여러 TASK를 한 변경으로 합치지 않는다.
