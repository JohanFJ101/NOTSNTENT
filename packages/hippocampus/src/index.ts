import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

// Placeholder short-term memory implementation — full Hippocampus with
// hot/warm/cold tiers comes later. For now: one flat JSON file, capped size.

const MEMORY_FILE = path.join(process.cwd(), 'data', 'hippocampus.json')
const MAX_ENTRIES = 40

type StoredEntry = {
  role: 'user' | 'assistant'
  text: string
  timestamp: number
}

async function readEntries(): Promise<StoredEntry[]> {
  try {
    const raw = await readFile(MEMORY_FILE, 'utf-8')
    return JSON.parse(raw) as StoredEntry[]
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

export async function getContext(): Promise<string[]> {
  const entries = await readEntries()
  return entries.map(entry => `${entry.role}: ${entry.text}`)
}

export async function saveMessage(role: 'user' | 'assistant', text: string): Promise<void> {
  const entries = await readEntries()

  entries.push({ role, text, timestamp: Date.now() })

  const trimmed = entries.length > MAX_ENTRIES
    ? entries.slice(entries.length - MAX_ENTRIES)
    : entries

  await mkdir(path.dirname(MEMORY_FILE), { recursive: true })
  await writeFile(MEMORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8')
}