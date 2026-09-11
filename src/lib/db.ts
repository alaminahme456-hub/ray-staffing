import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

function createMockDb() {
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    createMany: async (d: any) => ({ count: d?.data?.length || 0 }),
    update: async (d: any) => d?.data ?? {},
    updateMany: async () => ({ count: 0 }),
    delete: async () => ({}),
    deleteMany: async () => ({ count: 0 }),
    count: async () => 0,
    aggregate: async () => ({ _count: 0, _sum: 0, _avg: 0 }),
    groupBy: async () => [],
    upsert: async (d: any) => d?.create ?? {},
  }
  return new Proxy({}, {
    get: (_, model) => {
      if (model === '$connect') return async () => {}
      if (model === '$disconnect') return async () => {}
      if (model === '$transaction') return async (fn: any) => (typeof fn === 'function' ? fn(createMockDb()) : Promise.all(fn))
      return new Proxy(noOp, {
        get: (target, prop) => (target as any)[prop] ?? (async () => null),
      })
    },
  })
}

function isTransientConnectionError(err: unknown): boolean {
  if (!err) return false
  const str = String(err)
  const code = (err as Record<string, unknown>)?.code
  return (
    str.includes('Closed') ||
    str.includes('Connection terminated') ||
    str.includes('connection closed') ||
    str.includes('Broken pipe') ||
    str.includes('ECONNRESET') ||
    code === 'P1001' || // Can't reach database server (cold start wake-up)
    code === 'P1002' || // Timed out
    code === 'P1017'    // Server has closed the connection
  )
}

function getDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    if (url.hostname.includes('pooler')) {
      url.searchParams.delete('channel_binding')
      if (!url.searchParams.has('connect_timeout')) url.searchParams.set('connect_timeout', '30')
      if (!url.searchParams.has('pool_timeout')) url.searchParams.set('pool_timeout', '30')
      if (!url.searchParams.has('pgbouncer')) url.searchParams.set('pgbouncer', 'true')
    }
    return url.toString()
  } catch {
    return raw
  }
}

function getPrismaClient() {
  const dbUrl = getDatabaseUrl()
  if (!dbUrl) {
    console.warn('[AI Studio] DATABASE_URL not set — using mock db')
    return createMockDb()
  }

  try {
    const baseClient = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    })

    // Filter out expected serverless idle connection drops from polluting stderr
    baseClient.$on('error' as never, (e: { message?: string }) => {
      if (e.message && (e.message.includes('kind: Closed') || e.message.includes('connection closed'))) {
        return
      }
      console.error('[Prisma Error]', e.message || e)
    })

    baseClient.$on('warn' as never, (e: { message?: string }) => {
      console.warn('[Prisma Warn]', e.message || e)
    })

    // Transparently retry transient connection drops (e.g., Neon compute cold starts / idle drops)
    const extendedClient = baseClient.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }: any) {
            let attempts = 0
            while (attempts < 2) {
              try {
                return await query(args)
              } catch (err) {
                attempts++
                if (attempts < 2 && isTransientConnectionError(err)) {
                  // Brief pause to let Neon compute wake or re-pool
                  await new Promise((resolve) => setTimeout(resolve, 300 * attempts))
                  continue
                }
                throw err
              }
            }
          },
        },
      },
    })

    return extendedClient
  } catch (error) {
    console.warn('[AI Studio] Database not connected — using mock', error)
    return createMockDb()
  }
}

export const db: any = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
export { db as prisma }
