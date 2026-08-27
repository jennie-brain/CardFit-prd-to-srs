import Link from "next/link";

import { cn } from "@/features/cardfit-prototype/lib/utils";
import { buttonVariants } from "@/features/cardfit-prototype/ui/button";

/**
 * 404 처리기. `/` 라우트를 만들지 않고(spec §3.2 · rules 006) 진입 화면을 안내한다.
 *
 * `page.tsx`가 아니므로 이번 체크포인트의 라우트 수는 `/plan`·`/result` 두 개 그대로이고,
 * `/`는 계속 404를 반환한다. 진입 URL 지식이 워크스루 문서 밖에도 존재하게 하려는 목적이다.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col justify-center gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">CardFit 시각 프로토타입</p>
        <h1 className="text-2xl leading-snug font-semibold">찾는 화면이 없어요</h1>
        <p className="text-sm text-muted-foreground">
          이 프로토타입에는 미래지출 입력 화면과 결과 화면 두 개만 있습니다. 진입 화면은{" "}
          <code className="rounded bg-muted px-1 py-0.5">/plan</code>이고 결과 화면은{" "}
          <code className="rounded bg-muted px-1 py-0.5">/result</code>입니다.
        </p>
      </div>

      <Link href="/plan" className={cn(buttonVariants(), "h-11 w-full text-base")}>
        미래지출 입력하기
      </Link>
    </main>
  );
}
