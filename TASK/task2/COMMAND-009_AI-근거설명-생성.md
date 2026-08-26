---
name: CardFit Command Task
about: 결정론적 Evidence 기반 AI 설명 생성·캐시·fallback
title: "[Command] COMMAND-009: AI 근거 설명 생성"
labels: 'command, ai, priority:should, milestone:m2'
assignees: ''
---

# GitHub Project 용 TASK — COMMAND-009 AI 근거 설명 생성

## Summary
- 목적: 결정론적 Evidence를 변경하지 않고 Vercel AI SDK로 보조 설명을 생성·캐시하며 실패 시 정형 설명을 유지한다.
- REQ: REQ-AI-001~006, REQ-FUNC-007(M2 확장)

## References (Spec & Context)
- 계약: API-003, QUERY-002 CalculationResultView
- SRS: ADR-001, 8.10, 8.12
- 선행: COMMAND-003, QUERY-002

## Scope
- provider/model 환경변수, prompt 최소화, timeout·429·5xx, Evidence hash 캐시
- 계산값·추천 조합 생성·수정은 범위 밖

## Task Breakdown
- [ ] Evidence DTO만 입력받는 server-only AI Adapter를 구현한다.
- [ ] `AI_PROVIDER`·`AI_MODEL`로 provider/model을 선택한다.
- [ ] prompt에서 직접 식별정보·원본 금융 데이터를 제거한다.
- [ ] Evidence hash 기준 1회 생성·캐시와 비용 event를 기록한다.
- [ ] timeout·429·5xx에는 unavailable과 정형 fallback을 반환한다.

## Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 생성
- Given: 공개 가능한 Evidence와 활성 AI 설정이다.
- When: 설명을 생성한다.
- Then: Evidence 범위 안의 설명만 반환하고 계산 DTO는 변경하지 않는다.
### Scenario 2: AI 장애
- Given: provider가 timeout·429·5xx를 반환한다.
- When: 생성한다.
- Then: AI만 unavailable이고 계산·근거·선택은 정상이다.
### Scenario 3: 모델 교체
- Given: 환경 변수의 model을 바꾼다.
- When: 재배포한다.
- Then: 애플리케이션 코드 변경 없이 새 model을 사용한다.

## Technical & Non-Functional Constraints
## Execution Contract
- Reads: 계산 결과·근거 단계·품질 상태
- Writes: 설명 결과와 근거 참조 ID
- Side Effects: 생성 모델 호출(민감 원문 비전달)
- Transaction Boundary: 생성 결과와 참조 메타데이터 저장
- Idempotency: result hash와 prompt/rule version
- Retry Policy: 모델 timeout만 제한 재시도, 정책 차단은 중단

## Verification Gates
- Test Gate: TEST-008 근거 누락·불일치·재현 시나리오 통과
- NFR Gate: NFR-003 latency, NFR-004 데이터 마스킹 검증
- Evidence Location: prompt hash, citation fixture, redaction log

- 별도 Python/AI 서버와 Gemini REST 직접 호출을 금지한다.
- 월 비용 80/100% 중단 규칙과 직접 식별정보 0건을 준수한다.

## Definition of Done
- [ ] TEST-003·007 AI 정상·장애·마스킹 테스트가 통과한다.
- [ ] NFR-004·006 보안·비용 기준을 충족한다.
- [ ] AI 비활성 상태에서도 UI-006이 완전하다.

## Dependencies & Interactions
- Depends on: API-003, QUERY-002 CalculationResultView, TEST-003 AI 실패 기준선, COMMAND-003
- Blocks: UI-006 M2 확장, TEST-007 AI 경로
- 변경 전파: API-003·AI prompt·캐시·비용 원장·UI

## Open Decisions
- AI timeout, 캐시 TTL, 설명 재생성 정책

## 결론
AI를 핵심 계산에서 분리된 실패 가능한 설명 생성 Command로 명시한다.

## 출처

## Decision Log
- 2026-08-26: Step 2 표준 템플릿 적용. 설명은 계산 근거 참조 ID만 사용하고 민감 원문을 모델에 전달하지 않음.
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md`
