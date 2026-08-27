import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "CardFit 시각 프로토타입",
  description:
    "미래지출을 입력하고 조건별 카드 조합 결과와 계산 근거를 확인하는 로컬 시각 프로토타입입니다.",
};

/**
 * `.next/types`의 생성 타입에 의존하지 않도록 children 타입을 직접 적는다.
 * 갓 clone한 저장소에서도 `npx tsc --noEmit`이 build 없이 통과해야 한다.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
