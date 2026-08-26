---
name: CardFit API Contract Task
about: Rule 관리·Health·예약 점검 인터페이스 계약
title: "[API] API-005: 운영·Rule·Health·Cron 계약"
labels: 'api, admin, operations, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — API-005 운영·Rule·Health·Cron 계약

## Summary

- 목적: `upsertBenefitRule`, `GET /api/health`, `GET /api/cron/rules`, `GET /api/cron/outcomes`의 운영 계약을 정의한다.
- 단계: Rule·Health는 M1, 자동 Rule 점검·Outcome due 처리는 M2

## References (Spec & Context)

- SRS: REQ-NF-004·006·007·009, REQ-DEPLOY-003·006·007, 8.10~8.13
- 선행: DATA-001, API-001; Outcome Cron은 DATA-003 추가

## Scope

- 관리자 Rule upsert와 버전·유효기간·감사 결과
- 앱 버전·DB migration 상태를 최소 정보로 반환하는 health
- Rule 최신성 점검과 7일 경고·30일 계산 제외 결과
- +30일 Outcome due 대상 생성 결과
- Cron 비밀 검증·멱등성·부분 실패·비용 요약

## Execution Contract

- Reads: DATA-001·003, API-001과 Rule·배포·비용 정책
- Writes: 관리자 Action, Health와 Cron 요청·응답·오류 schema
- Side Effects: 계약 작성은 `None`. Rule 변경·Cron 실행은 후행 Command가 담당한다.
- Transaction Boundary: Rule upsert·후보 만료와 Cron batch의 원자성·부분 실패 경계를 정의한다.
- Idempotency: Rule version과 Cron 실행구간 키로 중복 처리 의미를 정의한다.
- Retry Policy: Health는 재시도 가능하고 Rule validation·인가 오류는 재시도하지 않는다.

## Task Breakdown

- [ ] 관리자 Action의 입력·인가·낙관적 동시성 계약을 정의한다.
- [ ] health 응답의 공개/비공개 필드와 상태 코드를 정의한다.
- [ ] 두 Cron endpoint의 인증·멱등키·실행 결과를 정의한다.
- [ ] Rule 버전 변경 시 후보 만료 이벤트 계약을 정의한다.
- [ ] 최신성·비용 상한 도달 시 경고·중단 결과를 정의한다.
- [ ] M1과 M2 endpoint 활성화 조건을 환경별로 구분한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: Rule 버전 등록

- Given: 권한 있는 관리자가 유효한 새 Rule을 제출한다.
- When: `upsertBenefitRule`을 실행한다.
- Then: 새 버전과 감사 이벤트가 저장되고 이전 Rule을 참조한 후보는 만료 대상으로 식별된다.

### Scenario 2: 권한 없는 Rule 변경

- Given: 관리자 권한이 없는 세션이다.
- When: Rule 변경을 요청한다.
- Then: 변경을 거부하고 DB 쓰기·후보 만료는 0건이다.

### Scenario 3: Health 확인

- Given: 앱과 DB가 호환된다.
- When: `/api/health`를 호출한다.
- Then: 앱 버전·DB 상태·응답 시각을 반환하되 비밀정보와 내부 연결문자열은 반환하지 않는다.

### Scenario 4: Cron 재호출

- Given: 같은 실행 구간의 Cron이 재호출된다.
- When: rules 또는 outcomes endpoint를 실행한다.
- Then: 중복 변경 없이 기존 실행 결과 또는 멱등 결과를 반환한다.

## Technical & Non-Functional Constraints

- Cron은 `CRON_SECRET`을 검증하며 Vercel Route Handler 이외의 상시 Worker를 만들지 않는다.
- Rule 갱신 지연 7일 초과는 경고, 30일 초과는 계산 제외다.
- health는 DB 쓰기를 하지 않고 민감한 배포·환경 정보를 숨긴다.
- Rule 변경·외부 호출·Cron 실행은 감사 로그에 남긴다.
- 비용 80% 도달 시 선택적 AI 신규 생성을 끄는 상태를 운영 응답으로 확인할 수 있어야 한다.

## Verification Gates

- Test Gate: TEST-002·005·006·007의 Rule·Health·Cron 계약 검사가 통과해야 한다.
- NFR Gate: NFR-002·003·004·006의 신뢰성·배포·보안·Guardrail 기준을 충족해야 한다.
- Evidence Location: versioned 운영 schema, 권한표, Cron 멱등성·Health 노출 검사 결과

## Definition of Done

- [ ] 네 인터페이스의 입력·응답·권한·오류 계약이 고정됐다.
- [ ] M1/M2 활성화 경계와 Vercel 설정 책임이 명시됐다.
- [ ] Rule 최신성·후보 만료·Cron 멱등 계약을 검증할 수 있다.
- [ ] health 응답의 정보 노출 검토가 완료됐다.

## Dependencies & Interactions

- Depends on: DATA-001, API-001
- Blocks: COMMAND-007, QUERY-004, NFR-003·004·006, UI-009
- External Blockers: `/api/cron/outcomes`의 DATA-003·관측 정책 승인
- Interacts with: DATA-002 후보 만료, API-003 계산 제외, API-004 관측
- 변경 전파: Rule/health/cron 계약 변경 시 운영 UI, 배포 설정, Mock, NFR TEST를 갱신한다.

## Open Decisions

- [ ] 관리자 인증·역할 제공 주체
- [ ] health에서 확인할 migration 호환성 표현
- [ ] Cron 실행 시간대·batch 크기·실패 재처리 정책
- [ ] 데이터 운영 일간 알림의 MVP 내 구현 범위

## 결론

API-005는 사용자 기능과 운영 기능을 분리하고 Rule 최신성·배포 상태·예약 작업을 관측 가능한 계약으로 만든다. M1에는 필요한 최소 Health와 수동 Rule 관리를, 자동화는 M2에 둔다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`

## Decision Log

### 2026-08-26 — 새 TASK 템플릿 적용

- 결정: API-005에 Execution Contract와 Verification Gates를 추가한다.
- 근거: 운영 인터페이스의 권한·원자성·멱등성·재시도 의미를 Logic 전에 고정해야 한다.
- 영향: M1 Rule·Health와 M2 Cron 활성화 조건을 분리해 검증한다.
