/**
 * Shell integration utilities for drw.
 * 
 * Provides shell detection and installation functionality.
 * 
 * @module shell
 */

import { readFileSync, writeFileSync } from "fs"
import { generateBashInit } from "./bash.ts"
import { generateZshInit } from "./zsh.ts"
import type { ShellType } from "../core/types.ts"

/**
 * Marker used to identify the start of drw configuration in shell rc files.
 */
const MARKER_START = "# drw (Directory Warp)"

/**
 * Marker used to identify the end of drw configuration in shell rc files.
 */
const MARKER_END = "# end drw"

/**
 * Detects the current shell from environment variables.
 * 
 * Falls back to 'bash' if detection fails or shell is unsupported.
 * 
 * @returns Detected shell type ('bash' or 'zsh')
 */
export function detectShell(): ShellType {
  const detectedShell = process.env.SHELL?.split("/").pop() || "bash"
  
  if (detectedShell === "zsh") {
    return "zsh"
  }
  
  if (detectedShell !== "bash") {
    console.error(`Unsupported shell: ${detectedShell}. Defaulting to bash.`)
  }
  
  return "bash"
}

/**
 * Gets the appropriate rc file path for the given shell.
 * 
 * @param shell - Shell type
 * @returns Path to the rc file (e.g., ~/.bashrc or ~/.zshrc)
 */
export function getRcFilePath(shell: ShellType): string {
  const home = process.env.HOME || ""
  
  if (shell === "zsh") {
    return `${home}/.zshrc`
  }
  
  return `${home}/.bashrc`
}

/**
 * Generates the shell initialization script for the given shell.
 * 
 * @param shell - Shell type
 * @returns Shell script content
 */
export function generateInitScript(shell: ShellType): string {
  if (shell === "zsh") {
    return generateZshInit()
  }
  
  return generateBashInit()
}

/**
 * Installs drw shell integration into the shell's rc file.
 * 
 * If drw configuration already exists (marked by markers), it will be
 * replaced with the new configuration.
 * 
 * @param shell - Shell type to install for
 * @throws Error if the rc file cannot be read or written
 */
export function installShellIntegration(shell: ShellType): void {
  const rcFile = getRcFilePath(shell)
  const initScript = generateInitScript(shell)
  
  let content: string
  
  try {
    content = readFileSync(rcFile, "utf-8")
  } catch (err) {
    throw new Error(`Failed to read ${rcFile}: ${err}`)
  }
  
  // Remove existing drw configuration if present
  content = removeExistingConfig(content)
  
  // Add new configuration
  content = content.trimEnd() + `\n\n${MARKER_START}\n${initScript}\n${MARKER_END}\n`
  
  try {
    writeFileSync(rcFile, content)
  } catch (err) {
    throw new Error(`Failed to write ${rcFile}: ${err}`)
  }
}

/**
 * Removes existing drw configuration from shell rc file content.
 * 
 * @param content - Current rc file content
 * @returns Content with drw configuration removed
 */
function removeExistingConfig(content: string): string {
  if (!content.includes(MARKER_START) || !content.includes(MARKER_END)) {
    return content
  }
  
  const lines = content.split("\n")
  const newLines: string[] = []
  let skip = false
  
  for (const line of lines) {
    if (line === MARKER_START) {
      skip = true
      continue
    }
    if (skip && line === MARKER_END) {
      skip = false
      continue
    }
    if (!skip) {
      newLines.push(line)
    }
  }
  
  // Clean up excessive blank lines
  return newLines.join("\n").replace(/\n{3,}/g, "\n\n")
}

// Re-export individual generators for direct access
export { generateBashInit } from "./bash.ts"
export { generateZshInit } from "./zsh.ts"
