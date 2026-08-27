"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/features/cardfit-prototype/ui/accordion";
import {
  formatAnnualWon,
  formatDataAsOf,
  formatKoreanReading,
  formatMonthlyWon,
} from "@/features/cardfit-prototype/lib/format";
import type {
  CardCombinationViewModel,
  EvidenceViewModel,
  ScenarioResultViewModel,
} from "@/features/cardfit-prototype/lib/view-model";

interface EvidenceDisclosureProps {
  scenario: ScenarioResultViewModel;
  /** 결론이 가리키는 조합. 근거 1~3번의 숫자는 이 조합에서만 읽는다. */
  combination: CardCombinationViewModel;
  sharedEvidence: EvidenceViewModel;
}

function SubHeading({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <h4 className="mt-4 text-sm font-medium first:mt-0">
      {index}. {children}
    </h4>
  );
}

/**
 * `계산 근거 보기` disclosure. 펼치면 정형 근거 6종을 spec §10.2 순서로 표시한다.
 * 키보드로 열고 닫을 수 있고 제목과 연결된 `aria-expanded`를 제공한다.
 */
export function EvidenceDisclosure({
  scenario,
  combination,
  sharedEvidence,
}: EvidenceDisclosureProps) {
  return (
    <Accordion className="border-t">
      <AccordionItem value="evidence">
        <AccordionTrigger>계산 근거 보기</AccordionTrigger>
        <AccordionContent>
          <SubHeading index="1 · 2">
            영역별 예상 혜택 계산식과 한도 적용 전·후 금액
          </SubHeading>
          <div className="mt-2 flex flex-col gap-3">
            {combination.benefitAreas.map((area) => (
              <div key={area.areaLabel} className="rounded-lg border px-3 py-2">
                <p className="text-sm font-medium">{area.areaLabel}</p>
                <dl className="mt-1 text-sm tabular-nums">
                  <div className="flex justify-between gap-3 py-0.5">
                    <dt className="text-muted-foreground">계산상 할인</dt>
                    <dd>{formatMonthlyWon(area.calculatedMonthlyWon)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-0.5">
                    <dt className="text-muted-foreground">
                      {area.limitLabel === null ? "한도 없음" : "한도 적용"}
                    </dt>
                    <dd>
                      {area.limitAdjustmentMonthlyWon === 0
                        ? "적용된 차감 없음"
                        : formatMonthlyWon(area.limitAdjustmentMonthlyWon)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 py-0.5">
                    <dt className="text-muted-foreground">실제 적용</dt>
                    <dd className="font-medium">{formatMonthlyWon(area.effectiveMonthlyWon)}</dd>
                  </div>
                </dl>
                <p className="mt-1 text-xs text-muted-foreground">
                  {area.limitLabel === null
                    ? "이 영역에는 적용 한도가 없습니다."
                    : `${area.limitLabel}까지 적용됩니다.`}
                </p>
              </div>
            ))}
          </div>

          <SubHeading index="3">연회비와 예상 순혜택 계산</SubHeading>
          <dl className="mt-2 rounded-lg border px-3 py-2 text-sm tabular-nums">
            <div className="flex justify-between gap-3 py-0.5">
              <dt className="text-muted-foreground">총 예상 혜택</dt>
              <dd>{formatAnnualWon(combination.totalBenefitAnnualWon)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-0.5">
              <dt className="text-muted-foreground">연회비</dt>
              <dd>
                {combination.annualFeeWon === 0
                  ? formatAnnualWon(0)
                  : `-${formatAnnualWon(combination.annualFeeWon)}`}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-t pt-1 py-0.5">
              <dt className="font-medium">예상 순혜택</dt>
              <dd className="font-medium">{formatAnnualWon(combination.netBenefitAnnualWon)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-xs text-muted-foreground">
            예상 순혜택은 {formatKoreanReading(combination.netBenefitAnnualWon)}이며, 총 예상
            혜택·연회비·예상 순혜택은 모두 {scenario.comparisonPeriodLabel} 기준으로 환산했습니다.
          </p>

          <SubHeading index="4">적용 조건</SubHeading>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
            {scenario.applicationConditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>

          <SubHeading index="5">이 계산에 포함되지 않은 항목</SubHeading>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
            {sharedEvidence.excludedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <SubHeading index="6">데이터 기준일과 계산 규칙 버전</SubHeading>
          <dl className="mt-2 text-sm tabular-nums">
            <div className="flex justify-between gap-3 py-0.5">
              <dt className="text-muted-foreground">데이터 기준일</dt>
              <dd>{formatDataAsOf(sharedEvidence.dataAsOf)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-0.5">
              <dt className="text-muted-foreground">계산 규칙 버전</dt>
              <dd>{sharedEvidence.ruleVersion}</dd>
            </div>
          </dl>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
