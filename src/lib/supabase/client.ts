/**
 * Data-only stub for portal components.
 * Auth is handled by Neon Auth (see src/lib/auth/neon-auth.ts).
 */
class DataStub {
  private empty = { data: null, error: null, count: 0 }
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
  rpc() { return Promise.resolve(this.empty) }
  then(resolve: (v: any) => void, _reject?: (v: any) => void) {
    return Promise.resolve(this.empty).then(resolve, _reject)
  }
}
let _stub: DataStub | null = null
export function createClient() {
  if (!_stub) _stub = new DataStub()
  return _stub
}
