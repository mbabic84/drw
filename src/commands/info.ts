/**
 * Info command handler for drw.
 * 
 * Displays detailed information about a specific shortcut,
 * including all locations if duplicates exist.
 * 
 * @module commands/info
 */

import { getConfig, validatePaths } from "../config/index.ts"
import { scan } from "../core/scanner.ts"

/**
 * Handles the --info command.
 * 
 * Shows all paths for a given shortcut name. Useful when
 * there are duplicate shortcuts across multiple base directories.
 * 
 * @param name - Shortcut name to look up (required)
 */
export async function handleInfo(name?: string): Promise<void> {
  if (!name || name === true) {
    console.error("Error: Please specify a shortcut name")
    process.exit(1)
  }

  const config = await getConfig()
  validatePaths(config.folders)
  const { shortcuts } = await scan(config.folders)

  if (!shortcuts.has(name)) {
    console.error(`Shortcut not found: ${name}`)
    process.exit(1)
  }

  const paths = shortcuts.get(name)!
  console.log(`"${name}" found in ${paths.length} location(s):`)
  paths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`))

  if (paths.length > 1) {
    console.log(`\nUsing first match: ${paths[0]}`)
  }

  process.exit(0)
}
