/**
 * `/plan` 입력 정책 헬퍼. 화면 컴포넌트가 검증 규칙과 라벨을 직접 만들지 않게 모아 둔다.
 *
 * 프로토타입 검증 대상은 빈 값·0원·음수·비숫자뿐이다. 최대 입력 금액·카테고리별 상한은
 * `DECISION-007` 승인 전까지 정하지 않는다. (spec §8.10 / rules 006)
 */
import type {
  FutureSpendCategoryViewModel,
  FutureSpendItemViewModel,
  FutureSpendKind,
} from "./view-model";
import { MANWON, formatManwon } from "./format";

/* ------------------------------------------------------------------ *
 * 금액 입력 파싱
 * ------------------------------------------------------------------ */

export type AmountInvalidReason = "EMPTY" | "NOT_NUMERIC" | "NOT_POSITIVE" | "NEGATIVE";

export type AmountParseResult =
  | { ok: true; won: number }
  | { ok: false; reason: AmountInvalidReason };

export const AMOUNT_ERROR_MESSAGE: Record<AmountInvalidReason, string> = {
  EMPTY: "금액을 입력해 주세요.",
  NOT_NUMERIC: "숫자만 입력해 주세요. 소수점 없이 만원 단위로 입력합니다.",
  NOT_POSITIVE: "0원보다 큰 금액을 입력해 주세요.",
  NEGATIVE: "0원 이상 금액을 입력해 주세요.",
};

/**
 * 만원 단위 입력값을 원 단위 정수로 정규화한다.
 * 붙여넣은 쉼표와 공백은 정리하고, 소수 입력 규칙은 만들지 않는다. (spec §8.5)
 */
export function parseManwonInput(
  raw: string,
  options: { allowZero?: boolean } = {},
): AmountParseResult {
  const cleaned = raw.replace(/[,\s]/g, "");
  if (cleaned.length === 0) return { ok: false, reason: "EMPTY" };
  if (!/^-?\d+$/.test(cleaned)) return { ok: false, reason: "NOT_NUMERIC" };

  const manwon = Number(cleaned);
  if (manwon < 0) {
    return { ok: false, reason: options.allowZero ? "NEGATIVE" : "NOT_POSITIVE" };
  }
  if (manwon === 0 && !options.allowZero) {
    return { ok: false, reason: "NOT_POSITIVE" };
  }
  return { ok: true, won: manwon * MANWON };
}

/** 빠른 금액 추가 버튼. 현재 값에 더하고 실행 취소·금액 지우기를 함께 제공한다. (spec §8.5) */
export const QUICK_ADD_MANWON = [10, 100, 1_000] as const;

export function quickAddLabel(manwon: number): string {
  return `+${manwon.toLocaleString("ko-KR")}만`;
}

/** 빠른 금액 버튼을 누른 뒤의 입력값. 비어 있거나 숫자가 아니면 더한 금액만 남긴다. */
export function applyQuickAdd(currentRaw: string, addManwon: number): string {
  const parsed = parseManwonInput(currentRaw, { allowZero: true });
  const currentManwon = parsed.ok ? parsed.won / MANWON : 0;
  return String(currentManwon + addManwon);
}

/* ------------------------------------------------------------------ *
 * 라벨
 * ------------------------------------------------------------------ */

export function spendKindLabel(kind: FutureSpendKind): string {
  return kind === "ONE_TIME" ? "한 번 쓰는 금액" : "매달 쓰는 금액";
}

/** 지출 형태에 따라 묻는 금액의 뜻이 달라진다. (spec §8.9) */
export function spendAmountLabel(kind: FutureSpendKind): string {
  return kind === "ONE_TIME" ? "예상 지출 총액" : "앞으로 예상하는 월 금액";
}

export function spendTimingLabel(kind: FutureSpendKind): string {
  return kind === "ONE_TIME" ? "지출 예정 시기" : "변경 시작 시기";
}

export function categoryDisplayLabel(
  item: FutureSpendItemViewModel,
  categories: FutureSpendCategoryViewModel[],
): string {
  if (item.customLabel && item.customLabel.trim().length > 0) return item.customLabel.trim();
  return categories.find((category) => category.id === item.categoryId)?.label ?? "기타";
}

/* ------------------------------------------------------------------ *
 * 과거 대비 변화
 * ------------------------------------------------------------------ */

export interface SpendChangeDescription {
  hasComparison: boolean;
  text: string;
}

/**
 * 증가·감소 방향을 사용자에게 묻지 않고, 비교 가능한 과거 월평균이 있을 때만
 * 미래 월 금액과의 차이로 방향·차액을 표시한다. 기준값이 없으면 방향을 만들지 않는다. (spec §8.9)
 */
export function describeSpendChange(item: FutureSpendItemViewModel): SpendChangeDescription {
  if (item.kind !== "MONTHLY" || item.pastMonthlyAverageWon === null) {
    return { hasComparison: false, text: "비교할 과거 지출이 없어요" };
  }

  const diff = item.amountWon - item.pastMonthlyAverageWon;
  if (diff === 0) {
    return { hasComparison: true, text: "월 금액 차이 없음" };
  }
  const direction = diff > 0 ? "증가" : "감소";
  return { hasComparison: true, text: `월 ${formatManwon(Math.abs(diff))} ${direction}` };
}

/* ------------------------------------------------------------------ *
 * 시점 선택 후보
 * ------------------------------------------------------------------ */

export const SELECTABLE_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/**
 * 연 선택 후보. Fixture의 데이터 기준일에서 결정론적으로 만들어
 * 서버·클라이언트 렌더 결과가 갈리지 않게 한다.
 */
export function buildSelectableYears(dataAsOf: string | null, count = 5): number[] {
  const baseYear = Number(dataAsOf?.slice(0, 4));
  const startYear = Number.isFinite(baseYear) ? baseYear : 2026;
  return Array.from({ length: count }, (_, index) => startYear + index);
}
