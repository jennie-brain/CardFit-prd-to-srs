# 이슈 트래커

CardFit의 개발 TASK 54건은 `jennie-brain/prd-to-srs` 저장소의 GitHub Issue로 관리한다. 일정·트랙·우선순위 필드는 [GitHub Project 1](https://github.com/users/jennie-brain/projects/1)에 있다.

## TASK ID로 이슈 찾기

이슈 제목에 TASK ID가 그대로 들어 있다. 예: `[Data] DATA-001: 핵심 입력·플랫폼·Rule 데이터 계약`

```bash
# TASK ID로 이슈 번호 찾기
gh issue list -R jennie-brain/prd-to-srs --state all --search "DATA-001" --json number,title

# 이슈 본문 읽기 (Summary·AC·DoD·실행 일정·의존성 포함)
gh issue view <번호> -R jennie-brain/prd-to-srs

# 특정 TASK를 막고 있는 선행 이슈 확인
gh issue view <번호> -R jennie-brain/prd-to-srs --json title,body,labels,milestone
```

## 이슈 본문 구조

각 이슈는 `TASK/task2/<TASK-ID>_*.md` 원문에 실행 일정 표를 덧붙인 것이다. 다음 절이 항상 있다.

- `실행 일정` — 트랙·레인·복잡도·시작일·종료일·임계 경로 여부·선행/후행 TASK
- `Summary` / `Scope` — 목적과 In/Out 범위
- `Acceptance Criteria (BDD/GWT)` — 스펙 판정의 근거
- `Execution Contract` — Reads·Writes·Side Effects·Transaction·Idempotency·Retry
- `Verification Gates` — Test Gate·NFR Gate·Evidence Location
- `Definition of Done`
- `Dependencies & Interactions` — Depends on / Blocks

## 스펙 원천 우선순위

리뷰나 구현에서 "무엇을 만들기로 했는가"를 판정할 때 아래 순서로 본다.

1. 해당 TASK의 GitHub Issue 본문 (특히 `Acceptance Criteria`, `Definition of Done`)
2. `TASK/task2/<TASK-ID>_*.md` 원문
3. `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`의 연결 요구사항 ID
4. `TASK/task1/04_정책_결정_로그.md` — 미확정 정책은 임의 확정하지 않는다

## 라벨과 마일스톤

- 유형: `data` `api` `spec` `mock` `command` `query` `test` `nfr` `ux` `ui` `security` `infra`
- 우선순위: `priority:must` `priority:should`
- 마일스톤: `M1`(2026-11-13) · `M2`(2026-11-24)
