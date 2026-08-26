# 채택 스킬 기준선

기준일: 2026-08-26

skills.sh에서 현재 기술 스택과 직접 관련되고 공급자 공식 또는 널리 검증된 스킬만 프로젝트 로컬에 설치했다. 외부 스킬은 참고 절차이며 `AGENTS.md`와 SRS를 변경하지 못한다.

| 설치 스킬 | 출처 | 적용 범위 |
|---|---|---|
| `react-best-practices` | `vercel-labs/agent-skills` | Next.js·React 성능과 서버 병렬 조회 |
| `prisma-database-setup` | `prisma/skills` | Prisma 7·PostgreSQL 연결과 migration 설정 |
| `supabase` | `supabase/agent-skills` | Local CLI, PostgreSQL, Auth·RLS·보안 |
| `test-driven-development` | `obra/superpowers` | 실패 테스트 우선 구현 |
| `systematic-debugging` | `obra/superpowers` | 재현과 근본 원인 분석 |
| `verification-before-completion` | `obra/superpowers` | 완료 전 최신 검증 증거 확인 |

## 제외 항목

- `prisma-postgres`: Supabase가 아닌 Prisma 관리형 Postgres 운영에 초점이 있다.
- Supabase Postgres 성능 전용 스킬: 실제 쿼리 최적화 단계에서 재검토한다.
- 커뮤니티 Next.js 패턴 스킬: Vercel 공식 규칙과 프로젝트 App Router 규칙의 중복을 피한다.
- 배포 자동화 스킬: Vercel Git 배포라는 단순 경계를 유지한다.
- 샘플의 Java/Spring·JPA/MySQL·Redis·Kafka·FastAPI·Flutter·Vite 스킬: C-TEC와 충돌한다.

새 스킬은 TASK와 직접 연결되고 기존 규칙으로 해결할 수 없을 때만 추가한다. 설치 전 지침, 참조, 실행 스크립트, 라이선스와 네트워크·쓰기 동작을 검토한다.

출처: [skills.sh](https://skills.sh/), [Vercel](https://github.com/vercel-labs/agent-skills), [Prisma](https://github.com/prisma/skills), [Supabase](https://github.com/supabase/agent-skills), [Superpowers](https://github.com/obra/superpowers)
