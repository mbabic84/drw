/**
 * Core type definitions for the drw (Directory Warp) application.
 * 
 * @module core/types
 */

/**
 * Configuration structure for drw.
 * @interface
 */
export interface Config {
  /** Array of base folder paths to scan for shortcuts */
  folders: string[]
}

/**
 * Usage tracking record mapping shortcut names to timestamps.
 * @interface
 */
export interface UsageRecord {
  /** Map of shortcut name to last access timestamp (Unix milliseconds) */
  [shortcut: string]: number
}

/**
 * Result of scanning directories for shortcuts.
 * @interface
 */
export interface ScanResult {
  /** Map of shortcut name to array of full paths */
  shortcuts: Map<string, string[]>
  /** Array of shortcut names that appear in multiple locations */
  duplicates: string[]
}

/**
 * Shell types supported by drw.
 */
export type ShellType = 'bash' | 'zsh'

/**
 * Command context passed to command handlers.
 * @interface
 */
export interface CommandContext {
  /** Parsed command options */
  options: Record<string, unknown>
  /** Positional arguments */
  args: string[]
}

/**
 * Command handler function type.
 */
export type CommandHandler = (context: CommandContext) => Promise<void>
