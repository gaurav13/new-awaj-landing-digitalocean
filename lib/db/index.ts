import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  )
}

export function hasDatabaseUrl() {
  return Boolean(getDatabaseUrl())
}

export const pool = new Pool({ connectionString: getDatabaseUrl() })
export const db = drizzle(pool, { schema })
