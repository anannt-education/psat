import { DIAGNOSTIC_ITEMS } from "./items-diagnostic"
import { RW_COMPLETE_ITEMS } from "./items-rw-complete"
import { MATH_COMPLETE_ITEMS } from "./items-math-complete"
import { SHELL_ITEMS } from "./items-shells"
import { PRACTICE_EXTRA_ITEMS } from "./items-practice"
import { allMockItems } from "./mock-form"
import type { Item } from "@/lib/types"

export const ALL_ITEMS: Item[] = [
  ...DIAGNOSTIC_ITEMS,
  ...RW_COMPLETE_ITEMS,
  ...MATH_COMPLETE_ITEMS,
  ...SHELL_ITEMS,
  ...PRACTICE_EXTRA_ITEMS,
  ...allMockItems(),
]

const byId = new Map(ALL_ITEMS.map((i) => [i.id, i]))

export function getItem(id: string) {
  return byId.get(id)
}

export function itemsByUnit(unitId: string, pools?: Item["pool"][]) {
  return ALL_ITEMS.filter(
    (i) => i.unitId === unitId && (!pools || pools.includes(i.pool))
  )
}

export function itemsBySkill(skillId: string, pools?: Item["pool"][]) {
  return ALL_ITEMS.filter(
    (i) => i.skillId === skillId && (!pools || pools.includes(i.pool))
  )
}

export function unusedFresh(
  unitId: string,
  seenFamilies: Set<string>,
  seenIds: Set<string>,
  pools: Item["pool"][],
  quarantined: string[]
) {
  const q = new Set(quarantined)
  return ALL_ITEMS.filter(
    (i) =>
      i.unitId === unitId &&
      pools.includes(i.pool) &&
      !q.has(i.id) &&
      !seenIds.has(i.id) &&
      !seenFamilies.has(i.familyId)
  )
}

export function mixedItems(count: number, quarantined: string[], excludeIds: string[] = []) {
  const q = new Set([...quarantined, ...excludeIds])
  const pool = ALL_ITEMS.filter(
    (i) => (i.pool === "practice" || i.pool === "independent" || i.pool === "review") && !q.has(i.id)
  )
  return rotate(pool, count)
}

export function rotate<T>(arr: T[], count: number, start = 0): T[] {
  if (arr.length === 0) return []
  const out: T[] = []
  for (let i = 0; i < Math.min(count, arr.length); i++) {
    out.push(arr[(start + i) % arr.length])
  }
  return out
}

export function uniqueIds(items: Item[]) {
  const seen = new Set<string>()
  const dups: string[] = []
  for (const i of items) {
    if (seen.has(i.id)) dups.push(i.id)
    seen.add(i.id)
  }
  return { count: seen.size, dups }
}
