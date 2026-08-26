---
description: 구현 결과를 CardFit SRS·TASK 기준과 일반 코드 품질 두 축으로 검토하고 판정한다
argument-hint: <TASK-ID> 또는 비교 기준 (예 COMMAND-003, main, HEAD~5)
allowed-tools: Read, Grep, Glob, Bash, Skill, Agent
---

# TASK 검토

대상: **$ARGUMENTS**

두 축으로 나눠 검토하고 축을 섞지 않는다.

## 축 1 — 프로젝트 기준 (`.agents/workflows/review-backend-task.md`)

- SRS 밖 기능·서비스·정책이 추가되지 않았는가?
- 데이터 흐름과 보관 경계가 UI보다 먼저 정의됐는가?
- 조회와 쓰기가 독립 검증 가능한가?
- 완료 조건마다 자동 테스트가 있는가?
- 인증·인가·소유권·입력 검증과 로그 마스킹이 있는가?
- AI 장애가 계산과 근거 제공을 막지 않는가?
- 로컬과 배포 DB가 같은 PostgreSQL schema·migration을 쓰는가?
- 무료 한도, 비용 상한과 중단 규칙이 반영됐는가?
- M2·M3 기능이 승격 조건 없이 M1에 포함되지 않았는가?

## 축 2 — 일반 코드 품질

`standards-spec-review` 스킬을 사용한다. 저장소 표준과 스펙(해당 TASK의 `Acceptance Criteria`·`Definition of Done`)을 각각 판정한다.

## 판정

`PASS` · `CONDITIONAL PASS` · `FAIL` 중 하나로 기록하고, 지적마다 SRS 요구사항 ID 또는 TASK 근거를 연결한다. 근거를 댈 수 없는 지적은 취향 문제로 분류해 따로 적는다.
