/**
 * 스코프 경계 고지 후보 문구.
 *
 * `docs/tasks/task1/prototype-visual-spec.md` §7.2의 문구를 그대로 쓴다. `COMMAND-008` 승인
 * 계약이 아니라 후보이며, 승인 문구가 확정되면 이 파일 한 곳만 교체한다. (spec §7.1 / §7.6)
 *
 * `/plan`은 입력 전에, `/result`는 결과를 보고 실제 행동을 판단하는 지점에서 같은 경계를 전달한다.
 * PRD US-C AC8은 온보딩과 결과 화면 모두에서 스코프 고지를 전제한다.
 */
import type { ScopeNoticeViewModel } from "@/features/cardfit-prototype/lib/view-model";

export const SCOPE_NOTICE_CANDIDATE: ScopeNoticeViewModel = {
  title: "CardFit은 예상 지출을 바탕으로 카드 조합별 혜택을 비교합니다.",
  body: [
    "계산 결과는 입력한 금액과 최근 확인된 카드 정보를 기준으로 합니다.",
    "카드 신청·발급·해지를 대신 진행하지 않습니다.",
  ],
};
