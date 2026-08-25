---
name: CardFit API Contract Task
about: Mock과 실제 플랫폼 구현체가 공유하는 Adapter 계약
title: "[API] API-001: Platform Adapter 계약"
labels: 'api, contract, adapter, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK — API-001 Platform Adapter 계약

## Summary

- 목적: Identity·Consent·HeldCard·PastSpend·CardCatalog를 Mock과 Production 구현체가 같은 타입으로 제공하도록 경계를 정의한다.
- 사용자 가치: 외부 연동 상태가 불완전해도 빈 데이터로 오인하지 않고 정확한 경고 또는 중단 상태를 제공한다.

## References (Spec & Context)

- SRS: 3.2~3.4, REQ-FUNC-002, 6.2.5, ADR-004, 8.7.2
- 메서드: `getIdentity`, `getConsent`, `fetchHeldCards`, `fetchPastSpend`, `getCardCatalog`
- 선행: DATA-001

## Scope

- 공통 결과 envelope: `data_as_of`, `sync_status`, `completeness`, `source`
- 정상·부분·오래됨·동의 만료·철회·연결 해제·타임아웃 오류의 구분
- Mock/Production Adapter 선택을 서버 환경 변수 또는 의존성 주입으로 교체하는 계약
- 소비자 앱 내부 API를 추측하지 않는 포트 정의

## Task Breakdown

- [ ] 각 메서드 입력·성공 DTO·실패 결과를 schema로 정의한다.
- [ ] 빈 배열과 조회 실패를 구분하는 discriminated union을 정의한다.
- [ ] 동의 범위·리소스 소유권·데이터 기준일을 모든 호출에서 검증한다.
- [ ] Mock과 Production 구현체에 공통 계약 테스트를 적용할 수 있게 한다.
- [ ] timeout·재시도·호출량 제한 책임을 호출자와 Adapter 사이에 구분한다.
- [ ] 로그 허용 필드와 마스킹 필드를 정의한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 정상 플랫폼 응답

- Given: 동의가 유효하고 데이터 동기화가 완료됐다.
- When: 보유카드와 과거소비를 요청한다.
- Then: 데이터와 함께 기준일·동기화 상태·완전성·출처가 반환된다.

### Scenario 2: 부분 응답

- Given: 일부 기관 데이터가 누락됐다.
- When: Adapter가 결과를 반환한다.
- Then: 빈 배열 성공으로 변환하지 않고 `PARTIAL`과 누락 범위를 반환한다.

### Scenario 3: 만료된 동의

- Given: 동의 상태가 만료 또는 철회다.
- When: 데이터 조회를 요청한다.
- Then: 외부 조회를 수행하지 않고 명시적인 consent 오류를 반환한다.

### Scenario 4: 구현체 교체

- Given: 동일 Fixture 기반 계약 테스트가 있다.
- When: Mock Adapter를 Production Adapter로 교체한다.
- Then: 소비 서비스의 DTO·분기 코드를 변경하지 않고 같은 계약 테스트를 실행할 수 있다.

## Technical & Non-Functional Constraints

- Adapter와 자격정보는 Next.js server-only 모듈에 둔다.
- 실제 내부 엔드포인트·토큰·사용자 ID를 저장소나 Client bundle에 노출하지 않는다.
- 실패·부분 응답을 빈 컬렉션으로 변환하는 건수는 0건이어야 한다.
- 실제 Production Adapter는 M3 계약·보안·네트워크 승인 전 구현 완료로 간주하지 않는다.

## Definition of Done

- [ ] 5개 메서드와 공통 envelope schema가 고정됐다.
- [ ] 모든 상태를 나타내는 오류·품질 코드가 정의됐다.
- [ ] Mock Adapter 계약 테스트가 통과한다.
- [ ] 호출 로그에 동의 범위 대조와 민감정보 마스킹이 포함된다.
- [ ] Production 미확정 사항이 구현 가정으로 숨겨지지 않았다.

## Dependencies & Interactions

- Depends on: DATA-001
- Blocks: API-003, MOCK-001, 초기값·계산·관측 로직
- Interacts with: DATA-003, API-004, REQ-NF-005·006·007
- 변경 전파: DTO·상태 변경 시 Mock, 계산 fallback, UI 상태, 계약 테스트를 갱신한다.

## Open Decisions

- [ ] Production Adapter 인증·네트워크·동의 scope 계약
- [ ] 카드 상품의 안정적 식별키와 명시적 발급·해지 상태 의미
- [ ] timeout·재시도·호출당 비용 한도

## 결론

API-001은 독립 MVP와 실제 내부 확장 제안 사이의 교체 지점이다. Mock 성공을 실제 연동 성공으로 간주하지 않으면서도 후행 기능이 동일한 계약을 사용하도록 만든다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`

