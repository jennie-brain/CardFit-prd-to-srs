# GitHub Project 연동 노트

## 목적

이 문서는 CardFit의 54개 TASK를 GitHub Issue·Project(`https://github.com/users/jennie-brain/projects/1`)로 등록하면서 겪은 운영상의 함정과 해결 방법을 기록한다. 다음에 같은 자동화를 다시 하거나 남은 TASK를 추가할 때 같은 실수를 반복하지 않는 것이 목적이다.

## 목차

1. 등록 방식 요약
2. GraphQL 요청 한도 함정
3. 재사용 가능한 ID 매핑
4. Roadmap 뷰의 API 한계
5. 결론
6. 출처

## 1. 등록 방식 요약

- 이슈 생성은 `gh issue create -R jennie-brain/prd-to-srs -t <title> -F <body-file> -l <labels> -m <milestone> --blocked-by <선행 이슈 번호>`로 처리했다. `--blocked-by`에 실제 선행 TASK의 이슈 번호를 넣으려면 **의존성 위상 순서(선행 TASK 먼저)로 이슈를 생성**해야 한다.
- 이슈 본문은 `TASK/task2/<TASK-ID>.md`의 원문에 `TASK/task1/03_병렬실행_Gantt_로드맵.md`(압축 수행 계획) 기준 트랙·레인·시작일·종료일·임계 경로 여부·선행/후행 TASK 표를 상단에 삽입해 생성했다.
- 라벨·마일스톤(M1/M2)은 각 `task2` 파일의 frontmatter `labels` 값을 그대로 저장소 라벨로 만들어 사용했다.

## 2. GraphQL 요청 한도 함정

**증상:** 이슈 8개(≈48회의 `gh project item-edit` 호출)만에 GraphQL 시간당 5,000포인트를 모두 소진했다.

**원인:** `gh project item-edit --field "<필드 이름>" --value "<값>"`처럼 필드를 **이름으로** 지정하면, gh CLI가 내부적으로 이름→필드 ID 매핑을 조회한다. 이 조회 자체의 GraphQL 포인트 비용이 예상보다 훨씬 컸다(정확한 원인은 문서화돼 있지 않으나, 실측상 항목당 수백 포인트 수준). `gh project item-edit --help`에는 이 비용에 대한 경고가 없다.

**해결:** 필드를 **ID로 직접 지정**하는 `gh api graphql`을 사용했다. `addProjectV2ItemById`로 이슈를 프로젝트에 추가한 뒤, `updateProjectV2ItemFieldValue`를 필드 수만큼 별칭(alias)으로 묶어 **이슈 1개당 GraphQL 호출 2회**(추가 1회 + 필드 일괄 설정 1회)로 끝냈다. 실측 비용은 이슈당 약 2포인트로, 이름 기반 방식 대비 100배 이상 저렴했다.

```bash
# 한도 확인 — REST(rate)와 GraphQL(graphql)은 별도 버킷이다
gh api rate_limit --jq '.resources.graphql, .rate'
```

```graphql
# 이슈 추가 (REST로 미리 구한 issue node_id 사용 — REST 호출은 GraphQL 포인트를 쓰지 않는다)
mutation($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) { item { id } }
}

# 필드 일괄 설정 — 별칭으로 한 요청에 여러 updateProjectV2ItemFieldValue를 묶는다
mutation($projectId: ID!, $itemId: ID!, $trackField: ID!, $trackOpt: String!, ...) {
  t: updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $trackField, value: {singleSelectOptionId: $trackOpt}}) { projectV2Item { id } }
  sd: updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $startField, value: {date: $startVal}}) { projectV2Item { id } }
  # ... 나머지 필드도 같은 방식으로 별칭 추가
}
```

**다음에 적용할 규칙:** Projects v2를 스크립트로 대량 조작할 때는 처음부터 `--field <이름>` 대신 `field-list`로 ID를 한 번 뽑아 ID 기반 GraphQL 호출로 시작한다. 개별 이슈 수가 10건을 넘어가면 이름 기반 방식은 쓰지 않는다.

## 3. 재사용 가능한 ID 매핑

2026-08-26 기준 프로젝트 `CardFit-SRS-Project`(번호 1, owner `jennie-brain`)의 ID다. 필드를 삭제·재생성하면 값이 바뀌므로 재사용 전 `gh project field-list 1 --owner jennie-brain --format json`으로 재확인한다.

| 항목 | ID |
| --- | --- |
| Project | `PVT_kwHOEli9p84BhfEW` |
| Track 필드 | `PVTSSF_lAHOEli9p84BhfEWzhgbQzg` |
| Status 필드 | `PVTSSF_lAHOEli9p84BhfEWzhgapYA` |
| Priority 필드 | `PVTSSF_lAHOEli9p84BhfEWzhgaqBs` |
| Size 필드 | `PVTSSF_lAHOEli9p84BhfEWzhgaqBw` |
| Start date 필드 | `PVTF_lAHOEli9p84BhfEWzhgaqB4` |
| Target date 필드 | `PVTF_lAHOEli9p84BhfEWzhgaqB8` |

Track 옵션: 계약·데이터 `5cee4b14` · 쓰기 로직 `2a3cdf6e` · 읽기·운영 `fa69d859` · 품질보증 `200695eb` · UX 설계 `a2e21227` · UI 구현 `7f77e95b`

Priority 옵션(임계 경로 TASK는 P0, 그 외 M1은 P1, M2는 P2로 매핑): P0 `79628723` · P1 `0a877460` · P2 `da944a9c`

Size 옵션(복잡도 H→L, M→M으로 매핑): M `7515a9f1` · L `817d0097`

Status 옵션: Backlog `f75ad846`(전체 초기값으로 사용)

## 4. Roadmap 뷰의 API 한계

`createProjectV2View`/`updateProjectV2View`는 `ROADMAP_LAYOUT` 뷰에서 `configuration: {visibleFieldIds}`를 거부한다("Roadmap views do not support visible fields"). 즉 **Roadmap 뷰의 그룹 기준(Group by)과 날짜 필드 매핑은 API로 설정할 수 없고 웹 UI에서 수동으로만 가능**하다. `TABLE_LAYOUT`·`BOARD_LAYOUT` 뷰는 `visibleFieldIds`를 정상적으로 받는다.

기본 프로젝트 템플릿에는 이미 `Roadmap`(ROADMAP_LAYOUT), `Team items`(TABLE_LAYOUT) 뷰가 있었다 — 새로 만들지 않고 `Team items`의 표시 필드만 갱신했다.

## 5. 결론

이 반복 작업의 핵심 교훈은 하나다: **GitHub Projects v2를 스크립트로 대량 조작할 때는 이름 기반 CLI 편의 플래그가 아니라 처음부터 ID 기반 GraphQL 호출로 시작한다.** 그렇지 않으면 시간당 GraphQL 한도가 실제 작업량보다 훨씬 먼저 소진된다. Roadmap 뷰의 그룹핑처럼 API로 아예 불가능한 설정은 착수 전에 미리 확인해 사용자에게 수동 단계로 안내한다.

## 6. 출처

- `TASK/task1/02_총괄_개발_실행_계획.md`
- `TASK/task1/03_병렬실행_Gantt_로드맵.md`
- `TASK/task2/*.md`
- GitHub GraphQL API 스키마(`gh api graphql -f query='{ __type(...) }'`로 조회)
