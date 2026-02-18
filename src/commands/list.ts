/**
 * List command handler for drw.
 * 
 * Displays all available shortcuts sorted by recent usage.
 * 
 * @module commands/list
 */

import { getConfig, validatePaths } from "../config/index.ts"
import { getUsage, sortByUsage, hasUsage } from "../config/usage.ts"
import { scan } from "../core/scanner.ts"

/**
 * Handles the --list command.
 * 
 * Scans configured folders and displays all available shortcuts.
 * Shortcuts are sorted by most recently used first.
 * Shows warnings for duplicate shortcuts.
 */
export async function handleList(): Promise<void> {
  const config = await getConfig()
  
  if (config.folders.length === 0) {
    console.error("No folders configured.")
    process.exit(1)
  }

  validatePaths(config.folders)
  const { shortcuts, duplicates } = await scan(config.folders)
  const usage = await getUsage()

  // Sort entries by usage (most recent first)
  const sortedEntries = sortShortcutsByUsage(shortcuts, usage)

  // Show warning about duplicates
  if (duplicates.length > 0) {
    console.error(`⚠️  Warning: Duplicate shortcuts found: ${duplicates.join(", ")}`)
    console.error("   Using first match. Use --info <name> to see all options.\n")
  }

  // Display shortcuts
  for (const [key, paths] of sortedEntries) {
    const recentMarker = hasUsage(key, usage) ? " ⭐" : ""
    
    if (paths.length === 1) {
      console.log(`${key}: ${paths[0]}${recentMarker}`)
    } else {
      console.log(`${key}:${recentMarker}`)
      paths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`))
    }
  }

  process.exit(0)
}

/**
 * Sorts shortcut entries by usage (most recent first).
 * 
 * @param shortcuts - Map of shortcuts to paths
 * @param usage - Usage record
 * @returns Sorted array of [name, paths] entries
 */
function sortShortcutsByUsage(
  shortcuts: Map<string, string[]>,
  usage: Record<string, number>
): Array<[string, string[]]> {
  const entries = Array.from(shortcuts.entries())
  
  return entries.sort((a, b) => {
    const aTime = usage[a[0]] || 0
    const bTime = usage[b[0]] || 0
    return bTime - aTime
  })
}
