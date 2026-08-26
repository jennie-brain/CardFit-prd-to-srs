# 데이터와 보안

- 기능에 필요한 파생 값, 규칙 버전, 기준일, 결과 스냅샷만 저장한다.
- 원본 금융 응답, 인증서, token, API key를 DB나 로그에 저장하지 않는다.
- 보존 기간이 미정이면 영구 보관을 구현하지 않는다.
- 모든 외부 입력은 공유 schema로 서버에서 검증한다.
- 인증과 인가를 구분하고 사용자 row에는 소유권 조건을 적용한다.
- Supabase Data API 노출 table에는 RLS와 실제 접근 모델의 policy를 둔다.
- service role은 서버 전용이며 소유권 검사를 우회하는 수단으로 쓰지 않는다.
- 관리자·Cron endpoint는 별도 권한 또는 secret 검증과 실패 테스트를 갖는다.
- 오류 응답은 stack, SQL, connection string, provider 원문을 노출하지 않는다.
- 사용자 ID, 금융 식별자, prompt 입력은 구조화 로그 전에 마스킹한다.
- `NEXT_PUBLIC_`에는 공개 가능한 값만 두고 AI prompt에는 직접 식별정보를 넣지 않는다.
- 로그·browser bundle·HTTP 응답의 secret 0건을 자동 검사한다.
