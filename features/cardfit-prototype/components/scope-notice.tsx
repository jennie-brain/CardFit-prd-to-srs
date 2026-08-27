import type { ScopeNoticeViewModel } from "@/features/cardfit-prototype/lib/view-model";

/**
 * 스코프 고지. 입력 전에 확인할 수 있도록 `/plan` 첫 단계 위에 둔다.
 *
 * 문구는 `COMMAND-008` 승인 계약이 아니라 spec §7.2의 후보 문구다. 후보라는 사실을
 * 사용자 화면에 표시하지 않고 문서와 이 주석으로만 관리한다. (spec §7.1 / §7.6)
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
