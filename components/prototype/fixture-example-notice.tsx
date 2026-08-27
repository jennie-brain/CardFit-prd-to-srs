import { formatDataAsOf } from "@/lib/prototype/format";
import type { PrototypeMetaViewModel } from "@/lib/prototype/view-model";

/**
 * Fixture 예시 고지. 모든 Fixture는 `isExample: true`이며 실제 사용자 데이터처럼
 * 오인되지 않도록 화면에서 예시임을 밝힌다. (spec §4.3 / §5.1 · 완료 기준 6)
 */
export function FixtureExampleNotice({ meta }: { meta: PrototypeMetaViewModel }) {
  return (
    <section
      aria-labelledby="fixture-example-notice-title"
      className="rounded-lg border border-dashed bg-muted/40 px-3 py-3 text-sm"
    >
      <h2 id="fixture-example-notice-title" className="font-medium">
        이 화면은 예시 데이터로 만든 시각 프로토타입입니다.
      </h2>
      <p className="mt-1 text-muted-foreground">
        금액·카드·혜택은 화면 구조를 확인하기 위한 예시이며 실제 카드 추천 결과나 절감액이
        아닙니다. 카드사 실명과 로고는 사용하지 않았습니다.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        데이터 기준 {meta.dataAsOf ? formatDataAsOf(meta.dataAsOf) : "미확인"} · 예시 데이터{" "}
        {meta.fixtureId}
      </p>
    </section>
  );
}
