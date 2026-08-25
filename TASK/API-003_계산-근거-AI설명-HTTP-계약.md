---
name: CardFit API Contract Task
about: 계산·근거·선택적 AI 설명 Route Handler 계약
title: "[API] API-003: 계산·근거·AI 설명 HTTP 계약"
labels: 'api, route-handler, calculation, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — API-003 계산·근거·AI 설명 HTTP 계약

## Summary

- 목적: 계산 실행, 결정론적 근거 조회, 선택적 AI 설명의 HTTP 계약을 분리해 정의한다.
- 정식 경로: `POST /api/calculations`, `GET /api/calculations/{id}/evidence`, `POST /api/calculations/{id}/explanation`
- 단계: 계산·근거는 M1 필수, AI 설명은 M2 선택

## References (Spec & Context)

- SRS: 3.6.1~3.6.2, 4.1 REQ-FUNC-004~007, 6.1, 8.10, 8.12
- 선행: DATA-001·002, API-001

## Scope

- 세 시나리오 계산 요청·응답, 유지 결론·변경 후보·부분 상태
- 근거 6항목, 미반영 비용, 기준일, `rule_version`
- AI 설명 `available/unavailable`과 결정론적 근거 fallback
- 인증·소유권·입력 오류 및 외부 장애의 표준 오류 envelope

## Task Breakdown

- [ ] 요청·응답 JSON schema와 HTTP 상태 코드를 정의한다.
- [ ] LOW·BASE·HIGH 결과를 1회 응답으로 반환하고 BASE 기본값을 표시한다.
- [ ] 동의 만료, 미래입력 없음, 캐시 있음 장애, 캐시 없음 부분 상태를 구분한다.
- [ ] Evidence 최소 6항목과 거부 응답을 정의한다.
- [ ] AI 설명이 계산 DTO를 변경하지 못하는 별도 응답 계약을 정의한다.
- [ ] 논리 경로 `/calculate`를 구현 경로 `/api/calculations`로 정합화할 SRS 변경 항목을 기록한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 세 시나리오 계산 성공

- Given: 유효한 입력·동의·Rule이 존재한다.
- When: `POST /api/calculations`를 호출한다.
- Then: LOW·BASE·HIGH 결과를 한 응답으로 p95 5초 이내 반환하며 추가 탭 전환 호출이 필요 없다.

### Scenario 2: 미래지출 없음

- Given: 미래지출 항목이 0개다.
- When: 계산을 호출한다.
- Then: HTTP 400과 표준 입력 오류를 반환하고 결과는 생성하지 않는다.

### Scenario 3: Adapter 장애 분기

- Given: 동의는 유효하다.
- When: Adapter 장애 시 유효 캐시가 있으면 계산한다.
- Then: 경고와 기준일을 포함하며, 캐시가 없으면 부분 상태로 추천 결과를 노출하지 않는다.

### Scenario 4: 근거 미달

- Given: 근거 항목이 6개 미만이다.
- When: evidence를 조회한다.
- Then: p95 500ms 이내 거부 응답을 반환하고 불완전 근거를 노출하지 않는다.

### Scenario 5(M2): Gemini 장애

- Given: AI SDK가 timeout·429·5xx를 반환한다.
- When: explanation을 요청한다.
- Then: 설명 상태만 `unavailable`로 반환하며 계산과 6항목 결정론적 근거는 유지된다.

## Technical & Non-Functional Constraints

- Prisma 경로는 Node.js runtime을 사용한다.
- 모든 Route에서 세션·소유권·서버 입력 검증을 수행한다.
- AI는 Vercel AI SDK와 `AI_PROVIDER`·`AI_MODEL`을 사용하며 계산값을 생성·수정하지 않는다.
- 계산 오류율 ≤0.1%, 재계산 불일치 0건을 측정할 correlation/result hash를 제공한다.
- 응답·로그에 원본 금융 데이터와 비밀정보를 노출하지 않는다.

## Definition of Done

- [ ] M1에서는 계산·근거 endpoint의 schema·상태 코드·오류 코드 예시가 고정됐다.
- [ ] M1에서는 정상·부분·동의 오류·근거 미달 계약 검증이 통과한다.
- [ ] M2에서는 explanation endpoint와 AI 장애·fallback 계약 검증이 추가로 통과한다.
- [ ] OpenAPI가 프로젝트 범위에 없다면 동등한 versioned schema 문서가 있다.
- [ ] Mock 응답을 이용해 프론트엔드가 독립 개발 가능하다.

## Dependencies & Interactions

- Depends on: DATA-001·002, API-001, Net Benefit 정책 확정(계산 구현 전)
- Blocks: MOCK-001, 계산·근거 로직, 결과·근거 UI, E2E
- Interacts with: API-002, API-005 Rule 관리, REQ-NF-001~003·006·007
- 변경 전파: DTO 변경 시 Mock, UI, TEST, Evidence cache를 함께 갱신한다.

## Open Decisions

- [ ] SRS 논리 경로와 구현 경로 정식 통일
- [ ] 부분 상태 HTTP status와 domain code
- [ ] calculation 생성의 동기 처리와 중복 요청 idempotency key
- [ ] AI 설명의 캐시 키·TTL과 M2 비용 상한

## 결론

API-003은 계산과 근거를 필수 결정론적 계약으로, AI 설명을 실패 가능한 선택 계약으로 분리한다. 이 경계가 핵심 사용자 경험을 AI 공급자 장애로부터 보호한다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`
