# AI TASK 추출·검토 방법론: Macro → Micro 파이프라인

| 항목 | 내용 |
| --- | --- |
| 목적 | SRS를 전체 구조 식별(Macro)과 개별 상세 추출(Micro)로 나누어 일관된 구현 TASK로 변환한다. |
| 기준 관점 | 시스템적 사고(System Thinking), Contract First, CQRS, Test First |
| 입력 | 승인된 PRD·SRS, 기술 제약, 정책 결정, 기존 TASK 인덱스 |
| 출력 | 시스템 구조 지도, 추출 대기열, REQ별 TASK 묶음, 의존성 그래프, 검토 보고서 |
| 적용 대상 | AI 에이전트가 수행하는 모든 TASK 생성·수정 작업 |
| 상태 | Proposed |

## 1. 설계 목적

하나의 프롬프트로 SRS 전체를 읽고 곧바로 세부 이슈를 생성하면, AI 에이전트는 요구사항마다 서로 다른 데이터 구조를 상상하거나 전역 의존성을 놓칠 수 있다. 이를 방지하기 위해 TASK 추출을 다음 두 단계로 분리한다.

1. Macro 단계에서는 시스템 전체의 경계, 데이터 흐름, Contract, 요구사항 관계와 실행 순서를 식별한다.
2. Micro 단계에서는 Macro 산출물을 고정 입력으로 사용하여 각 REQ를 닫힌 문맥의 TASK 묶음으로 추출한다.

Micro 단계는 Macro 기준선을 임의로 변경할 수 없다. 새로운 엔터티나 API가 필요하면 즉시 만들지 않고 Macro 재검토 요청을 생성한다.

## 2. 파이프라인 전체 구조

```text
입력 검증
  -> Macro 구조 식별
  -> Macro 교차 검토
  -> Macro 기준선 승인
  -> REQ 추출 대기열 생성
  -> Micro REQ별 상세 추출
  -> Micro 4대 게이트 검토
  -> 전역 중복·충돌 검토
  -> TASK 인덱스 및 의존성 그래프 확정
```

단계별 완료 조건을 통과하지 못하면 다음 단계로 진행하지 않는다. 모든 산출물은 생성 직후와 수정 직후에 Contract, Logic, Test, NFR 네 가지 질문으로 반복 검토한다.

## 3. 공통 입력과 단일 진실 공급원

파이프라인을 시작하기 전에 다음 입력을 고정한다.

| 입력 | 필수 내용 | 처리 규칙 |
| --- | --- | --- |
| SRS 기준선 | 버전, 커밋, REQ·AC·NFR ID | 추출 중 기준선 변경 금지 |
| 정책 기준선 | 계산·상태 전이·용어 결정 | 미승인 정책은 `Blocked`로 표시 |
| 기술 제약 | 프레임워크, DB, 배포, 보안 | 구현 선택지보다 우선 적용 |
| 기존 TASK 인덱스 | ID, 유형, 상태, 의존성 | 중복 TASK 생성을 방지 |
| 추적성 레지스트리 | REQ → Contract·Logic·Test·NFR | 누락 검사의 기준으로 사용 |

모든 프롬프트에는 기준선 버전과 허용된 입력 파일을 명시한다. 근거가 없는 필드, API, 정책, 기술 스택은 추론하여 확정하지 않는다.

## 4. 1단계: 전체 구조 식별(Macro)

### 4.1 Macro 단계의 목표

Macro 단계에서는 개별 구현 이슈를 상세하게 작성하지 않는다. 전체 시스템이 어떤 경계와 계약으로 구성되는지 식별하고, Micro 단계가 따라야 할 지도와 추출 순서를 만든다.

### 4.2 Macro 분석 순서

1. SRS의 데이터 모델, 엔터티, 인터페이스, 외부 연동 섹션을 먼저 스캔한다.
2. 시스템 경계와 외부 Actor, Adapter, 저장소를 식별한다.
3. 핵심 엔터티, 값 객체, enum, 상태 전이를 식별한다.
4. API Request·Response DTO와 오류 계약 후보를 식별한다.
5. 주요 데이터 흐름과 Read·Write 경계를 표시한다.
6. AC와 NFR을 관련 REQ에 연결한다.
7. Contract 선행 의존성을 기준으로 REQ 추출 순서를 결정한다.
8. 미확정 정책과 충돌을 차단 항목으로 기록한다.

### 4.3 Macro 산출물

