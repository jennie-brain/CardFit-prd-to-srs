import type { Metadata } from "next";

import { PlanFlow } from "@/components/prototype/plan-flow";
import { ScreenShell } from "@/components/prototype/screen-shell";
import { PLAN_INPUT_FIXTURE } from "@/fixtures/prototype/plan";

export const metadata: Metadata = {
  title: "미래지출 입력 · CardFit 시각 프로토타입",
};

/**
 * 프로토타입 진입 화면. 서버에서 대표 Fixture를 읽어 넘기고 상호작용만 클라이언트에서 다룬다.
 * 본 개발에서 이 자리를 실제 Query 계층으로 교체할 수 있게 화면과 데이터 원천을 분리한다.
 */
export default function PlanPage() {
  return (
    <ScreenShell
      title="미래지출을 입력해요"
      lead="앞으로 달라질 지출을 먼저 입력하면 카드 조건과 결과를 이어서 확인할 수 있어요."
      meta={PLAN_INPUT_FIXTURE.meta}
    >
      <PlanFlow plan={PLAN_INPUT_FIXTURE} />
    </ScreenShell>
  );
}
