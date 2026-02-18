/**
 * Complete command handler for drw.
 * 
 * Generates tab completion suggestions for shell integration.
 * 
 * @module commands/complete
 */

import { getConfig, validatePaths } from "../config/index.ts"
import { getUsage, sortByUsage } from "../config/usage.ts"
import { scan } from "../core/scanner.ts"

/**
 * Handles the --complete command.
 * 
 * Outputs a space-separated list of shortcut names for shell completion.
 * Names are sorted by most recently used first.
 * If a prefix is provided, only matching shortcuts are returned.
 * 
 * @param prefix - Optional prefix to filter shortcuts
 */
export async function handleComplete(prefix?: string | true): Promise<void> {
  const config = await getConfig()
  
  if (config.folders.length === 0) {
    console.error("No folders configured.")
    process.exit(1)
  }

  validatePaths(config.folders)
  const { shortcuts } = await scan(config.folders)
  const usage = await getUsage()

  // Get and sort shortcut names
  const names = Array.from(shortcuts.keys())
  const sortedNames = sortByUsage(names, usage)

  // Filter by prefix if provided
  const filterPrefix = prefix === true ? "" : (prefix || "")
  const filteredNames = filterPrefix 
    ? sortedNames.filter(s => s.startsWith(filterPrefix))
    : sortedNames

  console.log(filteredNames.join(" "))
  process.exit(0)
}
