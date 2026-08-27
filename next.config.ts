import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev`가 저장소 루트 AGENTS.md에 자기 규칙 블록을 덧붙이지 않게 막는다.
  // 루트 AGENTS.md는 이 저장소의 공통 규칙 문서이며 다른 세션이 함께 관리한다.
  agentRules: false,
};

export default nextConfig;
