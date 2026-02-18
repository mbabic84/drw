/**
 * Jump command handler for drw.
 * 
 * Resolves a shortcut name to its full path and outputs it.
 * This is the main command used by the shell function to cd.
 * 
 * @module commands/jump
 */

import { getConfig, validatePaths } from "../config/index.ts"
import { recordUsage } from "../config/usage.ts"
import { scan } from "../core/scanner.ts"

/**
 * Handles the jump command (default operation).
 * 
 * Looks up a shortcut name and outputs its full path.
 * If duplicates exist, warns and uses the first match.
 * Records usage for sorting purposes.
 * 
 * @param name - Shortcut name to resolve (required)
 */
export async function handleJump(name?: string): Promise<void> {
  if (!name) {
    console.error("Usage: drw <shortcut-name>")
    process.exit(1)
  }

  const config = await getConfig()
  
  if (config.folders.length === 0) {
    console.error("No folders configured. Please edit your config to add base directories.")
    process.exit(1)
  }

  validatePaths(config.folders)
  const { shortcuts } = await scan(config.folders)

  if (!shortcuts.has(name)) {
    console.error(`Shortcut not found: ${name}`)
    process.exit(1)
  }

  const paths = shortcuts.get(name)!

  if (paths.length > 1) {
    // Duplicate - warn user but use first match
    console.error(`⚠️  Warning: "${name}" found in multiple locations:`)
    paths.forEach((p, i) => console.error(`  ${i + 1}. ${p}`))
    console.error(`Using: ${paths[0]}`)
    console.log(paths[0])
  } else {
    console.log(paths[0])
  }

  await recordUsage(name)
}
