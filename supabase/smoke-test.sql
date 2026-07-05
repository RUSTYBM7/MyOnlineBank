-- =============================================================================
-- OrbitPay — Ledger Smoke Tests
-- Run AFTER schema.sql has been applied.
-- Tests the double-entry invariant and balance derivation.
-- =============================================================================

-- Test 1: A balanced two-posting transaction should succeed.
-- We can't insert into accounts without first having a member, so let's just
-- verify the invariant catches unbalanced entries.

begin;

-- Create a test member
insert into members (id, full_name, email)
  values ('00000000-0000-0000-0000-000000000001', 'Test User', 'test@orbitpay.local');

-- Create a test account
insert into accounts (id, member_id, account_number, account_type, currency, balance)
  values (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'TEST-ACCT-001',
    'checking',
    'USD',
    1000.00
  );

-- Create a balanced transaction: debit 100 from test account, credit 100 to a second account.
insert into accounts (id, member_id, account_number, account_type, currency, balance)
  values (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'TEST-ACCT-002',
    'savings',
    'USD',
    0.00
  );

insert into transactions (id, txn_type, status, amount, currency, description, initiated_by, posted_at)
  values (
    '00000000-0000-0000-0000-000000000100',
    'transfer',
    'posted',
    100.00,
    'USD',
    'Test transfer',
    null,
    now()
  );

-- Two balanced ledger entries (asset acct convention: D=+, C=-)
-- Transfer OUT of acct10 (credit it), transfer IN to acct11 (debit it)
insert into ledger_entries (transaction_id, account_id, direction, amount, currency, balance_after)
  values
    ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'C', 100.00, 'USD', 900.00),
    ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000011', 'D', 100.00, 'USD', 100.00);

-- Test 2: Verify net trial balance per account is correct.
do $$
declare
  acct10_net numeric;
  acct11_net numeric;
  total_count int;
begin
  select coalesce(sum(case when direction = 'D' then amount else -amount end), 0)
    into acct10_net
    from ledger_entries
   where account_id = '00000000-0000-0000-0000-000000000010';

  select coalesce(sum(case when direction = 'D' then amount else -amount end), 0)
    into acct11_net
    from ledger_entries
   where account_id = '00000000-0000-0000-0000-000000000011';

  select count(*) into total_count from ledger_entries;

  raise notice 'TEST 1: Balanced entry accepted. Total entries: %', total_count;
  raise notice 'TEST 2: Acct10 net (expected -100): %', acct10_net;
  raise notice 'TEST 2: Acct11 net (expected +100): %', acct11_net;

  if acct10_net <> -100 then raise exception 'FAIL: acct10 net = %', acct10_net; end if;
  if acct11_net <> 100 then raise exception 'FAIL: acct11 net = %', acct11_net; end if;
end $$;

-- Test 3: An unbalanced entry MUST be rejected.
do $$
declare
  accepted boolean := false;
begin
  begin
    insert into ledger_entries (transaction_id, account_id, direction, amount, currency, balance_after)
      values (
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0000-000000000010',
        'C',
        999.00,
        'USD',
        -99.00
      );
    accepted := true;
  exception when others then
    raise notice 'TEST 3 PASS: Unbalanced entry rejected: %', SQLERRM;
  end;
  if accepted then
    raise exception 'TEST 3 FAIL: Unbalanced entry was accepted';
  end if;
end $$;

-- Test 4: Updating a ledger entry MUST be rejected.
do $$
declare
  accepted boolean := false;
begin
  begin
    update ledger_entries set amount = 999.00
     where transaction_id = '00000000-0000-0000-0000-000000000100'
       and account_id = '00000000-0000-0000-0000-000000000010';
    accepted := true;
  exception when others then
    raise notice 'TEST 4 PASS: Ledger update rejected: %', SQLERRM;
  end;
  if accepted then
    raise exception 'TEST 4 FAIL: Ledger update was accepted';
  end if;
end $$;

-- Test 5: Deleting a ledger entry MUST be rejected.
do $$
declare
  accepted boolean := false;
begin
  begin
    delete from ledger_entries
     where transaction_id = '00000000-0000-0000-0000-000000000100';
    accepted := true;
  exception when others then
    raise notice 'TEST 5 PASS: Ledger delete rejected: %', SQLERRM;
  end;
  if accepted then
    raise exception 'TEST 5 FAIL: Ledger delete was accepted';
  end if;
end $$;

rollback;

-- =============================================================================
-- All tests should have rolled back at the end. Run this whole script via:
--   psql "$DATABASE_URL" -f supabase/smoke-test.sql
-- Or in Supabase SQL editor: paste + run.
-- =============================================================================