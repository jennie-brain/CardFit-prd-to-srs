---
name: prisma-database-setup
description: Configure Prisma ORM 7 with PostgreSQL for this project's local Supabase CLI and deployed Supabase environments. Use for schema, connection, migration, Prisma Client, or PostgreSQL troubleshooting tasks.
license: MIT
metadata:
  author: prisma
  version: "7.6.0-cardfit"
---

# Prisma PostgreSQL Setup for CardFit

This project-scoped variant keeps the official Prisma skill's PostgreSQL guidance and removes providers and managed Prisma services outside CardFit's C-TEC baseline.

## Apply When

- Initializing Prisma ORM 7 with Supabase PostgreSQL
- Configuring `schema.prisma`, `prisma.config.ts`, or Prisma Client
- Creating, reviewing, or deploying migrations
- Troubleshooting PostgreSQL connections and driver adapters

## Project Constraints

- Read `references/postgresql.md` and `references/prisma-client-setup.md` as needed.
- Use `provider = "postgresql"` in every environment; do not use SQLite locally.
- Use local Supabase CLI PostgreSQL for development and Supabase PostgreSQL for deployment.
- Keep pooled runtime `DATABASE_URL` separate from migration `DIRECT_URL`.
- Keep Prisma Client and credentials in `server-only` modules and use Node.js runtime.
- Version every schema change with Prisma migration. Never use `prisma db push` in Production.
- Include migration, seed/fixture, and contract/integration tests with schema changes.
- Do not introduce Prisma Postgres, Accelerate, Compute, or another managed database without an approved TASK and ADR.

## Verification

Discover exact CLI commands from the installed Prisma version instead of guessing. Verify client generation, local migration, seed, relevant tests, and production migration compatibility before completion.
