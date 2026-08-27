/**
 * 금액 표시 헬퍼. 화면은 이 파일만 사용하고 컴포넌트에서 금액을 다시 계산하지 않는다.
 * 내부 값은 원 단위 정수, 입력 단위는 만원으로 고정한다. (spec §8.5 / §10.1)
 */

export const MANWON = 10_000;
const EOK = 100_000_000;

/** `162,000원` */
export function formatWon(won: number): string {
  return `${Math.round(won).toLocaleString("ko-KR")}원`;
}

/** `1,200만 원` */
export function formatManwon(won: number): string {
  return `${Math.round(won / MANWON).toLocaleString("ko-KR")}만 원`;
}

/**
 * 읽기 보조용 한국어 단위 표현. `153000` → `15만 3천 원`.
 * 0인 단위는 생략하고, 0원은 `0원`으로 표시한다. (spec §10.1)
 */
export function formatKoreanReading(won: number): string {
  const value = Math.round(Math.abs(won));
  if (value === 0) return "0원";

  const units: Array<[number, string]> = [
    [EOK, "억"],
    [MANWON, "만"],
    [1_000, "천"],
    [100, "백"],
    [10, "십"],
  ];

  let rest = value;
  const parts: string[] = [];
  for (const [size, name] of units) {
    const count = Math.floor(rest / size);
    if (count > 0) {
      parts.push(`${count.toLocaleString("ko-KR")}${name}`);
      rest -= count * size;
    }
  }
  if (rest > 0) parts.push(`${rest}`);

  const sign = won < 0 ? "-" : "";
  return `${sign}${parts.join(" ")} 원`;
}

/**
 * 입력값 아래에 병기하는 환산 표시. 만원 단위 입력값과 전체 원 금액을 함께 보여주고,
 * 1억 원 이상이면 억 단위 읽기 표현도 병기한다. (spec §8.5)
 */
export function formatAmountConversion(won: number): string {
  const parts = [formatWon(won), formatManwon(won)];
  if (Math.abs(won) >= EOK) parts.push(formatKoreanReading(won));
  return parts.join(" · ");
}

/** `연 153,000원` — 기준기간을 앞에 붙인 금액. */
export function formatAnnualWon(won: number): string {
  return `연 ${formatWon(won)}`;
}

/** `월 12,500원` */
export function formatMonthlyWon(won: number): string {
  return `월 ${formatWon(won)}`;
}

/** 차액 표시. 0원이면 부호를 붙이지 않는다. (spec §9.2) */
export function formatSignedWon(won: number): string {
  if (won === 0) return formatWon(0);
  const sign = won > 0 ? "+" : "-";
  return `${sign}${formatWon(Math.abs(won))}`;
}

/** `2026-08-27` → `2026.08.27` */
export function formatDataAsOf(isoDate: string): string {
  return isoDate.replaceAll("-", ".");
}

/** `2026년 10월` */
export function formatYearMonth(year: number, month: number): string {
  return `${year}년 ${month}월`;
}
