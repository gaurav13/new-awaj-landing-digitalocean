import { hasDatabaseUrl } from "./index"

export async function withDb<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabaseUrl()) return fallback
  try {
    return await query()
  } catch (error) {
    console.error("[db] query failed:", error)
    return fallback
  }
}
