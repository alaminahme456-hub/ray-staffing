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

function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    console.warn('[AI Studio] DATABASE_URL not set — using mock db')
    return createMockDb()
  }

  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
    return client
  } catch (error) {
    console.warn('[AI Studio] Database not connected — using mock', error)
    return createMockDb()
  }
}

export const db: any = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
export { db as prisma }
