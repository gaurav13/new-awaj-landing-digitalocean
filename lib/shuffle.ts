/**
 * Client-safe ordering helpers used by the public directories and homepage
 * leadership slider. Randomization is done on the client (per mount) so the
 * order changes on every page load/visit without needing to disable caching.
 */

/** Fisher-Yates shuffle that returns a new array (does not mutate the input). */
export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Pin the single most-recently added/updated item first, then shuffle the rest.
 * `recencyOf` returns a comparable number (e.g. epoch ms); the largest wins the
 * first slot. Ties are broken by input order.
 */
export function newestFirstThenShuffle<T>(items: readonly T[], recencyOf: (item: T) => number): T[] {
  if (items.length <= 1) return [...items]
  let newestIdx = 0
  let newestVal = recencyOf(items[0])
  for (let i = 1; i < items.length; i++) {
    const v = recencyOf(items[i])
    if (v > newestVal) {
      newestVal = v
      newestIdx = i
    }
  }
  const rest = items.filter((_, i) => i !== newestIdx)
  return [items[newestIdx], ...shuffle(rest)]
}

/** Best-effort epoch ms from a Date | string | null, using the most recent of created/updated. */
export function recencyMs(createdAt?: Date | string | null, updatedAt?: Date | string | null): number {
  const c = createdAt ? new Date(createdAt).getTime() : 0
  const u = updatedAt ? new Date(updatedAt).getTime() : 0
  return Math.max(Number.isNaN(c) ? 0 : c, Number.isNaN(u) ? 0 : u)
}
