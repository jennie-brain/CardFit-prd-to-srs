---
name: CardFit Feature Task
about: CardFit SRS 기반의 구현·검증 가능한 개발 태스크 명세
title: "[Feature] REQ-FUNC-004: 시나리오 계산"
labels: 'feature, fullstack, priority:must, milestone:m1'
assignees: ''
---

# GitHub Project 용 TASK 템플릿

## 개요

이 문서는 CardFit의 개별 개발 태스크를 GitHub Project Issue로 작성할 때 사용하는 풀버전 템플릿이다. 아래 본문은 최신 기준선인 `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`의 `REQ-FUNC-004 시나리오 계산`을 대표 예시로 채웠다. 실제 Issue를 만들 때에는 요구사항 ID, 참조 위치, 작업 범위, 인수 기준, 의존성을 해당 태스크에 맞게 교체해야 한다.

## 목차

1. Summary
2. References
3. Scope
4. Task Breakdown
5. Acceptance Criteria
6. Technical & Non-Functional Constraints
7. Definition of Done
8. Dependencies & Interactions
9. Open Decisions
10. 결론
11. 출처

## Summary

- 기능명: `[REQ-FUNC-004] 시나리오 계산`
- 목적: 사용자가 입력한 미래지출과 카드 제약조건을 바탕으로 카드별 실적구간·혜택한도·연회비를 반영한 계산 결과를 제공한다.
- 사용자 가치: 사용자는 과거 소비만으로 단정된 추천이 아니라 앞으로의 지출 계획을 반영한 유지·변경 판단의 기초를 얻는다.
- 구현 단계: `M0 핵심 가치 프로토타입 → M1 저장 가능한 포트폴리오 MVP`
- 우선순위: `Must`

## References (Spec & Context)

> **AI Agent & Dev Note:** 작업을 시작하기 전에 아래 기준선과 연결 요구사항을 먼저 읽고, 서로 충돌하면 임의로 구현하지 말고 `Open Decisions`에 기록한다.

- SRS 기능 요구사항: `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`의 `4.1 기능 요구사항` 중 `REQ-FUNC-004`
- 시퀀스 다이어그램: 같은 문서의 `3.6.1 시나리오 계산 + Net Benefit 게이팅`
- API 배치: 같은 문서의 `8.10 Next.js 인터페이스 배치` 중 `POST /api/calculations`
- 데이터 모델·ERD: 같은 문서의 `6.2 ERD 및 데이터 사전`, `6.4 데이터베이스 스키마 개요`
- 비기능 요구사항: 같은 문서의 `REQ-NF-001`, `REQ-NF-003`, `REQ-NF-005`, `REQ-NF-006`
- 기술 제약: 같은 문서의 `8.7 구현 기술 제약`, `8.9 기술 요구사항`, `8.11 Prisma·Supabase 구현 기준`
- 선행 계약 태스크: `[생성 후 DATA/API/MOCK 태스크 번호 기입]`

## Scope

### In Scope

- 미래지출·제약조건 요청값의 서버 측 검증
- 확정된 `rule_version`을 사용하는 결정론적 계산
- 카드별 실적구간·혜택한도·연회비 반영
- 정상 결과와 실패·부분 데이터 상태를 구분하는 응답 계약 준수
- M1에서 계산 ID·결과 해시·규칙 버전·시각·오류 코드 저장

### Out of Scope

- Gemini가 계산값이나 추천 결론을 결정하는 기능
- 카드 발급·해지·전환 대행
- 소비자용 뱅크샐러드 내부 API의 직접 호출
- M2의 자동 이행 관측과 Vercel Cron 구현
- SRS 8.5에서 확정되지 않은 Net Benefit 세부 규칙의 임의 결정

## Task Breakdown (실행 계획)

- [ ] 선행 DATA/API/MOCK 계약과 SRS의 필드·상태·오류 정의가 일치하는지 확인한다.
- [ ] 요청·응답 schema와 서버 측 입력 검증을 구현한다.
- [ ] 실적구간·혜택한도·연회비 계산을 순수 도메인 함수로 구현한다.
- [ ] Mock Platform Adapter의 정상·부분·오래된 데이터·장애 Fixture를 연결한다.
- [ ] `POST /api/calculations` Route Handler에서 세션·소유권·입력값을 검증한다.
- [ ] M1 범위의 계산 메타데이터를 Prisma로 저장한다.
- [ ] 정상·경계·실패 사례에 대한 단위·계약·통합 테스트를 작성한다.
- [ ] p95 응답시간, 계산 오류율, 재계산 일치 여부를 검증한다.
- [ ] 구현으로 확정되거나 변경된 계약을 SRS 또는 연결 명세에 역반영한다.

## Acceptance Criteria (BDD/GWT)

### Scenario 1: 유효한 미래지출로 계산 성공

- Given: 유효한 미래지출 항목이 1개 이상이고 최대 카드 수·연회비 상한·신규 발급 허용 여부가 유효하게 입력되어 있다.
- And: 사용할 카드 규칙의 `rule_version`과 기준일이 확인되어 있다.
- When: 사용자가 `POST /api/calculations`로 계산을 요청한다.
- Then: 시스템은 실적구간·혜택한도·연회비가 반영된 결과를 p95 5초 이내에 반환한다.
- And: 동일 입력과 동일 `rule_version`의 결과 해시는 100% 일치한다.

