// Локальное хранилище (браузер). На этапе заглушек — localStorage;
// позже заменится на API SkyWorker.

const FAV_KEY = 'sw_favorites'
const REQ_KEY = 'sw_requests'

export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
}
export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}
export function toggleFavorite(id: string): string[] {
  const f = getFavorites()
  const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
  localStorage.setItem(FAV_KEY, JSON.stringify(next))
  return next
}

export interface RequestItem {
  profileId: string
  profileName: string
  region: string
  message: string
  createdAt: string
}
export function getRequests(): RequestItem[] {
  try { return JSON.parse(localStorage.getItem(REQ_KEY) || '[]') } catch { return [] }
}
export function addRequest(r: RequestItem): void {
  const list = getRequests()
  list.unshift(r)
  localStorage.setItem(REQ_KEY, JSON.stringify(list))
}
