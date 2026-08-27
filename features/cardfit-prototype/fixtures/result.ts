/**
 * `/result` 대표 Fixture. 비식별 정적 예시이며 실제 카드 추천 데이터가 아니다.
 * 카드사 실명·로고를 쓰지 않고 `예시 카드 A` 형태의 비식별 라벨만 사용한다.
 * 금액은 화면에서 다시 계산하지 않으므로 이 파일의 값이 그대로 표시된다. (spec §4.3 / §5.1)
 */
import type { ResultViewModel } from "@/features/cardfit-prototype/lib/view-model";
import { SCOPE_NOTICE_CANDIDATE } from "@/features/cardfit-prototype/fixtures/scope-notice";

const COMPARISON_PERIOD = "2026.09 ~ 2027.08 (12개월)";
const CURRENCY = "원(KRW)";
/**
 * 온라인 쇼핑 할인은 `예시 카드 B`에만 있다. 세 시나리오 모두 이 영역이 변경 후보(A + B)에서만
 * 나타나고 현재 조합(A 단독)에는 없으므로, 조건문의 귀속도 B여야 근거 1·2와 어긋나지 않는다.
 */
const ONLINE_SHOPPING_CONDITION =
  "예시 카드 B의 온라인 쇼핑 할인은 카드사 앱에서 사전 응모한 달에만 적용됩니다.";

