"use client";

import Link from "next/link";
import { useState } from "react";

import { ScenarioResultPanel } from "@/features/cardfit-prototype/components/scenario-result-panel";
import { ScopeNotice } from "@/features/cardfit-prototype/components/scope-notice";
import { buttonVariants } from "@/features/cardfit-prototype/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/cardfit-prototype/ui/tabs";
import type { ResultViewModel, ScenarioKey } from "@/features/cardfit-prototype/lib/view-model";
import { cn } from "@/features/cardfit-prototype/lib/utils";

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
          {/*
            TabsList 기본 높이는 32px이고 `group-data-horizontal/tabs:h-8`로 선언돼 있다.
            트리거에 더 큰 높이를 직접 주면 32px 리스트를 넘치고, 접두사 없는 `h-12`는
            tailwind-merge가 충돌로 보지 않아 무시된다. 같은 variant 접두사로 덮어써야
            리스트가 실제로 커지고 트리거가 기본 `h-[calc(100%-1px)]`로 그 높이를 채운다.
          */}
          <TabsList className="w-full group-data-horizontal/tabs:h-12">
            {result.scenarios.map((scenario) => {
              const isActive = scenario.key === activeScenario;
              return (
                <TabsTrigger
                  key={scenario.key}
                  value={scenario.key}
                  className={cn("flex-1", isActive && "font-semibold underline")}
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

      <ScopeNotice notice={result.scopeNotice} />

      <Link href="/plan" className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full text-base")}>
        미래지출 다시 입력하기
      </Link>
    </div>
  );
}
