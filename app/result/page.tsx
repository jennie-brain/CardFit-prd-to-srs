import type { Metadata } from "next";

import { ResultScreen } from "@/components/prototype/result-screen";
import { ScreenShell } from "@/components/prototype/screen-shell";
import { RESULT_FIXTURE } from "@/fixtures/prototype/result";

export const metadata: Metadata = {
  title: "결과와 계산 근거 · CardFit 시각 프로토타입",
};

/**
 * 결과 화면. 새로고침하거나 이 주소로 바로 들어와도 대표 Fixture가 표시된다.
 *
 * `state` query는 이번 체크포인트에서 분기하지 않는다. 허용되지 않은 값이 와도
 * 대표 Fixture로 안전하게 되돌아가고(spec §5.2), 상태 7종 화면은 후속 체크포인트로 미룬다.
 */
export default function ResultPage() {
  return (
    <ScreenShell
      title="조건별 결과를 확인해요"
      lead="세 가지 지출 조건의 결과와 계산 근거를 비교할 수 있어요."
      meta={RESULT_FIXTURE.meta}
    >
      <ResultScreen result={RESULT_FIXTURE} />
    </ScreenShell>
  );
}