export const RESULT_FIXTURE: ResultViewModel = {
  meta: {
    fixtureId: "result-success-01",
    status: "success",
    dataAsOf: "2026-08-27",
    isExample: true,
  },
  activeScenario: "BASE",
  scopeNotice: SCOPE_NOTICE_CANDIDATE,
  scenarios: [
    {
      key: "LOW",
      tabLabel: "더 적게",
      accessibleName: "예상 지출보다 적게 쓸 때",
      contextTitle: "예상 지출보다 적게 쓸 때 결과",
      conclusion: "KEEP",
      conclusionHeadline: "현재 조합 유지",
      conclusionBody: "현재 조합을 유지해도 예상 혜택 차이가 없습니다.",
      comparisonPeriodLabel: COMPARISON_PERIOD,
      currencyLabel: CURRENCY,
      currentCombination: {
        label: "예시 카드 A",
        totalBenefitAnnualWon: 48_000,
        annualFeeWon: 0,
        netBenefitAnnualWon: 48_000,
        benefitAreas: [
          {
            areaLabel: "생활 할인",
            calculatedMonthlyWon: 4_000,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 4_000,
            limitLabel: "생활 할인 월 최대 1만 원",
          },
        ],
      },
      candidateCombination: {
        label: "예시 카드 A + 예시 카드 B",
        totalBenefitAnnualWon: 57_000,
        annualFeeWon: 9_000,
        netBenefitAnnualWon: 48_000,
        benefitAreas: [
          {
            areaLabel: "생활 할인",
            calculatedMonthlyWon: 4_250,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 4_250,
            limitLabel: "생활 할인 월 최대 1만 원",
          },
          {
            areaLabel: "온라인 쇼핑 할인",
            calculatedMonthlyWon: 500,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 500,
            limitLabel: "온라인 쇼핑 할인 월 최대 2만 원",
          },
        ],
      },
      netBenefitDeltaAnnualWon: 0,
      keyLimitNotice:
        "생활 할인은 월 최대 1만 원까지 적용되며, 이 시나리오에서는 한도에 이르지 않았습니다.",
      applicationConditions: [
        "예시 카드 B의 생활 할인은 전월 실적 30만 원 이상일 때 적용됩니다. 이 시나리오의 예상 지출은 이 조건을 충족하지 않아, 변경 후보에 예시 카드 B를 더해도 연회비를 뺀 예상 순혜택이 현재 조합과 같습니다.",
        ONLINE_SHOPPING_CONDITION,
      ],
    },
    {
      key: "BASE",
      tabLabel: "예상한 만큼",
      accessibleName: "예상한 만큼 쓸 때",
      contextTitle: "예상한 만큼 쓸 때 결과",
      conclusion: "CHANGE",
      conclusionHeadline: "조합 변경",
      conclusionBody: "조합을 바꾸면 예상 순혜택이 늘어납니다.",
      comparisonPeriodLabel: COMPARISON_PERIOD,
      currencyLabel: CURRENCY,
      currentCombination: {
        label: "예시 카드 A",
        totalBenefitAnnualWon: 60_000,
        annualFeeWon: 0,
        netBenefitAnnualWon: 60_000,
        benefitAreas: [
          {
            areaLabel: "생활 할인",
            calculatedMonthlyWon: 5_000,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 5_000,
            limitLabel: "생활 할인 월 최대 1만 원",
          },
        ],
      },
      candidateCombination: {
        label: "예시 카드 A + 예시 카드 B",
        totalBenefitAnnualWon: 162_000,
        annualFeeWon: 9_000,
        netBenefitAnnualWon: 153_000,
        benefitAreas: [
          {
            areaLabel: "생활 할인",
            calculatedMonthlyWon: 12_500,
            limitAdjustmentMonthlyWon: -2_500,
            effectiveMonthlyWon: 10_000,
            limitLabel: "생활 할인 월 최대 1만 원",
          },
          {
            areaLabel: "온라인 쇼핑 할인",
            calculatedMonthlyWon: 3_000,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 3_000,
            limitLabel: "온라인 쇼핑 할인 월 최대 2만 원",
          },
          {
            areaLabel: "예식 결제 적립",
            calculatedMonthlyWon: 500,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 500,
            limitLabel: null,
          },
        ],
      },
      netBenefitDeltaAnnualWon: 93_000,
      keyLimitNotice: "생활 할인은 월 최대 1만 원까지 적용됩니다.",
      applicationConditions: [
        "예시 카드 B의 생활 할인은 전월 실적 30만 원 이상일 때 적용됩니다. 이 시나리오의 예상 지출은 이 조건을 충족합니다.",
        ONLINE_SHOPPING_CONDITION,
      ],
    },
    {
      key: "HIGH",
      tabLabel: "더 많이",
      accessibleName: "예상 지출보다 많이 쓸 때",
      contextTitle: "예상 지출보다 많이 쓸 때 결과",
      conclusion: "CHANGE",
      conclusionHeadline: "조합 변경",
      conclusionBody: "조합을 바꾸면 예상 순혜택이 늘어납니다.",
      comparisonPeriodLabel: COMPARISON_PERIOD,
      currencyLabel: CURRENCY,
      currentCombination: {
        label: "예시 카드 A",
        totalBenefitAnnualWon: 84_000,
        annualFeeWon: 0,
        netBenefitAnnualWon: 84_000,
        benefitAreas: [
          {
            areaLabel: "생활 할인",
            calculatedMonthlyWon: 7_000,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 7_000,
            limitLabel: "생활 할인 월 최대 1만 원",
          },
        ],
      },
      candidateCombination: {
        label: "예시 카드 A + 예시 카드 B",
        totalBenefitAnnualWon: 240_000,
        annualFeeWon: 9_000,
        netBenefitAnnualWon: 231_000,
        benefitAreas: [
          {
            areaLabel: "생활 할인",
            calculatedMonthlyWon: 15_000,
            limitAdjustmentMonthlyWon: -5_000,
            effectiveMonthlyWon: 10_000,
            limitLabel: "생활 할인 월 최대 1만 원",
          },
          {
            areaLabel: "온라인 쇼핑 할인",
            calculatedMonthlyWon: 9_000,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 9_000,
            limitLabel: "온라인 쇼핑 할인 월 최대 2만 원",
          },
          {
            areaLabel: "예식 결제 적립",
            calculatedMonthlyWon: 1_000,
            limitAdjustmentMonthlyWon: 0,
            effectiveMonthlyWon: 1_000,
            limitLabel: null,
          },
        ],
      },
      netBenefitDeltaAnnualWon: 147_000,
      keyLimitNotice:
        "생활 할인은 월 최대 1만 원까지 적용되며, 계산상 할인 중 월 5,000원이 한도로 제외됐습니다.",
      applicationConditions: [
        "예시 카드 B의 생활 할인은 전월 실적 30만 원 이상일 때 적용됩니다. 이 시나리오의 예상 지출은 이 조건을 충족합니다.",
        ONLINE_SHOPPING_CONDITION,
        "전월 실적에는 예시 카드 B의 연회비 결제분이 포함되지 않습니다.",
      ],
    },
  ],
  evidence: {
    excludedItems: [
      "할부 수수료",
      "월별 실적 반영 차이",
      "카드사별 무이자 할부 조건",
      "포인트 소멸과 자동납부 승계 비용",
      "1단계에서 입력한 미래지출(이 프로토타입 결과는 고정 예시 값입니다)",
      "카드 조건 단계의 예시 초기값",
      "여러 변경 후보 사이의 순위와 대표 후보 선택",
    ],
    installmentNotice:
      "할부 수수료와 월별 실적 반영 차이, 카드사별 무이자 할부 조건은 이 계산에 포함되지 않았습니다.",
    dataAsOf: "2026-08-27",
    ruleVersion: "prototype-2026.08-r1",
  },
};
