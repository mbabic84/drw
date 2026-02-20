/**
 * Configuration management module for drw.
 * 
 * Handles loading, saving, and validating the drw configuration.
 * Configurations specify which base directories to scan for shortcuts.
 * 
 * @module config
 */

import { mkdir, readFile, writeFile } from "fs/promises"
import { dirname } from "path"
import { access } from "fs/promises"
import { resolveConfigPaths, getConfigPath } from "./paths.ts"
import type { Config } from "../core/types.ts"

/**
 * Default configuration used when no config file exists.
 */
const DEFAULT_CONFIG: Config = {
  folders: [],
}

/**
 * Loads the configuration from disk.
 * 
 * Searches for config files in the following order:
 * 1. DRW_CONFIG environment variable
 * 2. XDG_CONFIG_HOME/drw/config.json
 * 3. ~/.config/drw/config.json
 * 
 * If no config is found, creates a default empty config at the primary location.
 * 
 * @returns The loaded or default configuration
 * @throws Error if a config file exists but is invalid
 */
export async function getConfig(): Promise<Config> {
  const configPaths = resolveConfigPaths()

  for (const path of configPaths) {
    try {
      await access(path)
      return await loadConfigFile(path)
    } catch {
      // File doesn't exist, try next path
    }
  }

  // No config found - create default
  return await createDefaultConfig()
}

/**
 * Loads and validates a configuration file.
 * 
 * @param path - Path to the config file
 * @returns Parsed and validated config
 * @throws Error if config is invalid
 */
async function loadConfigFile(path: string): Promise<Config> {
  const content = await readFile(path, "utf-8")
  const config = JSON.parse(content) as Config
  
  if (!Array.isArray(config.folders)) {
    throw new Error('Invalid config: "folders" must be an array')
  }
  
  return config
}

/**
 * Creates a default configuration file.
 * 
 * @returns The default configuration
 */
async function createDefaultConfig(): Promise<Config> {
  const configPath = getConfigPath()
  const dir = dirname(configPath)
  
  await mkdir(dir, { recursive: true })
  await writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2))

  console.error(
    `⚠️  No configuration found. Created default config at ${configPath}\n` +
    `Please edit it to add your base directories under "folders".`
  )

  return DEFAULT_CONFIG
}

/**
 * Saves the configuration to disk.
 * 
 * Writes to the primary config location (determined by getConfigPath).
 * Creates parent directories if they don't exist.
 * 
 * @param config - Configuration to save
 */
export async function saveConfig(config: Config): Promise<void> {
  const configPath = getConfigPath()
  const dir = dirname(configPath)
  
  await mkdir(dir, { recursive: true })
  await writeFile(configPath, JSON.stringify(config, null, 2))
}

/**
 * Validates that all configured folder paths exist.
 * 
 * @param folders - Array of folder paths to validate
 * @throws Error if any folder does not exist
 */
export async function validatePaths(folders: string[]): Promise<void> {
  for (const folder of folders) {
    try {
      await access(folder)
    } catch {
      throw new Error(`Configured folder does not exist: ${folder}`)
    }
  }
}

// Re-export paths module for convenience
export { getConfigPath } from "./paths.ts"
