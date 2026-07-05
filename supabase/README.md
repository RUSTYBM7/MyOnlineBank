# OrbitPay Supabase

Postgres schema and smoke tests for the OrbitPay Credit Union Supabase project.

## Files

- `schema.sql` — Production schema (12 tables, 9 enums, 3 triggers, 7 RLS policies)
- `smoke-test.sql` — 5 invariant tests (double-entry balance, immutability)

## Apply Manually

1. Open https://supabase.com/dashboard/project/oyghbtzxurjtlwpraqpo/sql/new
2. Paste contents of `schema.sql`
3. Click **Run**
4. Then run `smoke-test.sql` to verify

## Apply Automatically (CI/CD)

The prebuild step in `../scripts/apply-supabase-schema.mjs` runs the schema during Vercel deploy when `SUPABASE_DB_PASSWORD` is set as a Vercel env var (production scope). The script:

1. Connects to `db.oyghbtzxurjtlwpraqpo.supabase.co:5432`
2. Applies the full schema in one transaction
3. Runs the smoke test in a rollback transaction
4. Logs the result and proceeds with the build

## Notes for Production Supabase

The schema includes a stub `auth.users` table and `auth.uid()` function for local testing. **Before applying to real Supabase**, comment out these lines (real Supabase provides them):

```sql
-- Around line 18 in schema.sql:
-- create schema if not exists auth;
-- create table if not exists auth.users (...);
-- create or replace function auth.uid() ...;
```

Then run on the real Supabase project.