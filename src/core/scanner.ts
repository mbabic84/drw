/**
 * Directory scanner module for drw.
 * 
 * Scans configured base directories and builds a mapping of folder names
 * (shortcuts) to their full paths. Detects duplicate shortcuts across
 * multiple base directories.
 * 
 * @module core/scanner
 */

import { readdir } from "fs/promises"
import { join } from "path"
import type { ScanResult } from "./types.ts"

/**
 * Scans base directories to find all subdirectories and build shortcut mappings.
 * 
 * Each immediate subdirectory of a base path becomes a shortcut. For example,
 * if "/projects" is a base path and contains "myapp/", "myapp" becomes a
 * shortcut pointing to "/projects/myapp".
 * 
 * @param basePaths - Array of base directory paths to scan
 * @returns ScanResult containing shortcuts map and duplicate names
 * @throws Error if a base directory cannot be read
 * 
 * @example
 * ```typescript
 * const result = await scan(["/projects", "/work"])
 * // result.shortcuts.get("myapp") => ["/projects/myapp"]
 * // result.duplicates => ["shared-name"] // if exists in both bases
 * ```
 */
export async function scan(basePaths: string[]): Promise<ScanResult> {
  const shortcuts = new Map<string, string[]>()
  const duplicates: string[] = []

  for (const basePath of basePaths) {
    const entries = await readDirectoryEntries(basePath)
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        processDirectoryEntry(entry.name, basePath, shortcuts, duplicates)
      }
    }
  }

  return { shortcuts, duplicates }
}

/**
 * Reads directory entries from a base path.
 * 
 * @param basePath - Directory path to read
 * @returns Array of directory entries
 * @throws Error if directory cannot be read
 */
async function readDirectoryEntries(basePath: string) {
  try {
    return await readdir(basePath, { withFileTypes: true })
  } catch (error) {
    throw new Error(
      `Failed to scan directory ${basePath}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Processes a directory entry and updates the shortcuts map.
 * 
 * @param name - Directory name (becomes the shortcut)
 * @param basePath - Base directory containing this entry
 * @param shortcuts - Map to update with shortcut mappings
 * @param duplicates - Array to track duplicate shortcut names
 */
function processDirectoryEntry(
  name: string,
  basePath: string,
  shortcuts: Map<string, string[]>,
  duplicates: string[]
): void {
  const fullPath = join(basePath, name)
  
  if (shortcuts.has(name)) {
    // Duplicate shortcut found - add to existing array
    if (!duplicates.includes(name)) {
      duplicates.push(name)
    }
    shortcuts.get(name)!.push(fullPath)
  } else {
    // New shortcut
    shortcuts.set(name, [fullPath])
  }
}
