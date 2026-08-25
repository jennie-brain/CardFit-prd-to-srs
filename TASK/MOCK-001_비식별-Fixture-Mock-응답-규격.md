---
name: CardFit Mock Contract Task
about: 프론트엔드·계약 테스트용 비식별 Fixture와 Mock Adapter 규격
title: "[Mock] MOCK-001: 비식별 Fixture·Mock 응답 규격"
labels: 'mock, fixture, contract, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — MOCK-001 비식별 Fixture·Mock 응답 규격

## Summary

- 목적: 백엔드 완성 전에도 프론트엔드와 테스트가 모든 핵심 상태를 재현하도록 versioned Fixture와 Mock Adapter 응답을 정의한다.
- 사용자 가치: 정상 화면뿐 아니라 부분 데이터·오래된 데이터·동의 오류·유지 결론을 조기에 검증한다.

## References (Spec & Context)

- SRS: 1.2.1 M0~M2, 3.2~3.4, REQ-FUNC-002·004·010, 6.2.5, 9.4~9.5
- PRD: F-02·03·04·06·11·13
- 선행: DATA-001·002, API-001·003; M2 관측 Fixture는 DATA-003

## Scope

- 합성 사용자 3종 이상, 카드 10~20개, 혜택 Rule 2~3종 seed
- Platform Adapter와 계산 API의 정상·경계·실패 응답
- LOW·BASE·HIGH, 현재 조합 유지, 변경 추천, 근거 ≥6, 부분 계산
- M2 이행 자기보고·관측·식별 충돌 Fixture
- 고정 clock·ID·Rule 버전으로 재현 가능한 결과

## 필수 Fixture 카탈로그

| ID | 상태 | 기대 사용처 |
|---|---|---|
| `FX-NORMAL-CHANGE` | 완전·최신 데이터, 변경 임계 통과 | 계산·결과·배분 UI |
| `FX-NORMAL-MAINTAIN` | 변경 차액 임계 미달, 현재 조합 유지 | 게이팅·유지 UI |
| `FX-LOW-BASE-HIGH-SPLIT` | 시나리오별 최적 조합이 다름 | 3개 탭·조건부 결론 |
| `FX-PARTIAL` | 일부 기관/필수 데이터 누락 | 추천 중단·부분 상태 |
| `FX-STALE-CACHED` | Adapter 장애, 유효 캐시 존재 | 최근 데이터 경고·기준일 |
| `FX-NO-CACHE` | 최초 연동 실패, 캐시 없음 | 결과 미노출 |
| `FX-CONSENT-EXPIRED` | 동의 만료 | 계산 400 |
| `FX-DISCONNECTED` | 연결 해제 | 재연결 안내 |
| `FX-RULE-STALE-7D` | Rule 갱신 7일 초과 | 최신성 경고 |
| `FX-RULE-STALE-30D` | Rule 갱신 30일 초과 | 계산 대상 제외 |
| `FX-EVIDENCE-UNDER-6` | 근거 6항목 미만 | evidence 거부 |
| `FX-OUTCOME-CONFLICT` | 자기보고 완료·관측 충돌 | M2 독립 상태 |
| `FX-OUTCOME-INCONCLUSIVE` | 부분·오래됨·약한 식별 | M2 판정 불가 |
| `FX-CANCEL-TWO-OBS` | 24시간 간격 정상 미관측 2회 | M2 해지 추정 |
| `FX-MAINTAINED` | 유지 추천 카드 지속 보유 | 유지 준수 분리 |

## Task Breakdown

- [ ] Fixture manifest에 ID, 목적, SRS/AC, 기준 시각, Rule 버전을 기록한다.
- [ ] 모든 데이터가 합성·비식별임을 검증하는 생성 원칙을 정의한다.
- [ ] API-001/003 schema를 만족하는 typed Fixture를 작성한다.
- [ ] 고정 clock·seed·ID로 동일 결과 hash를 재현한다.
- [ ] 프론트엔드가 Fixture ID로 상태를 선택하는 개발 전용 진입점을 정의한다.
- [ ] M1 Fixture와 M2 관측 Fixture를 별도 폴더·manifest로 구분한다.
- [ ] Production build에서 Fixture 전환 UI와 Mock 자격정보가 제외되도록 한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 프론트엔드 독립 실행

- Given: 실제 Adapter와 계산 DB가 준비되지 않았다.
- When: 개발자가 M1 Fixture를 선택한다.
- Then: 입력→세 시나리오→유지/변경→배분→근거의 핵심 화면을 계약과 동일한 DTO로 실행한다.

### Scenario 2: 실패 상태 재현

- Given: 부분·오래됨·동의 만료·연결 해제 Fixture가 있다.
- When: 각각 실행한다.
- Then: 빈 성공 응답으로 바뀌지 않고 계약에 정의된 경고·중단·오류 상태를 재현한다.

### Scenario 3: 결정론적 재실행

- Given: 같은 Fixture ID와 Rule 버전, 기준 시각을 사용한다.
- When: 계산을 반복한다.
- Then: 결과 hash는 100% 일치한다.

### Scenario 4: Production 격리

- Given: Production build를 생성한다.
- When: 번들과 endpoint를 검사한다.
- Then: 개발용 Fixture 선택 경로와 실제와 유사한 비밀정보는 포함되지 않는다.

## Technical & Non-Functional Constraints

- 실제 개인·계정·카드번호·거래내역을 복제하지 않는다.
- Fixture는 TypeScript schema 검증을 통과해야 하며 API 계약을 재정의하지 않는다.
- Mock Adapter 호출 비용은 0원으로 기록한다.
- M1 Preview는 Fixture와 읽기 전용 설정을 사용하고 Production DB 쓰기를 금지한다.
- 오류·지연 Fixture는 장시간 sleep 대신 제어 가능한 fake timer/latency 설정을 사용한다.

## Definition of Done

- [ ] 필수 Fixture 15종이 manifest와 함께 존재한다.
- [ ] API-001·003 계약 검증 및 핵심 M1 smoke 흐름이 통과한다.
- [ ] 각 Fixture가 연결하는 REQ-FUNC/AC가 추적된다.
- [ ] Production 격리 검사가 통과한다.
- [ ] 프론트엔드가 백엔드 완성 없이 모든 M1 상태를 구현할 수 있다.

## Dependencies & Interactions

- Depends on: DATA-001·002, API-001·003; M2 Fixture는 DATA-003·API-004
- Blocks: DATA-003 시뮬레이션, 프론트엔드 병렬 개발, 계약·통합·E2E 테스트
- Interacts with: 모든 Step 2 로직, Step 3 TEST, Step 5 UI
- 변경 전파: DATA/API schema 변경 시 Fixture validation과 예상 hash를 함께 갱신한다.

## Open Decisions

- [ ] 3개 대표 사용자 프로필과 카드 10~20개의 구체적 합성값
- [ ] Fixture 선택 방식(환경 변수, query parameter, 개발 전용 페이지)
- [ ] 3개 시나리오 배율 확정 전 Fixture 예상 결과 관리 방식

## 결론

MOCK-001은 백엔드 대기 시간을 줄이는 동시에 실패 상태를 제품 설계 초기에 드러낸다. Mock은 실제 연동 성공의 증거가 아니라 동일 계약을 검증하는 독립 MVP 도구다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`
