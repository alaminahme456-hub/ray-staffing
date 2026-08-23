/**
 * Stub Supabase client — returns empty data for all queries.
 * Portal components import this; replacing with a no-op keeps UI intact.
 */

class SupabaseStub {
  auth = {
    getSession: () => Promise.resolve({ data: { session: null } }),
    getUser: () => Promise.resolve({ data: { user: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () =>
      Promise.resolve({ data: { user: null }, error: { message: 'Use /api/auth/login' } }),
    signUp: () =>
      Promise.resolve({ data: { user: null }, error: { message: 'Use /api/auth/register' } }),
    signOut: () => Promise.resolve(),
  }

  from() { return this }
  select() { return this }
  insert() { return this }
  update() { return this }
  upsert() { return this }
  delete() { return this }
  eq() { return this }
  neq() { return this }
  in() { return this }
  order() { return this }
  limit() { return this }
  single() { return this }
  maybeSingle() { return this }
  range() { return this }
  ilike() { return this }
  gte() { return this }
  lte() { return this }
  gt() { return this }
  lt() { return this }
  is() { return this }
  not() { return this }
  or() { return this }
  contains() { return this }
  rpc() { return Promise.resolve({ data: null, error: null, count: 0 }) }

  /** Make the stub awaitable — returns empty result */
  then(resolve: (v: any) => void, _reject?: (v: any) => void) {
    return Promise.resolve({ data: null, error: null, count: 0 }).then(resolve, _reject)
  }
}

export function createClient() {
  return new SupabaseStub()
}
