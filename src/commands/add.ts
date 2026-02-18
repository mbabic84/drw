/**
 * Add command handler for drw.
 * 
 * Adds a folder path to the configuration.
 * 
 * @module commands/add
 */

import { accessSync } from "fs"
import { cwd } from "process"
import { getConfig, saveConfig, getConfigPath } from "../config/index.ts"

/**
 * Handles the --add command.
 * 
 * Adds a folder to the configuration. If no path is provided,
 * uses the current working directory.
 * 
 * @param path - Path to add (optional, defaults to cwd)
 */
export async function handleAdd(path?: string): Promise<void> {
  const addPath = path === undefined || path === true ? cwd() : path

  // Validate path exists
  try {
    accessSync(addPath)
  } catch {
    console.error(`Error: Path does not exist: ${addPath}`)
    process.exit(1)
  }

  const config = await getConfig()

  // Check if already exists
  if (config.folders.includes(addPath)) {
    console.log(`Folder already in config: ${addPath}`)
    process.exit(0)
  }

  config.folders.push(addPath)
  await saveConfig(config)
  
  console.log(`Added to config: ${addPath}`)
  console.log(`Config file: ${getConfigPath()}`)
  process.exit(0)
}
