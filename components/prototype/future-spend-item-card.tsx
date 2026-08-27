import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatManwon, formatWon, formatYearMonth } from "@/lib/prototype/format";
import {
  categoryDisplayLabel,
  describeSpendChange,
  spendAmountLabel,
  spendKindLabel,
  spendTimingLabel,
} from "@/lib/prototype/plan-input";
import type {
  FutureSpendCategoryViewModel,
  FutureSpendItemViewModel,
} from "@/lib/prototype/view-model";

interface FutureSpendItemCardProps {
  item: FutureSpendItemViewModel;
  categories: FutureSpendCategoryViewModel[];
  onRemove?: (id: string) => void;
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-1">
      <dt className="w-24 shrink-0 text-muted-foreground">{term}</dt>
      <dd className="min-w-0 flex-1 break-keep">{children}</dd>
    </div>
  );
}

/**
 * 미래지출 한 건의 표시. 증가·감소 방향은 비교 가능한 과거 월평균이 있을 때만 나타난다.
 * (spec §8.9 · PRD US-F AC2)
 */
export function FutureSpendItemCard({
  item,
  categories,
  onRemove,
}: FutureSpendItemCardProps) {
  const change = describeSpendChange(item);

  return (
    <li className="rounded-lg border bg-card px-3 py-2.5 text-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">{categoryDisplayLabel(item, categories)}</p>
        {item.isExampleValue ? <Badge variant="outline">예시 금액</Badge> : null}
      </div>

      <dl className="mt-1.5 tabular-nums">
        <Row term="지출 형태">{spendKindLabel(item.kind)}</Row>
        {item.kind === "MONTHLY" && item.pastMonthlyAverageWon !== null ? (
          <Row term="최근 월평균">
            {formatManwon(item.pastMonthlyAverageWon)} (예시 데이터)
          </Row>
        ) : null}
        <Row term={spendAmountLabel(item.kind)}>
          {formatManwon(item.amountWon)} · {formatWon(item.amountWon)}
        </Row>
        <Row term={spendTimingLabel(item.kind)}>
          {formatYearMonth(item.startYear, item.startMonth)}
        </Row>
        <Row term="예상 변화">
          {change.hasComparison ? (
            change.text
          ) : (
            <span className="text-muted-foreground">{change.text}</span>
          )}
        </Row>
      </dl>

      {onRemove ? (
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => onRemove(item.id)}
          >
            삭제하기
          </Button>
        </div>
      ) : null}
    </li>
  );
}
