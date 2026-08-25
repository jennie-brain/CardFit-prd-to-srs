---
name: CardFit Command Task
about: Adapter 데이터를 품질 메타데이터와 함께 동기화
title: "[Command] COMMAND-002: 플랫폼 스냅샷 동기화"
labels: 'command, adapter, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-002 플랫폼 스냅샷 동기화

## Summary
- 목적: 동의 범위 안의 HeldCard·PastSpend·Catalog를 품질 상태와 함께 갱신한다.
- REQ: REQ-FUNC-002

## References (Spec & Context)
- 계약: DATA-001, API-001, MOCK-001
- SRS: 3.2~3.4, 6.2.5, ADR-004

## Scope
- 동의 선검증, Adapter 호출, 최소 파생 캐시 upsert
- 정상·부분·오래됨·장애를 구분하는 sync result
- 철회 시 HeldCard·PastSpend 파기
- Production 내부 API 추측은 범위 밖

## Task Breakdown
- [ ] 동의 상태·scope를 확인한 후 Adapter를 호출한다.
- [ ] 데이터와 `data_as_of`·`sync_status`·`completeness`를 원자적으로 저장한다.
- [ ] 부분·실패를 빈 배열로 변환하지 않는다.
- [ ] 철회 Command에서 파기와 감사 이벤트를 처리한다.
- [ ] Mock/Production 구현체가 같은 orchestration을 사용하게 한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 동기화
- Given: 유효한 동의와 완전한 응답이 있다.
- When: 동기화한다.
- Then: 최신 파생 데이터와 품질 메타데이터를 저장한다.
### Scenario 2: 부분 응답
- Given: 일부 기관 데이터가 누락됐다.
- When: 동기화한다.
- Then: 이전 정상 캐시를 임의 삭제하지 않고 PARTIAL 상태를 저장한다.
### Scenario 3: 만료·철회
- Given: 동의가 만료 또는 철회다.
- When: 동기화를 요청한다.
- Then: 외부 조회를 하지 않으며 철회면 캐시를 파기한다.

## Technical & Non-Functional Constraints
- 오조회 0건, 토큰·원본 응답 저장 0건을 유지한다.
- Adapter 비용·timeout을 기록하되 개인신용정보는 로그에 남기지 않는다.

## Definition of Done
- [ ] TEST-001 Adapter·동의·오류 테스트가 통과한다.
- [ ] TEST-005 보안·인가 테스트가 통과한다.
- [ ] MOCK-001 필수 상태를 모두 처리한다.

## Dependencies & Interactions
- Depends on: DATA-001, API-001, MOCK-001
- Blocks: COMMAND-003, QUERY-001
- 변경 전파: API-001·MOCK-001·NFR-004·005·006

## Open Decisions
- Production 인증·scope·비용·재시도 계약

## 결론
플랫폼 장애와 실제 빈 데이터를 구분하는 상태 변경 경계를 제공한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`

