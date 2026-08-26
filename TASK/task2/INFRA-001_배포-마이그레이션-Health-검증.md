# GitHub Project TASK — INFRA-001 배포·마이그레이션·Health 검증

## Summary
- 목적: 개발·Preview·Production 환경의 PostgreSQL migration과 배포 health를 자동 검증한다.
- REQ: REQ-NF-003, NFR-003

## References (Spec & Context)
- NFR: NFR-003
- Test: TEST-006, TEST-007

## Scope
- In: PostgreSQL migration, Preview smoke, readiness/rollback, CI 증거
- Out: Production credential 발급과 실제 외부 MyData 연동

## Task Breakdown
- [ ] 환경별 migration pipeline을 구성한다.
- [ ] readiness/health와 rollback smoke를 작성한다.
- [ ] 배포 승인 조건과 증거 보관 위치를 정의한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: Migration
- Given: 동일 Prisma migration이 Preview에 적용된다.
- When: 배포 pipeline을 실행한다.
- Then: schema drift 없이 health가 통과한다.
### Scenario 2: Rollback
- Given: smoke test가 실패한다.
- When: rollback을 실행한다.
- Then: 이전 commit health가 복구되고 실패 증거가 남는다.

## Execution Contract
- Reads: Prisma migration, environment config, health endpoint
- Writes: 배포 상태와 증거 artifact
- Side Effects: Preview 배포·rollback
- Transaction Boundary: migration command 단위
- Idempotency: commit SHA와 migration ID
- Retry Policy: readiness probe만 제한 재시도

## Verification Gates
- Test Gate: NFR-003·TEST-006 smoke 통과
- NFR Gate: 환경 분리·migration 일관성·rollback 기준 충족
- Evidence Location: CI log와 deployment artifact

## Definition of Done
- [ ] 개발/Preview migration이 동일 provider로 재현된다.
- [ ] health·rollback smoke가 자동 실행된다.
- [ ] 승인/실패 증거가 Issue에 첨부된다.

## Dependencies & Interactions
- Depends on: DATA-001~003, NFR-003, TEST-006
- Blocks: M1 Preview 배포, M2 자동화 실행

## Open Decisions
- Preview DB reset 주기와 rollback 승인자

## Decision Log
- 2026-08-26: Step 4 인프라 Task 추출. PostgreSQL migration과 health/rollback을 별도 Gate로 관리.
