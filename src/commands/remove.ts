/**
 * Remove command handler for drw.
 * 
 * Removes a folder path from the configuration.
 * 
 * @module commands/remove
 */

import { getConfig, saveConfig, validatePaths } from "../config/index.ts"
import { scan } from "../core/scanner.ts"

/**
 * Handles the --remove command.
 * 
 * Removes a folder from the configuration. The path must be an exact
 * match for a configured base folder (not a shortcut).
 * 
 * @param path - Path to remove (required)
 */
export async function handleRemove(path?: string): Promise<void> {
  if (!path || path === true) {
    console.error("Error: Please specify a folder path to remove")
    process.exit(1)
  }

  const config = await getConfig()

  // Normalize path for comparison (remove trailing slash)
  const normalizedRemove = normalizePath(path)

  // Check if it's a base folder
  const index = config.folders.findIndex(f => normalizePath(f) === normalizedRemove)
  
  if (index !== -1) {
    config.folders.splice(index, 1)
    await saveConfig(config)
    console.log(`Removed from config: ${path}`)
    process.exit(0)
  }

  // Check if it's a shortcut
  validatePaths(config.folders)
  const { shortcuts } = await scan(config.folders)

  // Find the shortcut that matches the path
  for (const [name, paths] of shortcuts) {
    if (paths.some(p => normalizePath(p) === normalizedRemove)) {
      console.error(`Error: "${path}" is a shortcut "${name}", not a base folder.`)
      console.error("   To remove it, remove the base folder it belongs to with: drw --remove <base-folder>")
      process.exit(1)
    }
  }

  // Check if it's a subdirectory of a base folder
  for (const base of config.folders) {
    const normalizedBase = normalizePath(base)
    if (path.startsWith(normalizedBase + "/")) {
      console.error(`Error: "${path}" is a subdirectory of "${base}", not a configured base folder.`)
      console.error("   Only base folders can be removed. Remove the parent folder instead: drw --remove <base-folder>")
      process.exit(1)
    }
  }

  console.error(`Error: Folder not found in config: ${path}`)
  process.exit(1)
}

/**
 * Normalizes a path by removing trailing slashes.
 * 
 * @param path - Path to normalize
 * @returns Normalized path
 */
function normalizePath(path: string): string {
  return path.replace(/\/$/, "")
}
