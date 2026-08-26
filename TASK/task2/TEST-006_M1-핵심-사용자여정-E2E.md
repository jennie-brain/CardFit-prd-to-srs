---
name: CardFit Test Task
about: M1 핵심 가치 전달 전 구간 E2E
title: "[Test] TEST-006: M1 핵심 사용자 여정 E2E"
labels: 'test, e2e, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — TEST-006 M1 핵심 사용자 여정 E2E

## Summary
- 목적: 비식별 Fixture로 미래지출 입력부터 유지/변경 결론·차액·배분·근거·선택까지의 가치 전달을 증명한다.
- 범위: M1 필수 F-01·02 Mock·03·04·05·06·12

## References (Spec & Context)
- SRS: 1.2.1 M1, 9.4~9.5
- 선행: TEST-001~003·005, M1 Command/Query

## Scope
- In: 비식별 Fixture 기반 M1 핵심 가치 여정과 주요 실패 복구
- Out: M2 자동화, 실제 카드 발급·해지, Production Adapter

## Task Breakdown
- [ ] 정상 변경·정상 유지·시나리오 분기 여정을 작성한다.
- [ ] 부분·오래됨·동의 만료·근거 미달 여정을 작성한다.
- [ ] Gemini 미사용/장애에도 핵심 흐름이 유지됨을 검증한다.
- [ ] Vercel Preview smoke 실행 절차와 증거를 남긴다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 변경 가치 전달
- Given: `FX-NORMAL-CHANGE`다.
- When: 입력부터 결과까지 완료한다.
- Then: 세 시나리오·변경 결론·차액·배분·근거 ≥6를 확인한다.
### Scenario 2: 유지 가치 전달
- Given: `FX-NORMAL-MAINTAIN`이다.
- When: 결과에 도달한다.
- Then: 변경을 강요하지 않고 유지 이유와 차액을 표시한다.
### Scenario 3: 불완전 데이터
- Given: 부분 또는 캐시 없음 Fixture다.
- When: 계산한다.
- Then: 추천을 노출하지 않고 정확한 복구 안내를 제공한다.
### Scenario 4: 스코프 경계
- Given: 온보딩·결과 화면이다.
- When: 사용자가 진행한다.
- Then: 해지·전환 대행을 제공하지 않음을 확인할 수 있다.

## Technical & Non-Functional Constraints
- 실제 금융 데이터·실제 카드 신청을 사용하지 않는다.
- 테스트는 Preview와 로컬에서 반복 가능해야 한다.

## Definition of Done
- [ ] UX-V-001~006과 M1 7개 필수 경로가 모두 매핑됐다.
- [ ] 정상·유지·실패 E2E가 green이다.
- [ ] 실패 screenshot/trace와 실행 명령이 보존된다.
- [ ] NFR 검증 전 기능 합격 증거로 연결된다.

## Dependencies & Interactions
- Depends on: M1 DATA/API/MOCK, COMMAND-001~004·007·008·010, QUERY-001·002·004, TEST-001~003·005
- Blocks: M1 합격, NFR 배포 검증, Step 5 UX·Frontend 완료
- 변경 전파: 핵심 사용자 흐름·Fixture·API·UI

## Open Decisions
- E2E 도구와 Preview 테스트 계정 전략

## 결론
M1이 기술 데모가 아니라 사용자가 유지 또는 변경 판단을 이해하는 제품임을 전 구간으로 검증한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
