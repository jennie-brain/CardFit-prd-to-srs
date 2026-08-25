---
name: CardFit NFR Task
about: 환경별 Health·smoke·가용성 검증
title: "[NFR] NFR-003: 가용성·Health·배포"
labels: 'nfr, availability, deployment, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — NFR-003 가용성·Health·배포

## Summary
- 목적: M1 배포 smoke와 M2 월 가용성≥99.5%를 단계별로 검증한다.
- REQ: REQ-NF-004, REQ-DEPLOY-001~007

## References (Spec & Context)
- 계약: API-005
- 대상: QUERY-004, TEST-006·007

## Scope
- In: Vercel build·migration·health·smoke와 단계별 가용성
- Out: 별도 CI/CD 서버, VM·Kubernetes 운영

## Task Breakdown
- [ ] 앱 버전·DB 호환성 health를 구현·검증한다.
- [ ] Vercel Preview/Production smoke 절차를 정의한다.
- [ ] migration→build→health 실패 시 배포 중단을 검증한다.
- [ ] M2의 1분 점검과 downtime 산식을 설정한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: M1 배포
- Given: Git Push Preview다.
- When: build·migration·smoke를 실행한다.
- Then: 모두 성공해야 시연 가능 상태가 된다.
### Scenario 2: DB 불일치
- Given: 앱과 migration이 호환되지 않는다.
- When: 배포한다.
- Then: 배포 또는 health가 실패하고 정상으로 표시하지 않는다.
### Scenario 3: M2 다운타임
- Given: 5xx 또는 10초 초과가 연속 3회다.
- When: 월 가용성을 계산한다.
- Then: downtime으로 포함하고 99.5%와 비교한다.

## Technical & Non-Functional Constraints
- Git Push 기반 Vercel 배포 외 별도 CI/CD 서버를 두지 않는다.
- health 응답은 비밀정보를 노출하지 않는다.

## Definition of Done
- [ ] M1 smoke·수동 점검 증거가 있다.
- [ ] M2 모니터링 산식과 alert 승인 경계가 정의됐다.
- [ ] TEST-005·006이 통과한다.

## Dependencies & Interactions
- Depends on: API-005, QUERY-004, TEST-005·006; M2는 TEST-007
- Blocks: M1 배포 승인, M2 베타 승인
- 변경 전파: Vercel 설정·migration·health schema

## Open Decisions
- M2 모니터링 도구와 알림 채널 승인

## 결론
포트폴리오 smoke와 업무 베타 가용성을 분리해 과도한 M1 운영 구축을 막는다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
