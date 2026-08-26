---
description: CardFit TASK 하나를 계약 → 실패 테스트 → 최소 구현 → 검증 순서로 수행한다
argument-hint: <TASK-ID> (예 DATA-001, COMMAND-003)
allowed-tools: Read, Edit, Write, Grep, Glob, Bash, Skill, Agent
---

# TASK 구현

대상: **$ARGUMENTS**

`.agents/rules/`와 `.agents/workflows/implement-backend-task.md`를 기준으로 아래 순서를 지킨다. **한 번에 이 TASK 하나만** 구현하고, 다른 TASK의 범위를 끌어오지 않는다.

## 1. 근거 확보

- `TASK/task2/`에서 해당 TASK 문서를 읽는다. GitHub Issue가 있으면 `.agents/issue-tracker.md` 절차로 함께 읽는다.
- `Depends on`의 선행 TASK가 실제로 완료됐는지 확인한다. 미완료면 **구현을 시작하지 말고** 무엇이 막고 있는지 보고한다.
- `Scope`의 Out 항목과 `Open Decisions`를 확인한다. 미승인 정책은 임의 확정하지 않고 `TASK/task1/04_정책_결정_로그.md` 기준으로 `Blocked` 처리한다.

## 2. 계약 먼저

- 저장·조회할 데이터와 보존 경계를 먼저 적는다.
- Command(쓰기)와 Query(읽기)를 나눈다. Query는 상태를 바꾸지 않는다.
- schema·DTO·Adapter 계약과 Fixture를 구현보다 먼저 변경한다.
- Prisma schema를 바꾸면 `contract-guardian` 서브에이전트로 후행 영향을 점검한다.

## 3. 실패하는 테스트 먼저

`test-driven-development` 스킬을 사용한다. `Acceptance Criteria`를 성공·실패·경계 사례로 바꾸고, 가장 작은 실패 테스트를 먼저 작성해 **실제로 실패하는 것을 확인**한다. 구현 후 테스트를 덧붙이는 방식으로 TDD를 주장하지 않는다.

## 4. 최소 구현

테스트를 통과시키는 최소 구현을 한다. 그 뒤 인가·소유권·오류·재시도 경계를 추가한다.

## 5. 검증

`verification-before-completion` 스킬을 사용한다. 관련 테스트 → 전체 테스트 → lint → typecheck → build 순서로 넓히고 **실제 실행 출력을 확인**한다. 서버 경계를 건드렸으면 `security-boundary-reviewer` 서브에이전트를 돌린다.

## 6. 보고

변경 파일, 실행한 검증 명령과 결과, 남은 `TBD`·`UNKNOWN`, `Verification Gates` 충족 여부를 보고한다. 실패·생략·환경 제약을 숨기지 않는다.
