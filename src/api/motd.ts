export interface Motd {
  text: string
}

export interface MotdCount {
  count: number
}

export async function fetchMotd(): Promise<Motd> {
  const res = await fetch('/api/motd')
  if (!res.ok) throw new Error(`Failed to fetch motd: ${res.status}`)
  return res.json()
}

export async function fetchMotdCount(): Promise<MotdCount> {
  const res = await fetch('/api/motd/count')
  if (!res.ok) throw new Error(`Failed to fetch motd count: ${res.status}`)
  return res.json()
}
