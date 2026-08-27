"use client";

import { EvidenceDisclosure } from "@/components/prototype/evidence-disclosure";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatAnnualWon,
  formatDataAsOf,
  formatKoreanReading,
  formatSignedWon,
} from "@/lib/prototype/format";
import type {
  EvidenceViewModel,
  ScenarioResultViewModel,
} from "@/lib/prototype/view-model";

interface ScenarioResultPanelProps {
  scenario: ScenarioResultViewModel;
  sharedEvidence: EvidenceViewModel;
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <dt className="shrink-0 text-muted-foreground">{term}</dt>
      <dd className="min-w-0 text-right break-keep">{children}</dd>
    </div>
  );
}

/**
 * 시나리오 한 건의 결과. 유지와 변경은 같은 위계로 표시하고 변경을 성공 상태처럼
 * 강조하지 않는다. (spec §9.2)
 *
 * 대표 숫자는 결론이 가리키는 조합의 예상 순혜택이다. 화면은 Fixture 값을 그대로 읽고
 * 금액을 다시 계산하지 않는다. (spec §4.3 / §10.1)
 */
export function ScenarioResultPanel({ scenario, sharedEvidence }: ScenarioResultPanelProps) {
  const headlineCombination =
    scenario.conclusion === "KEEP" ? scenario.currentCombination : scenario.candidateCombination;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{scenario.contextTitle}</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {scenario.conclusion === "KEEP" ? "유지" : "변경"}
            </Badge>
            <span>{scenario.conclusionHeadline}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{scenario.conclusionBody}</p>
          <dl className="mt-2 text-sm tabular-nums">
            <Row term="유지 대비 예상 차액">
              연 {formatSignedWon(scenario.netBenefitDeltaAnnualWon)}
            </Row>
            <Row term="통화">{scenario.currencyLabel}</Row>
            <Row term="비교 기준기간">{scenario.comparisonPeriodLabel}</Row>
            <Row term="현재 조합">
              {scenario.currentCombination.label} · 예상 순혜택{" "}
              {formatAnnualWon(scenario.currentCombination.netBenefitAnnualWon)}
            </Row>
            <Row term="변경 후보">
              {scenario.candidateCombination.label} · 예상 순혜택{" "}
              {formatAnnualWon(scenario.candidateCombination.netBenefitAnnualWon)}
            </Row>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            예상 순혜택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tabular-nums">
            {formatAnnualWon(headlineCombination.netBenefitAnnualWon)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatKoreanReading(headlineCombination.netBenefitAnnualWon)} ·{" "}
            {headlineCombination.label}
          </p>

          <dl className="mt-3 border-t pt-2 text-sm tabular-nums">
            <Row term="총 예상 혜택">
              {formatAnnualWon(headlineCombination.totalBenefitAnnualWon)}
            </Row>
            <Row term="연회비">{formatAnnualWon(headlineCombination.annualFeeWon)}</Row>
          </dl>

          <p className="mt-3 text-sm">{scenario.keyLimitNotice}</p>

          <p className="mt-3 text-xs text-muted-foreground">
            데이터 기준 {formatDataAsOf(sharedEvidence.dataAsOf)}
          </p>

          <p className="mt-3 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
            {sharedEvidence.installmentNotice}
          </p>

          <div className="mt-3">
            <EvidenceDisclosure
              scenario={scenario}
              combination={headlineCombination}
              sharedEvidence={sharedEvidence}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
