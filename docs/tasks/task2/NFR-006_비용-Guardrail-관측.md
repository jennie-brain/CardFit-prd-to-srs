---
name: CardFit NFR Task
about: 외부 비용 상한과 GR1~GR5 관측·중단
title: "[NFR] NFR-006: 비용·Guardrail 관측"
labels: 'nfr, cost, observability, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — NFR-006 비용·Guardrail 관측

## Summary
- 목적: 환경별 비용과 GR1~GR5·오조회·Rule 최신성 상태를 측정하고 임계 초과 시 명시적으로 기능 또는 롤아웃을 중단한다.
- REQ: REQ-NF-006·007·009, REQ-GR-001~006, REQ-METRIC-011

## References (Spec & Context)
- 대상: API-005, QUERY-004, CostLedger·GuardrailDashboard
- 테스트: TEST-006·007

## Scope
- In: 비용 원장, 환경별 상한, GR 상태, 수동·자동 중단 규칙
- Out: 계약 전 MyData 실제 단가 확정과 미승인 외부 알림

## Task Breakdown
- [ ] 공급자 사용량과 자체 원장의 단위·대조 주기를 정의한다.
- [ ] M1 $2·M2 $50 상한과 80/100% 상태를 구현한다.
- [ ] 80%에서 Gemini 신규 생성·비필수 Preview DB를 중단한다.
- [ ] 100%에서 외부 유료 호출을 차단하고 핵심 정형 fallback을 유지한다.
- [ ] GR1~GR5·오조회 상태와 책임자·최근 점검시각을 제공한다.
- [ ] Rule 갱신 7일 경고·30일 제외와 최신성 경고 누락률을 GR5로 집계한다.
- [ ] M1 수동 점검과 M2 능동 알림을 분리한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 80% 도달
- Given: 예상 월 비용이 환경 상한의 80%다.
- When: 비용 상태를 평가한다.
- Then: 신규 AI 생성과 비필수 Preview 생성을 중단한다.
### Scenario 2: 100% 도달
- Given: 상한에 도달했다.
- When: 외부 유료 호출을 요청한다.
- Then: 차단하며 결정론적 계산·정형 근거는 유지된다.
### Scenario 3: Guardrail 위반
- Given: GR1~GR5 또는 오조회가 임계치를 위반한다.
- When: 상태를 집계한다.
- Then: 정상으로 표시하지 않고 연결된 중단 조치와 책임자를 반환한다.
### Scenario 4: 최신성 경고 누락
- Given: 갱신 지연 Rule이 계산 또는 운영 조회에 존재한다.
- When: GR5를 집계한다.
- Then: 경고 누락률을 산출하고 1건 이상이면 정상 상태로 표시하지 않는다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: AI/배포/DB 사용량, 비용 이벤트, SPEC-002 Guardrail
- Writes: 비용 집계와 임계치 초과 이벤트
- Side Effects: 알림·기능 차단 hook
- Transaction Boundary: 비용 bucket 집계와 이벤트 outbox 원자 처리
- Idempotency: provider invoice ID·period bucket
- Retry Policy: usage 수집 timeout만 제한 재시도

## Verification Gates
- Test Gate: 비용 임계치·초과·차단·복구 시나리오 통과
- NFR Gate: 비용 목표·80/100% guardrail·UNKNOWN 표기 검증
- Evidence Location: usage fixture, cost report, guardrail event log

- 실제 MyData 내부 비용은 계약 전 `UNESTIMATED`로 표시하며 0원으로 간주하지 않는다.
- M1은 외부 Slack·이메일 없이 관리자 수동 점검이 가능해야 한다.

## Definition of Done
- [ ] 환경별 비용 산식·상태전이·fallback 테스트가 통과한다.
- [ ] QUERY-004에서 모든 Guardrail을 확인할 수 있다.
- [ ] TEST-006 M1 수동 점검과 TEST-007 M2 중단 경로가 통과한다.

## Dependencies & Interactions
- Depends on: API-005, QUERY-004, 각 Guardrail 측정 원천, TEST-006; M2는 TEST-007
- Blocks: M1 시연 승인, M2 베타 승인
- 변경 전파: 공급자 가격·호출 경로·대시보드·AI fallback

## Open Decisions
- 환율·세금 처리, MyData 실제 비용, M2 알림 채널

## 결론
비용과 품질 상태를 숨은 운영 변수로 두지 않고 기능 중단 규칙까지 포함한 제품 계약으로 관리한다.

## 출처

## Decision Log
- 2026-08-26: Step 4 비용·Guardrail 관측과 차단 hook의 실행 경계를 명시.
- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