| 산출물 | 필수 내용 |
| --- | --- |
| System Context Map | Actor, 시스템 경계, 외부 서비스, Adapter |
| Domain Map | 도메인, 책임, 소유 엔터티, 경계 간 통신 |
| Contract Registry | DB Schema 후보, DTO, enum, 오류 계약, 버전 |
| Data Flow Map | 데이터 원천, 변환, 저장, 조회, 폐기 흐름 |
| State Mutation Map | Query, Command, Pure Calculation 구분 |
| REQ Dependency Graph | REQ 간 선후 관계와 차단 조건 |
| AC·NFR Trace Matrix | REQ별 AC, 성능, 보안, 개인정보 요구 |
| Extraction Queue | Micro 처리 순서와 병렬화 가능 묶음 |
| Decision Gap Log | TBD, 충돌, 사용자 확인이 필요한 항목 |

### 4.4 Macro 프롬프트 M-01: 구조 분석

```text
[역할]
당신은 SRS를 구현 TASK로 변환하기 전에 시스템 전체 구조를 식별하는 아키텍처 분석 에이전트다.

[입력]
- SRS 기준선: {srs_path}@{commit}
- 정책 기준선: {policy_paths}
- 기술 제약: {constraints}
- 기존 TASK 인덱스: {task_index}

[작업]
1. 기능 목록보다 데이터 모델과 인터페이스를 먼저 분석하라.
2. Actor, 시스템 경계, 도메인, 엔터티, 상태, API, Adapter를 식별하라.
3. 모든 데이터 흐름을 Read, Write, Pure Calculation으로 분류하라.
4. 각 REQ에 AC와 NFR을 연결하라.
5. Contract 선행 의존성에 따라 Micro 추출 대기열을 작성하라.
6. 근거가 없거나 충돌하는 사항은 확정하지 말고 Decision Gap으로 기록하라.

[금지]
- 상세 구현 TASK를 발급하지 않는다.
- SRS에 없는 필드와 API를 사실로 확정하지 않는다.
- Query와 Command를 하나의 흐름으로 합치지 않는다.

[출력]
Macro 산출물 9종과 모든 항목의 SRS 근거 위치를 출력하라.
```

### 4.5 Macro 프롬프트 M-02: 교차 검토

```text
[역할]
당신은 Macro 구조 분석 결과의 누락과 충돌을 찾는 검토 에이전트다.

[입력]
- 원본 SRS와 정책 기준선
- M-01 산출물

[검토]
1. 모든 REQ가 Domain과 Contract에 연결됐는가?
2. 모든 Write에 선행 데이터 계약과 상태 전이가 있는가?
3. 모든 AC가 테스트 가능하며 관련 REQ에 연결됐는가?
4. 모든 NFR이 적용 대상과 측정 방법을 가지는가?
5. 순환 의존성, 중복 Contract, 이름 충돌이 있는가?
6. Micro 단계가 임의 설계해야 하는 빈칸이 남아 있는가?

[출력]
- PASS 또는 REVISE
- 누락·충돌 목록
- 수정해야 할 Macro 산출물과 근거
- 승인 가능한 Extraction Queue
```

### 4.6 Macro 완료 게이트

- 모든 REQ가 Extraction Queue에 한 번만 존재한다.
- 모든 핵심 엔터티와 API 후보가 Contract Registry에 있다.
- 모든 상태 변경 흐름이 Query와 Command로 분리돼 있다.
- 모든 AC와 NFR이 하나 이상의 REQ에 연결돼 있다.
- Decision Gap이 명시되고 미확정 항목의 하위 TASK가 차단돼 있다.
- M-02 결과가 `PASS`다.

## 5. 2단계: 개별 상세 추출(Micro)

### 5.1 Micro 단계의 목표

Micro 단계에서는 Extraction Queue의 REQ 하나 또는 강하게 결합된 최소 REQ 묶음만 처리한다. 각 실행은 동일한 Macro 기준선을 참조하며, 다음 순서로 TASK를 추출한다.

```text
Contract -> Fixture -> Test -> Query·Command·Pure Calculation -> NFR -> UI·Integration
```

### 5.2 Micro 입력 묶음

- 대상 REQ 본문과 연결된 AC·NFR
- 관련 Sequence와 데이터 모델
- 승인된 Contract Registry 항목
- 관련 정책 결정
- 선행 TASK와 기존 TASK 인덱스
- 허용된 기술 제약
- Macro Decision Gap과 차단 상태

### 5.3 Micro 프롬프트 μ-01: REQ 상세 추출

