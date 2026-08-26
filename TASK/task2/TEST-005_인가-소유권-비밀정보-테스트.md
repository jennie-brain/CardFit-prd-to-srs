---
name: CardFit Test Task
about: Actions·Routes·Admin·Cron의 보안 경계 검증
title: "[Test] TEST-005: 인가·소유권·비밀정보 테스트"
labels: 'test, security, authorization, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — TEST-005 인가·소유권·비밀정보 테스트

## Summary
- 목적: 모든 변경·조회 경계에서 세션·소유권·역할·Cron secret과 비밀정보 격리를 증명한다.
- REQ: REQ-SEC-001~005, NF-005·008

## References (Spec & Context)
- 계약: API-001~005, DATA-001~003
- 로직: 모든 Command/Query

## Scope
- In: 세션, 소유권, 관리자, Cron, 동의 scope, 번들·로그 비밀정보 검사
- Out: 침투 테스트 전문 진단과 실제 내부 Identity 구현

## Task Breakdown
- [ ] 미인증·타 사용자·관리자 권한 없는 요청 matrix를 작성한다.
- [ ] Cron secret 없음·오류·정상 사례를 작성한다.
- [ ] Client bundle·응답·로그 secret scanner를 작성한다.
- [ ] 동의 scope와 조회 필드 대조 테스트를 작성한다.
- [ ] 원본 금융 응답 미저장과 마스킹을 검증한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 타 사용자 리소스
- Given: A 세션이 B의 ID를 사용한다.
- When: Query/Command를 호출한다.
- Then: 거부하고 읽기·쓰기·존재 유출은 0건이다.
### Scenario 2: Cron 인증 실패
- Given: 잘못된 secret이다.
- When: Cron Route를 호출한다.
- Then: Adapter 호출·DB 변경은 0건이다.
### Scenario 3: 번들·로그 검사
- Given: Production build와 실패 로그다.
- When: secret scanner를 실행한다.
- Then: DB URL·service role·Gemini key·토큰 노출은 0건이다.
### Scenario 4: scope 초과
- Given: 동의 범위 밖 필드를 요청한다.
- When: Adapter를 호출한다.
- Then: 차단·감사 플래그가 발생한다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: 세션·소유권·API 계약
- Writes: 테스트 전용 사용자/권한 fixture
- Side Effects: 없음
- Transaction Boundary: case별 사용자 fixture rollback
- Idempotency: fixture user ID 재사용 가능
- Retry Policy: 인가 실패는 재시도하지 않음

## Verification Gates
- Test Gate: 타 사용자 접근·미인증·민감정보 노출 GWT 통과
- NFR Gate: NFR-004 권한·마스킹 검증
- Evidence Location: authorization matrix와 response redaction assertion

- 실제 비밀키 대신 canary 값을 사용한다.
- 오조회 1건도 허용하지 않는다.

## Definition of Done
- [ ] 모든 Action·Route·관리자·Cron 경계가 matrix에 포함됐다.
- [ ] REQ-SEC-001~005와 TC-NF-005·008이 추적된다.
- [ ] 보안 실패 로그 자체에 민감정보가 없다.

## Dependencies & Interactions
- Depends on: DATA-001~003, API-001~005, 세션·역할·소유권·비밀정보 정책
- Blocks: 모든 로직 DoD, NFR-003·004, TEST-006·007
- 변경 전파: 인증·DTO·로그 정책·환경변수

## Open Decisions
- 실제 Identity·관리자 역할·감사 접근 권한

## 결론
기능 성공과 별도로 데이터 오조회와 비밀정보 노출이 없음을 배포 전에 증명한다.

## 출처

## Decision Log
- 2026-08-26: Step 3 AC를 소유권·인가·비밀정보 비노출 테스트로 구체화.
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
