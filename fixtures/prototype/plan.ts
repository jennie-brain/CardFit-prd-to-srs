/**
 * `/plan` 대표 Fixture. 비식별 정적 예시이며 실제 사용자·카드 데이터가 아니다.
 * 타입은 `lib/prototype/view-model.ts`를 만족해야 한다. (spec §5.1)
 */
import type {
  FutureSpendCategoryViewModel,
  FutureSpendItemViewModel,
  PlanInputViewModel,
} from "@/lib/prototype/view-model";
import { MANWON } from "@/lib/prototype/format";
import { SCOPE_NOTICE_CANDIDATE } from "@/fixtures/prototype/scope-notice";

/** 선택형 대분류 9종. `기타`에서만 직접 입력을 허용한다. (spec §8.4) */
const CATEGORIES: FutureSpendCategoryViewModel[] = [
  { id: "HOUSING", label: "주거", examples: "보증금·월세·관리비 변화", allowsCustomLabel: false },
  { id: "FURNITURE", label: "가구·가전", examples: "가구·가전 구매", allowsCustomLabel: false },
  { id: "WEDDING", label: "예식", examples: "웨딩홀·촬영·예복 등", allowsCustomLabel: false },
  { id: "TRAVEL", label: "여행", examples: "신혼여행·장기 여행", allowsCustomLabel: false },
  { id: "TRANSPORT", label: "교통", examples: "차량·대중교통 변화", allowsCustomLabel: false },
  { id: "LIVING", label: "생활비", examples: "식비·생필품 등 반복 지출 변화", allowsCustomLabel: false },
  { id: "EDUCATION", label: "교육", examples: "교육·학습 비용", allowsCustomLabel: false },
  { id: "MEDICAL", label: "의료", examples: "병원·건강 관련 비용", allowsCustomLabel: false },
  { id: "OTHER", label: "기타", examples: "위 대분류에 속하지 않는 직접 입력", allowsCustomLabel: true },
];

/**
 * 사용자가 `예시 금액 적용하기`를 선택했을 때만 적용하는 비개인화 예시 항목.
 * 개인 소비 데이터나 업계 통계를 기준으로 하지 않았다. (spec §8.1 / PRD US-D AC4)
 */
const EXAMPLE_ITEMS: FutureSpendItemViewModel[] = [
  {
    id: "example-living",
    categoryId: "LIVING",
    customLabel: null,
    kind: "MONTHLY",
    amountWon: 110 * MANWON,
    startYear: 2026,
    startMonth: 10,
    pastMonthlyAverageWon: 80 * MANWON,
    isExampleValue: true,
  },
  {
    id: "example-wedding",
    categoryId: "WEDDING",
    customLabel: null,
    kind: "ONE_TIME",
    amountWon: 1_200 * MANWON,
    startYear: 2026,
    startMonth: 11,
    pastMonthlyAverageWon: null,
    isExampleValue: true,
  },
];

export const PLAN_INPUT_FIXTURE: PlanInputViewModel = {
  meta: {
    fixtureId: "plan-input-01",
    status: "empty",
    dataAsOf: "2026-08-27",
    isExample: true,
  },
  categories: CATEGORIES,
  constraints: {
    maxCardCount: 3,
    annualFeeCapWon: 10 * MANWON,
    allowsNewIssue: true,
  },
  exampleItems: EXAMPLE_ITEMS,
  scopeNotice: SCOPE_NOTICE_CANDIDATE,
};
