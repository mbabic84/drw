/**
 * Usage tracking module for drw.
 * 
 * Tracks which shortcuts are used most recently to provide
 * better sorting in completions and listings.
 * 
 * @module config/usage
 */

import { mkdir, writeFile } from "fs/promises"
import { dirname } from "path"
import { resolveUsagePath } from "./paths.ts"
import type { UsageRecord } from "../core/types.ts"

/**
 * Reads the usage tracking data from disk.
 * 
 * Returns an empty record if the file doesn't exist or is corrupted.
 * 
 * @returns Usage record mapping shortcut names to timestamps
 */
export async function getUsage(): Promise<UsageRecord> {
  const usagePath = resolveUsagePath()
  
  try {
    if (await Bun.file(usagePath).exists()) {
      const content = await Bun.file(usagePath).text()
      return JSON.parse(content) as UsageRecord
    }
  } catch {
    // Ignore errors (file doesn't exist or is corrupted), return empty record
  }
  
  return {}
}

/**
 * Records usage of a shortcut by updating its timestamp.
 * 
 * Updates the usage file with the current timestamp for the given shortcut.
 * Creates the config directory if it doesn't exist.
 * 
 * @param shortcut - Name of the shortcut being used
 */
export async function recordUsage(shortcut: string): Promise<void> {
  const usagePath = resolveUsagePath()
  const usage = await getUsage()
  
  usage[shortcut] = Date.now()
  
  const dir = dirname(usagePath)
  await mkdir(dir, { recursive: true })
  await writeFile(usagePath, JSON.stringify(usage))
}

/**
 * Sorts shortcut names by most recently used first.
 * 
 * @param shortcuts - Array of shortcut names to sort
 * @param usage - Usage record with timestamps
 * @returns Sorted array (most recent first, undefined last)
 */
export function sortByUsage(shortcuts: string[], usage: UsageRecord): string[] {
  return [...shortcuts].sort((a, b) => {
    const aTime = usage[a] || 0
    const bTime = usage[b] || 0
    return bTime - aTime
  })
}

/**
 * Checks if a shortcut has been used (has a recorded timestamp).
 * 
 * @param shortcut - Shortcut name to check
 * @param usage - Usage record
 * @returns True if the shortcut has been used
 */
export function hasUsage(shortcut: string, usage: UsageRecord): boolean {
  return shortcut in usage
}
