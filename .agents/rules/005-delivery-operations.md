# 배포·운영·비용

- Vercel Git 배포와 Supabase PostgreSQL 외 운영 플랫폼을 추가하지 않는다.
- Preview가 Production DB에 쓰지 못하도록 환경과 데이터를 분리한다.
- migration은 Expand → Data Migration → Contract 순서로 작성한다.
- Health endpoint는 민감정보 없이 배포·DB 연결·필수 설정 상태를 판정한다.
- Cron은 Vercel Cron이 보안 Route Handler를 호출하게 하고 처리량·재시도·중복 실행을 제한한다.
- M1은 Vercel Hobby, Supabase Free, Gemini 비활성/무료 구성을 우선한다.
- 월 AI 상한 80%에서 신규 설명 생성을 끄고, 외부 호출 상한 100%에서 호출을 중단하되 저장 결과와 정적 근거 조회는 유지한다.
- 가격과 quota는 공식 문서에서 다시 확인한다. Platform Adapter 비용은 계약 전 `UNKNOWN`이다.

배포 완료는 `migration → seed/필수 데이터 → build → health → 핵심 smoke test`가 통과한 상태다.
