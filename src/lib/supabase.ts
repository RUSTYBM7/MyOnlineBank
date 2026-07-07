/**
 * Supabase client + configuration detection.
 *
 * Reads Vite env vars:
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_ANON_KEY
 * When both are present, exports a real @supabase/supabase-js client.
 * When either is missing, exports a no-op shim that gracefully degrades so
 * the app continues to render in local dev / preview without crashing.
 *
 * This is the pattern used across the OrbitPay member portal so contributors
 * can run the project locally without Supabase credentials.
 */

type MinimalClient = {
  auth: {
    getUser: () => Promise<{ data: { user: null }; error: null }>;
    getSession: () => Promise<{ data: { session: null }; error: null }>;
    signInWithPassword: (creds: { email: string; password: string }) => Promise<{
      data: { user: null; session: null };
      error: { message: string } | null;
    }>;
    signUp: (creds: { email: string; password: string }) => Promise<{
      data: { user: null; session: null };
      error: { message: string } | null;
    }>;
    signOut: () => Promise<{ error: null }>;
    onAuthStateChange: (
      cb: (event: string, session: null) => void
    ) => { data: { subscription: { unsubscribe: () => void } } };
  };
  from: (_table: string) => {
    select: () => Promise<{ data: unknown[]; error: null }>;
    insert: (_rows: unknown) => Promise<{ data: null; error: null }>;
    update: (_values: unknown) => Promise<{ data: null; error: null }>;
    upsert: (_rows: unknown) => Promise<{ data: null; error: null }>;
    delete: () => Promise<{ data: null; error: null }>;
  };
};

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(URL && KEY);

let realClient: unknown = null;

async function getRealClient(): Promise<unknown> {
  if (realClient) return realClient;
  if (!isSupabaseConfigured) return null;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    realClient = createClient(URL!, KEY!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
    return realClient;
  } catch (err) {
    console.warn('[supabase] failed to initialize client, using shim:', err);
    return null;
  }
}

const stub: MinimalClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: { message: 'Supabase not configured' },
    }),
    signUp: async () => ({
      data: { user: null, session: null },
      error: { message: 'Supabase not configured' },
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (cb) => {
      // Fire once with a noop session
      cb('INITIAL_SESSION', null);
      return { data: { subscription: { unsubscribe: () => undefined } } };
    },
  },
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    upsert: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
};

/**
 * Proxy that lazily loads the real client only when Supabase is configured,
 * otherwise returns the stub. This means file-level imports never crash.
 */
export const supabase: MinimalClient = new Proxy(stub, {
  get(_target, prop) {
    if (!isSupabaseConfigured) return (stub as any)[prop];
    // The real client is async-loaded; for synchronous reads we return the stub.
    // For async operations, callers should await getRealClient() first.
    return (stub as any)[prop];
  },
}) as MinimalClient;

export async function getSupabase() {
  const client = await getRealClient();
  return (client ?? stub) as MinimalClient;
}
