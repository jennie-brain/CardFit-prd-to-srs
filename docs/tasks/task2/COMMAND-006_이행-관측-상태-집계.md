---
name: CardFit Command Task
about: 예약 관측과 엄격한 이행 상태 판정
title: "[Command] COMMAND-006: 이행 관측·상태 집계"
labels: 'command, cron, outcome, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-006 이행 관측·상태 집계

## Summary
- 목적: due 항목을 제한적으로 관측하고 완료·유지·미완료·판정 불가를 엄격히 집계한다.
- REQ: REQ-FUNC-010

## References (Spec & Context)
- 계약: DATA-003, API-001·004·005
- 선행: COMMAND-004

## Scope
- Vercel Cron due 생성, Adapter 관측, 최소 증거 저장
- 명시적 상태 1회·미관측 2회·24시간 간격 규칙
- 자기보고 독립성, 유지 준수·행동 완주 분리
- 승인 없는 Production 관측은 범위 밖

## Task Breakdown
- [ ] `CRON_SECRET`과 실행 멱등성을 검증한다.
- [ ] due 대상과 호출 예산을 산출한다.
- [ ] 동의·완전성·식별 결과를 평가하고 Observation을 저장한다.
- [ ] 항목 상태와 조합안 adherence를 transaction으로 집계한다.
- [ ] 판정 가능률·불가율·불일치율 event를 기록한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 명시적 완료
- Given: 정상·완전 관측에 명시적 발급/해지 상태가 있다.
- When: 판정한다.
- Then: 1회 관측으로 검증 완료할 수 있다.
### Scenario 2: 단일 미관측
- Given: 명시 상태 없이 카드가 1회 보이지 않는다.
- When: 판정한다.
- Then: 완료 확정하지 않고 PENDING을 유지한다.
### Scenario 3: 연속 미관측
- Given: 24시간 이상 간격의 정상·완전 관측 2회에서 보이지 않는다.
- When: 판정한다.
- Then: `INFERRED_CANCELLED` 증거를 기록하되 검증 완료로 승격하지 않는다.
### Scenario 4: 유지 추천
- Given: 유지 대상 카드가 계속 존재한다.
- When: 집계한다.
- Then: VERIFIED_MAINTAINED이며 행동 완주율에서 제외한다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: DATA-003 관측 원장, COMMAND-005 자기보고, 관측 정책
- Writes: 기간별 집계·품질 상태·집계 이벤트
- Side Effects: 없음
- Transaction Boundary: 기간 snapshot 기준 집계를 원자 저장
- Idempotency: 사용자·기간·집계버전 키
- Retry Policy: transient DB 오류만 재시도, 정책 미확정은 보류

## Verification Gates
- Test Gate: TEST-003 집계·누락·부분기간 시나리오 통과
- NFR Gate: NFR-001 집계 p95 및 NFR-004 최소 보존 검증
- Evidence Location: aggregation fixture와 결과 검산표

- 상시 Worker 대신 Vercel Cron→Route Handler를 사용한다.
- 관측 목적 승인, 비용 한도, 최소 보존 정책을 충족해야 활성화한다.
- 부분·오래됨·약한 식별·충돌을 미완료로 분류하는 건수는 0건이다.

## Definition of Done
- [ ] TEST-004 상태전이 테스트가 통과한다.
- [ ] TEST-007 Cron·연속관측·집계 E2E가 통과한다.
- [ ] NFR-004·006 비용·보안 기준을 충족한다.

## Dependencies & Interactions
- Depends on: DATA-003, API-001·004·005, TEST-004·005 실패 기준선, COMMAND-004, 컴플라이언스 승인
- Blocks: QUERY-003
- 변경 전파: DATA-003·API-004·MOCK-001·TEST-004·007·NFR-004·006

## Open Decisions
- 실제 카드 상태 의미, batch 크기, 보존기간, 관측 목적 승인

## 결론
불충분한 증거를 실패로 바꾸지 않는 보수적 상태 판정을 자동화한다.

## 출처

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. 관측 데이터는 기간별 통계값으로만 집계·보존.
- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