### Scenario 2: 미래지출이 없는 계산 요청

- Given: 미래지출 항목이 0개이다.
- When: 사용자가 계산을 요청한다.
- Then: 시스템은 HTTP 400과 표준 오류 코드를 반환한다.
- And: 과거 소비만으로 계산한 결과를 생성하거나 노출하지 않는다.

### Scenario 3: Platform Adapter 일시 장애와 유효한 캐시 존재

- Given: 플랫폼 동의는 유효하지만 Adapter가 지연 또는 오류를 반환한다.
- And: 직전에 정상 확인된 카드·소비 데이터가 존재한다.
- When: 사용자가 계산을 요청한다.
- Then: 시스템은 최근 확인된 데이터로 계산을 계속한다.
- And: 응답과 UI에 `최근 확인된 데이터 기준` 경고와 데이터 기준일을 누락 없이 제공한다.

## Technical & Non-Functional Constraints

- 아키텍처: Next.js App Router 단일 풀스택으로 구현하며 별도 백엔드 서버를 만들지 않는다.
- 서버 경계: 계산 HTTP 계약은 Route Handler에서 처리하고 Prisma·비밀정보·Adapter 자격정보는 `server-only` 경계 밖으로 노출하지 않는다.
- 데이터: M1부터 Prisma schema·migration과 로컬 Supabase CLI PostgreSQL을 사용한다.
- 결정성: Gemini는 계산값과 추천 결론에 관여하지 않으며 동일 입력·동일 규칙 버전은 동일 결과를 반환한다.
- 성능: `POST /api/calculations` 응답시간 p95는 5초 이하여야 한다.
- 신뢰성: 계산 오류율은 0.1% 이하이고 동일 조건 재계산 불일치는 0건이어야 한다.
- 보안: 실제 인증정보·토큰·내부 사용자 ID와 원본 금융 응답 전체를 CardFit DB에 저장하거나 로그에 출력하지 않는다.
- 최신성: 규칙 갱신 지연이 7일을 초과하면 경고하고, 30일을 초과하면 해당 카드를 계산에서 제외한다.
- 비용: 외부 호출은 SRS의 단계별 비용 상한과 중단 규칙을 준수한다.

## Definition of Done (DoD)

- [ ] 모든 Acceptance Criteria를 자동 테스트 또는 명시된 수동 검증으로 입증했다.
- [ ] 단위 테스트, 계약 테스트, Route Handler 통합 테스트가 추가되고 통과했다.
- [ ] `next lint`에 해당하는 프로젝트 lint 명령, type-check, test, `next build`가 통과했다.
- [ ] Prisma migration과 seed가 로컬 Supabase에서 재현된다(M1 태스크인 경우).
- [ ] 브라우저 번들·응답·로그에 DB URL, Supabase service role key, Gemini key, 플랫폼 자격정보가 포함되지 않는다.
- [ ] API·데이터 계약과 오류 코드가 연결 명세에 반영되었다.
- [ ] 요구사항 ID와 테스트 증거의 추적 링크가 GitHub Issue에 기록되었다.
- [ ] 미확정 사항을 임의 구현하지 않았으며 남은 결정은 `Open Decisions`에 기록했다.

## Dependencies & Interactions

- Depends on: 데이터 모델 계약, 계산 요청·응답 API 계약, Mock Platform Adapter·Fixture 규격, 카드 규칙 기준선
- Interacts with: `REQ-FUNC-001A`, `REQ-FUNC-002`, `REQ-FUNC-003A`, `REQ-FUNC-005`, `REQ-FUNC-006`, `REQ-FUNC-007`
- Blocks: Net Benefit 게이팅, 결제수단 배분, 근거 공개, 결과 UI, 핵심 E2E 테스트
- 병렬 작업 조건: 프론트엔드는 API schema와 Mock 응답이 고정된 뒤 백엔드 구현과 병렬 진행할 수 있다.
- 변경 전파 규칙: 요청·응답·오류·상태·엔터티 계약 변경 시 소비 태스크와 Mock, 테스트 Fixture를 함께 갱신한다.

## Open Decisions

- [ ] SRS 8.5의 Net Benefit 계산 규칙 9개 항목이 모두 확정되었는가?
- [ ] API 오류 코드와 부분 데이터 응답의 필드명이 계약 문서에 확정되었는가?
- [ ] M1에서 저장할 계산 메타데이터와 보존기간이 승인되었는가?

## 결론

이 템플릿은 기능 설명만 나열하지 않고 SRS 근거, 작업 범위, 정상·실패 인수 기준, 기술·비기능 제약, 선후행 관계와 미확정 결정을 하나의 실행 단위로 묶는다. 개별 TASK를 만들 때 대표 예시의 값은 그대로 복사하지 않고 해당 요구사항과 선행 계약에 맞게 모두 교체한다.

## 출처

- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
- `PRD/PRD_CardFit_v1.3.md`