```text
[역할]
당신은 하나의 REQ를 닫힌 문맥의 실행 가능한 TASK 묶음으로 변환하는 추출 에이전트다.

[대상]
- REQ: {req_id}
- REQ 본문: {req_text}
- 연결 AC·NFR: {trace_items}
- 승인 Macro 기준선: {macro_baseline}

[추출 순서]
1. 필요한 DB Schema, 도메인 타입, API DTO Contract TASK를 확인하거나 추출하라.
2. 결정적 Fixture와 Mock 데이터 TASK를 추출하라.
3. AC를 정상·예외·경계 조건의 자동화 테스트 TASK로 먼저 변환하라.
4. 비즈니스 로직을 Query, Command, Pure Calculation으로 분리하라.
5. 성능, 보안, 개인정보, 관측성 NFR TASK를 추출하라.
6. 마지막에 UI와 Integration TASK를 추출하라.

[각 TASK 필수 필드]
- Task ID와 단일 Task Type
- Objective와 SRS Trace
- Depends On
- Reads, Writes, Side Effects
- Transaction Boundary와 Idempotency
- Input·Output Contract
- Test Gate
- NFR Gate
- Out of Scope

[규칙]
- 한 TASK는 하나의 상태 변경 목적만 가진다.
- Query의 Writes는 반드시 None이다.
- Pure Calculation은 DB 저장과 외부 Side Effect를 갖지 않는다.
- Command는 상태 전이, 트랜잭션, 멱등성을 명시한다.
- 구현 TASK보다 테스트 TASK를 먼저 배치한다.
- Macro에 없는 Contract가 필요하면 생성하지 말고 MACRO-CHANGE-REQUEST를 출력한다.
```

### 5.4 Micro 프롬프트 μ-02: 4대 게이트 반복 검토

```text
[역할]
당신은 새로 생성되거나 수정된 TASK 묶음을 반복 검토하는 품질 게이트 에이전트다.

[반복 질문]
1. Contract: 이 기능에 필요한 DB 테이블과 API DTO 이슈가 발급됐는가?
2. Logic: 비즈니스 로직이 데이터를 조회하는 Read와 변경하는 Write로 나뉘었는가?
3. Test: AI가 완료를 스스로 증명할 자동화 테스트 코드 이슈가 존재하는가?
4. NFR: 성능과 보안을 보장하는 설정·검증 이슈가 누락되지 않았는가?

[판정]
- 네 질문이 모두 YES이면 PASS다.
- 하나라도 NO이면 REVISE이며 누락 TASK 초안을 제시한다.
- NOT APPLICABLE은 SRS 근거와 사유가 있을 때만 허용한다.
- 수정된 산출물은 네 질문을 처음부터 다시 검토한다.

[출력]
- 게이트별 YES/NO/N/A와 근거
- 중복·충돌·과도한 범위
- 추가 또는 분리할 TASK
- 최종 PASS/REVISE
```

### 5.5 Micro 프롬프트 μ-03: 전역 정합성 검토

```text
[역할]
당신은 PASS된 Micro TASK 묶음을 전체 시스템 기준선과 대조하는 통합 검토 에이전트다.

[검토]
1. 기존 TASK와 ID, 목적, Writes 범위가 중복되지 않는가?
2. 동일 개념이 서로 다른 Schema, DTO, enum으로 정의되지 않았는가?
3. 의존성 그래프에 순환이 없는가?
4. 모든 구현 TASK에 Test Gate와 NFR Gate가 있는가?
5. 같은 엔터티를 변경하는 Command의 상태 전이가 충돌하지 않는가?
6. REQ·AC·NFR 추적성에 누락이 없는가?

[출력]
- MERGE 또는 REVISE
- 통합 가능한 TASK 목록
- 충돌과 해결 대상
- 갱신할 TASK 인덱스 및 추적성 행
```

### 5.6 Micro 완료 게이트

- 대상 REQ가 Contract, Logic, Test, NFR 네 영역에 모두 매핑돼 있다.
- Query와 Command가 서로 다른 TASK다.
- 구현 TASK보다 관련 테스트 TASK가 먼저 추출돼 있다.
- 모든 구현 TASK에 Test Gate와 NFR Gate가 있다.
- μ-02가 `PASS`이고 μ-03이 `MERGE`다.
- TASK 인덱스와 추적성 레지스트리가 갱신돼 있다.

## 6. 산출물 생성·수정 반복 루프

자료가 새로 생성되거나 기존 자료가 수정될 때마다 다음 루프를 실행한다.

```text
산출물 생성 또는 수정
  -> Contract 검토
  -> Logic Read·Write 분리 검토
  -> Test 자동화 피드백 검토
  -> NFR 성능·보안 검토
  -> 중복·추적성 검토
  -> PASS 시 저장
  -> REVISE 시 보완 후 처음부터 재검토
```

검토 결과는 다음 형식으로 산출물 하단 또는 별도 레지스트리에 기록한다.

