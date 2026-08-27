---
name: CardFit API Contract Task
about: 추천안 이행 자기보고와 후속 관측 계약
title: "[API] API-004: 이행 자기보고·관측 HTTP 계약"
labels: 'api, outcome, cron, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — API-004 이행 자기보고·관측 HTTP 계약

## Summary

- 목적: `POST /api/outcomes/{id}/self-report`와 `POST /api/internal/outcomes/observe`의 멱등·인가·상태전이 계약을 정의한다.
- 사용자 가치: 사용자의 응답과 플랫폼 관측이 다르거나 확인 불가능해도 결과를 왜곡하지 않는다.

## References (Spec & Context)

- SRS: 3.6.3, REQ-FUNC-010, 4.5, 6.2.2~6.3, REQ-DEPLOY-007
- PRD: F-13, US-C AC1~AC7
- 선행: DATA-003, API-001

## Scope

- 항목별 자기보고 요청과 최초 제출 멱등 처리
- Cron용 내부 관측 배치 요청·응답과 `CRON_SECRET`
- 동의·완전성·식별·연속관측에 따른 상태 및 사유 코드
- 재시도·부분 성공·중복 대상의 batch result
- 실행 개입 없이 측정만 수행하는 경계

## Execution Contract

- Reads: DATA-003, API-001과 승인된 관측 상태·사유 계약
- Writes: 자기보고·내부 관측 HTTP 요청·응답·오류 schema
- Side Effects: 계약 작성은 `None`. 실제 자기보고 저장과 Adapter 관측은 후행 Command가 담당한다.
- Transaction Boundary: 자기보고 항목과 관측 batch의 원자성·부분 성공 경계를 각각 정의한다.
- Idempotency: `selection_id`, OutcomeItem과 batch 실행키의 중복 의미를 정의한다.
- Retry Policy: 일시적 Adapter·batch 오류만 재시도하고 동의·인가·식별 충돌은 재시도하지 않는다.

## Task Breakdown

- [ ] 자기보고 DTO, 허용 전이, 중복 응답을 정의한다.
- [ ] 내부 관측 요청의 대상·batch size·멱등키·결과 DTO를 정의한다.
- [ ] `CRON_SECRET`, 세션, 리소스 소유권의 적용 경계를 구분한다.
- [ ] 명시적 상태 1회와 미관측 2회 규칙을 상태 코드로 표현한다.
- [ ] 부분·오래됨·식별 충돌을 미완료와 구분한다.
- [ ] 외부 발송·재노출·해지·발급 실행 필드를 계약에서 제외한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 최초 자기보고

- Given: 현재 사용자 소유의 선택 기록과 응답 가능한 OutcomeItem이 있다.
- When: 항목별 완료 여부를 제출한다.
- Then: 최초 응답만 저장하고 자기보고 상태와 검증 상태를 독립 반환한다.

### Scenario 2: 중복 제출

- Given: 동일 `selection_id`의 유효 응답이 이미 있다.
- When: 같은 요청을 다시 제출한다.
- Then: 기존 결과를 반환하고 추가 집계·상태 덮어쓰기는 0건이다.

### Scenario 3: 인증되지 않은 내부 관측

- Given: `CRON_SECRET`이 없거나 일치하지 않는다.
- When: 내부 관측 endpoint를 호출한다.
- Then: 요청을 거부하고 Adapter 호출·DB 상태 변경은 0건이다.

### Scenario 4: 관측 불가

- Given: 동의 만료, 부분 응답, 오래된 데이터 또는 식별 충돌이 있다.
- When: 항목 판정을 수행한다.
- Then: `INCONCLUSIVE` 또는 `UNAVAILABLE`와 사유를 반환하고 미완료로 확정하지 않는다.

## Technical & Non-Functional Constraints

- M2 기능이며 컴플라이언스 승인 전 Production 관측을 비활성화한다.
- Vercel Cron이 보안 Route Handler를 호출하고 상시 Worker를 두지 않는다.
- 동일 batch·OutcomeItem 재처리는 멱등해야 한다.
- 호출량·비용 한도와 Adapter rate limit을 batch 계약에 반영한다.
- 원본 마이데이터 응답은 API 응답이나 로그에 포함하지 않는다.

## Verification Gates

- Test Gate: TEST-004·005·007의 상태전이·Cron 인가·멱등성 검사가 통과해야 한다.
- NFR Gate: NFR-003·004·006의 가용성·보존·비용 기준을 충족해야 한다.
- Evidence Location: versioned HTTP schema, batch 결과 예시와 계약 테스트 결과

## Definition of Done

- [ ] 두 endpoint의 schema·status·오류·멱등 계약이 고정됐다.
- [ ] 자기보고/검증 상태 조합과 모든 판정 불가 사유를 표현한다.
- [ ] 비밀정보·소유권·동의 범위 검증 조건이 명시됐다.
- [ ] Mock 관측 Fixture로 정상·부분·충돌 계약 테스트가 가능하다.

## Dependencies & Interactions

- Depends on: DATA-003, API-001
- Blocks: COMMAND-005·006, QUERY-003, TEST-004·007, UI-008
- External Blockers: 관측 목적·범위·보존기간 승인
- Interacts with: API-005 Cron due 대상, REQ-NF-005·007·008
- 변경 전파: 상태·사유 변경 시 DATA-003, Mock, 집계, UI, TEST를 갱신한다.

## Open Decisions

- [ ] 배치 최대 크기·timeout·재시도 횟수
- [ ] self-report 수정 허용 여부와 최초 제출 원칙의 UX 처리
- [ ] 실제 Adapter의 카드 식별·상태 의미 승인

## 결론

API-004는 사용자 진술과 플랫폼 증거를 어느 한쪽으로 덮어쓰지 않는 이행 측정 경계다. 판정 불가를 명시적인 정상 상태로 취급하는 것이 핵심이다.

## 출처

- `docs/technical/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `docs/product/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — 새 TASK 템플릿 적용

- 결정: API-004에 Execution Contract와 Verification Gates를 추가한다.
- 근거: 자기보고와 자동 관측의 멱등성·부분 성공·재시도 의미를 Logic 전에 고정해야 한다.
- 영향: Production 자동 관측은 컴플라이언스 승인 전 비활성화한다.
