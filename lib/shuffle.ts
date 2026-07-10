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

/**
 * Pin the `count` most-recently added/updated items first (in newest-first order),
 * then shuffle the remaining items. `recencyOf` returns a comparable number
 * (e.g. epoch ms); larger values are more recent. Ties are broken by input order.
 */
export function latestNThenShuffle<T>(items: readonly T[], count: number, recencyOf: (item: T) => number): T[] {
  if (items.length <= 1 || count <= 0) return count <= 0 ? shuffle(items) : [...items]
  // Stable sort by recency descending to pick the newest `count` items.
  const byRecency = items
    .map((item, index) => ({ item, index, r: recencyOf(item) }))
    .sort((a, b) => b.r - a.r || a.index - b.index)
  const latest = byRecency.slice(0, count).map((e) => e.item)
  const latestSet = new Set(latest)
  const rest = items.filter((item) => !latestSet.has(item))
  return [...latest, ...shuffle(rest)]
}

/**
 * Return the `latestCount` most-recently added/updated items first (in newest-first order),
 * followed by up to `randomCount` randomly-chosen items from the remainder. The result has at
 * most `latestCount + randomCount` items. `recencyOf` returns a comparable number (larger = newer);
 * ties are broken by input order.
 */
export function latestNThenRandomM<T>(
  items: readonly T[],
  latestCount: number,
  randomCount: number,
  recencyOf: (item: T) => number,
): T[] {
  if (items.length === 0) return []
  const byRecency = items
    .map((item, index) => ({ item, index, r: recencyOf(item) }))
    .sort((a, b) => b.r - a.r || a.index - b.index)
  const latest = byRecency.slice(0, Math.max(0, latestCount)).map((e) => e.item)
  const latestSet = new Set(latest)
  const rest = items.filter((item) => !latestSet.has(item))
  const randomPicked = shuffle(rest).slice(0, Math.max(0, randomCount))
  return [...latest, ...randomPicked]
}

/** Best-effort epoch ms from a Date | string | null, using the most recent of created/updated. */
export function recencyMs(createdAt?: Date | string | null, updatedAt?: Date | string | null): number {
  const c = createdAt ? new Date(createdAt).getTime() : 0
  const u = updatedAt ? new Date(updatedAt).getTime() : 0
  return Math.max(Number.isNaN(c) ? 0 : c, Number.isNaN(u) ? 0 : u)
}
