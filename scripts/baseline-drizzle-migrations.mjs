/**
 * One-time baseline for databases that already contain the schema (e.g. DigitalOcean prod).
 * Marks the latest migration as applied without re-running CREATE TABLE statements.
 *
 * Usage: DATABASE_URL=... npm run db:baseline
 */
import { createHash } from "node:crypto"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import pg from "pg"

const MIGRATIONS_DIR = join(process.cwd(), "drizzle")

function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL
}

function latestMigrationFile() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort()

  const file = files.at(-1)
  if (!file) throw new Error("No SQL migrations found in ./drizzle")
  return join(MIGRATIONS_DIR, file)
}

async function main() {
  const connectionString = getDatabaseUrl()
  if (!connectionString) {
    throw new Error("DATABASE_URL (or POSTGRES_URL) is required for db:baseline")
  }

  const migrationPath = latestMigrationFile()
  const sql = readFileSync(migrationPath, "utf8")
  const hash = createHash("sha256").update(sql).digest("hex")
  const createdAt = Date.now()

  const pool = new pg.Pool({ connectionString })
  try {
    await pool.query(`CREATE SCHEMA IF NOT EXISTS drizzle`)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `)

    const existing = await pool.query(`SELECT id FROM drizzle.__drizzle_migrations WHERE hash = $1`, [hash])
    if (existing.rowCount && existing.rowCount > 0) {
      console.log("Baseline already recorded for the latest migration.")
      return
    }

    await pool.query(`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`, [
      hash,
      createdAt,
    ])

    console.log(`Baseline recorded for ${migrationPath}`)
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
