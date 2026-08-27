/**
 * CardFit 로컬 시각 프로토타입 후보(candidate) ViewModel.
 *
 * 이 파일은 `SPEC-001` 승인 계약이 아니다. `docs/tasks/task1/prototype-visual-spec.md` §4의
 * 타입 스케치를 구현한 **후보**이며, `SPEC-001`이 확정되면 화면보다 이 파일과
 * `features/cardfit-prototype/fixtures/`을 먼저 계약에 맞춘다.
 *
 * 규칙(`.agents/rules/006-prototype-visual-scope.md`)
 * - 화면이 바인딩하는 데이터 모양의 단일 진입점은 이 파일이다.
 * - 컴포넌트 파일 안에 화면 전용 데이터 타입을 다시 정의하지 않는다.
 * - 영속 엔터티나 API DTO를 흉내 내지 않고 화면이 읽고 판단하는 최소 필드만 둔다.
 */

/** 공통 화면 상태 7종. 임의의 문자열을 추가하지 않는다. (spec §4.2) */
export type PrototypeScreenStatus =
  | "loading"
  | "empty"
  | "partial"
  | "stale"
  | "error"
  | "unavailable"
  | "success";

/** 모든 Fixture가 포함하는 메타데이터. (spec §4.3 / §5.1) */
export interface PrototypeMetaViewModel {
  fixtureId: string;
  status: PrototypeScreenStatus;
  dataAsOf: string | null;
  isExample: true;
}

/* ------------------------------------------------------------------ *
 * 스코프 고지 (spec §7)
 * ------------------------------------------------------------------ */

/**
 * `COMMAND-008` 승인 전의 후보 고지 문구. 후보 지위를 화면에 표시하지 않고
 * 문서와 이 주석으로만 관리한다. (spec §7.1 / §7.6)
 */
export interface ScopeNoticeViewModel {
  title: string;
  body: string[];
}

/* ------------------------------------------------------------------ *
 * /plan — 미래지출 입력과 카드 조건 (spec §8)
 * ------------------------------------------------------------------ */

/** 지출 형태. 증가·감소 방향은 사용자에게 묻지 않는다. (spec §8.9) */
export type FutureSpendKind = "ONE_TIME" | "MONTHLY";

/** 선택형 대분류. `OTHER`에서만 직접 입력을 허용한다. (spec §8.4) */
export type FutureSpendCategoryId =
  | "HOUSING"
  | "FURNITURE"
  | "WEDDING"
  | "TRAVEL"
  | "TRANSPORT"
  | "LIVING"
  | "EDUCATION"
  | "MEDICAL"
  | "OTHER";

export interface FutureSpendCategoryViewModel {
  id: FutureSpendCategoryId;
  label: string;
  examples: string;
  allowsCustomLabel: boolean;
}

/** 미래지출 한 건. 금액은 원 단위 정수로 정규화한다. (spec §8.5 / §8.9) */
export interface FutureSpendItemViewModel {
  id: string;
  categoryId: FutureSpendCategoryId;
  /** `OTHER`를 선택한 경우의 사용자 직접 입력 이름. 그 밖에는 null. */
  customLabel: string | null;
  kind: FutureSpendKind;
  amountWon: number;
  startYear: number;
  startMonth: number;
  /** 비교 가능한 과거 월평균. 없으면 null이며 방향을 생성하지 않는다. (spec §8.9) */
  pastMonthlyAverageWon: number | null;
  /** 사용자가 `예시 금액 적용하기`로 넣은 값인지. (spec §8.1) */
  isExampleValue: boolean;
}

/** 카드 조건 단계. 미래지출과 분리해 두 번째 단계에서 확인한다. (spec §8.3) */
export interface CardConstraintViewModel {
  maxCardCount: number;
  annualFeeCapWon: number;
  allowsNewIssue: boolean;
}

/**
 * spec §4.2 스케치의 `inputMode`는 두지 않는다. 이번 체크포인트는 `SINGLE`만 구현해
 * 화면이 모드를 분기할 일이 없고, §4.1이 "화면이 읽고 판단하는 최소 필드만 둔다"고 정했다.
 * `RANGE`를 도입하는 후속 체크포인트에서 §4.2 스케치대로 다시 추가한다.
 */
