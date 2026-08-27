import type { ScopeNoticeViewModel } from "@/features/cardfit-prototype/lib/view-model";

/**
 * 스코프 고지. 두 화면에서 같은 문구를 읽는다.
 *
 * - `/plan`: 입력 전에 확인할 수 있도록 1단계 첫 블록 위에 둔다. (spec §7.6)
 * - `/result`: 결과를 보고 실제 카드 행동을 판단하는 지점에 둔다. PRD US-C AC8이 온보딩과
 *   결과 화면 모두에서 스코프 고지를 전제한다.
 *
 * 문구 원천은 `fixtures/scope-notice.ts` 한 곳이다. `COMMAND-008` 승인 계약이 아니라 spec §7.2의
 * 후보 문구이며, 후보라는 사실을 사용자 화면에 표시하지 않고 문서와 이 주석으로만 관리한다.
 * (spec §7.1 / §7.6)
 */
export function ScopeNotice({ notice }: { notice: ScopeNoticeViewModel }) {
  return (
    <section
      aria-labelledby="scope-notice-title"
      className="rounded-lg border bg-card px-3 py-3 text-sm"
    >
      <h2 id="scope-notice-title" className="font-medium">
        {notice.title}
      </h2>
      <ul className="mt-2 flex flex-col gap-1 text-muted-foreground">
        {notice.body.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
