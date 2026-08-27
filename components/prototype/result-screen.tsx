"use client";

import Link from "next/link";
import { useState } from "react";

import { ScenarioResultPanel } from "@/components/prototype/scenario-result-panel";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ResultViewModel, ScenarioKey } from "@/lib/prototype/view-model";
import { cn } from "@/lib/utils";

/**
 * 세 시나리오 결과. 탭 전환은 미리 준비된 결과를 바꿔 보여줄 뿐 서버를 다시 호출하지 않는다.
 * (spec §9.1 · PRD US-A AC6)
 */
export function ResultScreen({ result }: { result: ResultViewModel }) {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>(result.activeScenario);

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="scenario-tabs-title" className="flex flex-col gap-3">
        <h2 id="scenario-tabs-title" className="text-lg font-semibold">
          지출 조건을 바꿔 결과를 비교해요
        </h2>
        <p className="text-sm text-muted-foreground">
          세 조건은 사용자가 고른 지출 수준이며 결과의 좋고 나쁨을 뜻하지 않습니다.
        </p>

        <Tabs
          value={activeScenario}
          onValueChange={(value) => setActiveScenario(String(value) as ScenarioKey)}
        >
          <TabsList className="w-full">
            {result.scenarios.map((scenario) => {
              const isActive = scenario.key === activeScenario;
              return (
                <TabsTrigger
                  key={scenario.key}
                  value={scenario.key}
                  className={cn("h-10 flex-1", isActive && "font-semibold underline")}
                >
                  <span aria-hidden="true">{isActive ? "✓ " : ""}</span>
                  {scenario.tabLabel}
                  <span className="sr-only">, {scenario.accessibleName}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {result.scenarios.map((scenario) => (
            <TabsContent key={scenario.key} value={scenario.key} className="pt-2">
              <ScenarioResultPanel scenario={scenario} sharedEvidence={result.evidence} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <Link href="/plan" className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full text-base")}>
        미래지출 다시 입력하기
      </Link>
    </div>
  );
}