export interface PlanInputViewModel {
  meta: PrototypeMetaViewModel;
  categories: FutureSpendCategoryViewModel[];
  constraints: CardConstraintViewModel;
  /** 사용자가 명시적으로 선택했을 때만 적용하는 비개인화 예시 항목. (spec §8.1) */
  exampleItems: FutureSpendItemViewModel[];
  scopeNotice: ScopeNoticeViewModel;
}

/* ------------------------------------------------------------------ *
 * /result — 세 시나리오와 정형 근거 (spec §9 / §10)
 * ------------------------------------------------------------------ */

/** 내부 계약 값. 화면 라벨과 분리해 유지한다. (spec §9.1) */
export type ScenarioKey = "LOW" | "BASE" | "HIGH";

/** 유지·변경은 같은 위계의 정상 결과다. (spec §9.2) */
export type ScenarioConclusion = "KEEP" | "CHANGE";

/**
 * 영역별 혜택과 한도. 한도는 적용 영역과 기간을 함께 표시하며
 * 카드 전체 한도로 읽히는 포괄 라벨을 쓰지 않는다. (spec §10.1)
 *
 * 한도 기간은 `limitLabel`이 문장으로 이미 담으므로(`생활 할인 월 최대 1만 원`)
 * 별도 enum 필드를 두지 않는다. (spec §4.1 최소 필드)
 */
export interface BenefitAreaViewModel {
  areaLabel: string;
  /** 한도 적용 전 계산상 월 혜택. */
  calculatedMonthlyWon: number;
  /** 한도로 차감된 금액(0 이하). 한도가 없으면 0. */
  limitAdjustmentMonthlyWon: number;
  /** 한도 적용 후 실제 월 혜택. */
  effectiveMonthlyWon: number;
  /** `생활 할인 월 최대 1만 원` 형태의 적용 영역·한도 기간을 담은 라벨. 한도가 없으면 null. */
  limitLabel: string | null;
}

export interface CardCombinationViewModel {
  /** `예시 카드 A + 예시 카드 B`처럼 화면에 그대로 표시하는 조합 이름. */
  label: string;
  totalBenefitAnnualWon: number;
  annualFeeWon: number;
  netBenefitAnnualWon: number;
  benefitAreas: BenefitAreaViewModel[];
}

/** 시나리오와 무관하게 공통인 근거. (spec §10.2 5~6번) */
export interface EvidenceViewModel {
  excludedItems: string[];
  /** disclosure가 닫혀 있어도 짧게 고지하는 할부 경계. (spec §8.8 / §10.2) */
  installmentNotice: string;
  dataAsOf: string;
  ruleVersion: string;
}

export interface ScenarioResultViewModel {
  key: ScenarioKey;
  /** 짧은 탭 라벨. (spec §9.1) */
  tabLabel: string;
  /** 탭 라벨만 떼어 읽어도 의미가 남는 접근성 이름. (spec §9.1) */
  accessibleName: string;
  /** 맥락을 포함한 결과 제목. (spec §9.1) */
  contextTitle: string;
  conclusion: ScenarioConclusion;
  conclusionHeadline: string;
  conclusionBody: string;
  /** 비교 기준기간. (spec §9.2) */
  comparisonPeriodLabel: string;
  currencyLabel: string;
  currentCombination: CardCombinationViewModel;
  /** 변경 후보. `KEEP`이면 현재 조합과 계산 결과가 같다. (spec §9.2) */
  candidateCombination: CardCombinationViewModel;
  /** 유지 대비 예상 차액. `KEEP`이면 0. */
  netBenefitDeltaAnnualWon: number;
  /** 결과에 가장 크게 영향을 준 혜택 한도 문장. (spec §10.1) */
  keyLimitNotice: string;
  /**
   * 전월 실적 등 적용 조건. 근거 4번 항목이며 시나리오마다 다르다. (spec §10.2)
   * 근거 1~3번(계산식·한도 전후·연회비와 순혜택)은 결론이 가리키는 조합의
   * `CardCombinationViewModel` 값을 그대로 읽으므로 따로 두지 않는다.
   */
  applicationConditions: string[];
}

export interface ResultViewModel {
  meta: PrototypeMetaViewModel;
  activeScenario: ScenarioKey;
  /**
   * 결과를 보고 실제 행동을 판단하는 지점의 스코프 경계 고지.
   * PRD US-C AC8은 온보딩과 결과 화면 모두에서 고지를 전제한다.
   */
  scopeNotice: ScopeNoticeViewModel;
  scenarios: ScenarioResultViewModel[];
  evidence: EvidenceViewModel;
}
