# Step 3 AC 기반 TEST TASK 인덱스

## 개요

SRS의 기능 인수조건을 실행 가능한 테스트 코드 작성 TASK로 변환한다. TEST-001~005는 DATA·API·Mock·승인 정책에만 의존해 구현 전에 실패 기준을 고정하고, 구현 TASK의 DoD를 차단한다. TEST-006·007은 구현 후 전체 사용자 여정을 검증한다. 테스트 파일을 작성했다는 사실이 아니라 GWT의 관측 가능한 결과와 임계치를 자동 검증해야 완료된다.

## 테스트 묶음

| TASK | 대상 | SRS 검증 ID | 주요 로직 |
|---|---|---|---|
| TEST-001 입력·플랫폼 계약 | 입력, 제약, Adapter, 초기값 | TC-FUNC-001A/B·002·003A/B·008 | COMMAND-001·002, QUERY-001 |
| TEST-002 계산·게이팅·배분 회귀 | 세 시나리오, Rule, 후보, 배분 | TC-FUNC-004~006, TC-AC-A-01~03, TC-AC-GATE-01 | COMMAND-003·007 |
| TEST-003 근거·AI·스코프·정렬 | Evidence, fallback, 금지어, 단계 정렬 | TC-FUNC-007·009·011, TC-AC-B-01~03, TC-AC-C-04 | QUERY-002, COMMAND-008 |
| TEST-004 선택·이행 상태전이 | 선택, 자기보고, 관측 상태 | TC-FUNC-010A~G, TC-AC-C-01~03 | COMMAND-004~006, QUERY-003 |
| TEST-005 인가·소유권·비밀정보 | Actions, Routes, Admin, Cron | REQ-SEC-001~005, TC-NF-005·008 | 모든 Command/Query |
| TEST-006 M1 핵심 사용자 여정 E2E | 입력→계산→근거→선택 | M1 UX-V-001~006 | M1 Command/Query 전체 |
| TEST-007 M2 자동화·이행 E2E | 초기값, AI, Cron, Outcome | E3·E7a/E7b | M2 Command/Query 전체 |

## 공통 작성 규칙

- 정상·경계·실패 Fixture를 테스트 본문에 고정하고 요구사항 ID를 테스트명에 포함한다.
- 시간 의존 로직은 fake clock을 사용하고 30일·24시간을 실제 대기로 검증하지 않는다.
- 외부 Adapter·Gemini 장애는 Mock으로 재현하되 schema는 실제 계약과 동일해야 한다.
- TEST-001~005의 실패 기준선이 작성되기 전에는 연결 Command/Query 구현을 완료로 표시할 수 없고, 구현 후 해당 테스트가 통과해야 DoD를 완료할 수 있다.

## 결론

7개 테스트 TASK가 13개 기능 요구사항과 M1/M2 핵심 경로를 담당한다. 단위·계약 테스트는 구현에 선행하고 E2E는 구현에 후행한다. Step 4의 NFR TASK는 이 테스트를 재사용해 성능·보안·운영 임계치를 검증한다.

## 출처
- `SRS-Drafts/SRS_CardFit_v1.6_GPT-5.6-SOL.md` 4.1, 5.2~5.4, 9장