| Gate | 판정 | 근거 TASK | 누락·조치 |
| --- | :---: | --- | --- |
| Contract | YES/NO/N/A | CTR-* | 내용 |
| Logic | YES/NO/N/A | QRY-*, CMD-*, CAL-* | 내용 |
| Test | YES/NO/N/A | TST-*, E2E-* | 내용 |
| NFR | YES/NO/N/A | NFR-* | 내용 |

## 7. 오류 복구와 재진입 규칙

| 상황 | 처리 방법 |
| --- | --- |
| SRS에서 정책이 미확정됨 | Decision Gap을 만들고 관련 Micro 추출을 `Blocked`로 둔다. |
| Micro에서 새 엔터티가 발견됨 | `MACRO-CHANGE-REQUEST`를 생성하고 Macro Contract Registry를 재검토한다. |
| 동일 Writes 범위의 Command가 중복됨 | 통합하지 말고 상태 전이 책임을 비교해 하나로 합치거나 경계를 재정의한다. |
| 테스트 기대 결과를 정할 수 없음 | 구현하지 않고 정책 또는 Contract 결정 단계로 되돌린다. |
| NFR 대상이나 임계값이 불명확함 | 측정 방법과 Owner를 포함한 Decision Task를 만든다. |
| 기준 SRS가 변경됨 | 영향 REQ만 추적성 레지스트리로 식별하고 Macro부터 부분 재실행한다. |

## 8. 오케스트레이션 상태 모델

| 상태 | 의미 | 다음 상태 조건 |
| --- | --- | --- |
| `INPUT_READY` | 입력 기준선이 고정됐다. | M-01 실행 |
| `MACRO_DRAFTED` | 전체 구조 초안이 생성됐다. | M-02 검토 |
| `MACRO_APPROVED` | Macro 완료 게이트를 통과했다. | Micro 대기열 실행 |
| `MICRO_DRAFTED` | REQ별 TASK 묶음이 생성됐다. | μ-02 검토 |
| `MICRO_REVIEWED` | 4대 게이트를 통과했다. | μ-03 검토 |
| `MERGED` | 전역 인덱스에 반영됐다. | 다음 REQ 처리 |
| `REVISE` | 누락 또는 충돌이 발견됐다. | 해당 단계 수정 후 전체 게이트 재검토 |
| `BLOCKED` | 정책·Contract 결정이 필요하다. | 차단 항목 승인 후 재진입 |

## 9. 최종 품질 지표

| 지표 | 목표 |
| --- | ---: |
| REQ의 Extraction Queue 포함률 | 100% |
| REQ별 Contract 연결률 | 100% 또는 근거 있는 N/A |
| Read·Write 혼합 TASK 수 | 0건 |
| AC의 자동화 테스트 연결률 | 100% |
| 구현 TASK의 Test Gate 보유율 | 100% |
| 적용 대상 NFR의 검증 TASK 연결률 | 100% |
| 근거 없는 Schema·DTO 필드 수 | 0건 |
| TASK ID·Writes 범위 중복 | 0건 |
| 순환 의존성 | 0건 |

## 10. 운영 체크리스트

### Macro 실행 전

- [ ] SRS 버전과 커밋을 고정했다.
- [ ] 정책 및 기술 제약을 수집했다.
- [ ] 기존 TASK 인덱스를 읽었다.
- [ ] 산출물 경로와 ID 규칙을 정했다.

### Macro 승인 전

- [ ] 데이터 모델과 인터페이스를 기능보다 먼저 분석했다.
- [ ] Read, Write, Pure Calculation 흐름을 표시했다.
- [ ] 모든 REQ·AC·NFR을 추출 대기열에 연결했다.
- [ ] Decision Gap과 차단 대상을 기록했다.
- [ ] M-02 검토가 PASS다.

### Micro 산출물마다

- [ ] Contract 질문을 검토했다.
- [ ] Logic 질문을 검토했다.
- [ ] Test 질문을 검토했다.
- [ ] NFR 질문을 검토했다.
- [ ] Query의 Writes가 None이다.
- [ ] Command의 상태 전이·트랜잭션·멱등성이 있다.
- [ ] 자동화 테스트 TASK가 구현 TASK보다 먼저 배치됐다.
- [ ] μ-02가 PASS이고 μ-03이 MERGE다.

## 11. 버전 이력

| 버전 | 변경 내용 |
| --- | --- |
| v1.0 | TASK 추출을 Macro 구조 식별과 Micro 상세 추출로 분리하고, 다중 프롬프트·반복 검토·재진입 규칙을 정의했다. |
