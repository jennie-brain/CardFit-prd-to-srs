import type { ReactNode } from "react";

import { FixtureExampleNotice } from "@/components/prototype/fixture-example-notice";
import type { PrototypeMetaViewModel } from "@/lib/prototype/view-model";

interface ScreenShellProps {
  title: string;
  lead: string;
  meta: PrototypeMetaViewModel;
  children: ReactNode;
}

/**
 * 두 라우트가 공유하는 화면 골격. 모바일 우선 한 컬럼이며 최대 폭만 제한한다.
 * 화면 최대 폭·breakpoint token은 미확정이므로(spec §11) Tailwind 기본값을 그대로 쓴다.
 */
export function ScreenShell({ title, lead, meta, children }: ScreenShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">CardFit 시각 프로토타입</p>
        <h1 className="text-2xl leading-snug font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{lead}</p>
      </header>
      <FixtureExampleNotice meta={meta} />
      {children}
    </main>
  );
}
