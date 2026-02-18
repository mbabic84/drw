/**
 * Configuration path resolution module for drw.
 * 
 * Handles XDG Base Directory specification and environment variable
 * overrides for config file locations.
 * 
 * @module config/paths
 * @see {@link https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html|XDG Base Directory Specification}
 */

import { join } from "path"

/**
 * Environment variable name for custom config path override.
 */
const ENV_CONFIG_PATH = "DRW_CONFIG"

/**
 * Environment variable name for XDG config home.
 */
const ENV_XDG_CONFIG_HOME = "XDG_CONFIG_HOME"

/**
 * Default config directory name.
 */
const CONFIG_DIR_NAME = "drw"

/**
 * Default config file name.
 */
const CONFIG_FILE_NAME = "config.json"

/**
 * Usage data file name.
 */
const USAGE_FILE_NAME = "usage.json"

/**
 * Resolves potential config file paths in priority order.
 * 
 * Priority (highest to lowest):
 * 1. DRW_CONFIG environment variable
 * 2. XDG_CONFIG_HOME/drw/config.json
 * 3. ~/.config/drw/config.json
 * 
 * @returns Array of potential config file paths
 */
export function resolveConfigPaths(): string[] {
  const paths: string[] = []
  
  if (process.env[ENV_CONFIG_PATH]) {
    paths.push(process.env[ENV_CONFIG_PATH])
  }
  
  if (process.env[ENV_XDG_CONFIG_HOME]) {
    paths.push(join(process.env[ENV_XDG_CONFIG_HOME], CONFIG_DIR_NAME, CONFIG_FILE_NAME))
  }
  
  paths.push(join(getHomeDirectory(), ".config", CONFIG_DIR_NAME, CONFIG_FILE_NAME))
  
  return paths
}

/**
 * Gets the primary config file path.
 * This is the path used for creating new configs or saving changes.
 * 
 * @returns Primary config file path
 */
export function getConfigPath(): string {
  return resolveConfigPaths()[0]
}

/**
 * Resolves the usage data file path.
 * 
 * Uses XDG_CONFIG_HOME if available, otherwise falls back to ~/.config.
 * 
 * @returns Path to the usage.json file
 */
export function resolveUsagePath(): string {
  if (process.env[ENV_XDG_CONFIG_HOME]) {
    return join(process.env[ENV_XDG_CONFIG_HOME], CONFIG_DIR_NAME, USAGE_FILE_NAME)
  }
  return join(getHomeDirectory(), ".config", CONFIG_DIR_NAME, USAGE_FILE_NAME)
}

/**
 * Gets the user's home directory.
 * 
 * @returns Home directory path
 * @throws Error if HOME environment variable is not set
 */
function getHomeDirectory(): string {
  if (!process.env.HOME) {
    throw new Error("HOME environment variable is not set")
  }
  return process.env.HOME
}
