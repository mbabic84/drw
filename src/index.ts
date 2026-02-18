#!/usr/bin/env -S bun run

/**
 * drw (Directory Warp) - Jump to preconfigured directories
 * 
 * A CLI tool that allows quick navigation to frequently-used directories
 * by defining shortcuts. Supports tab completion and shell integration.
 * 
 * @module index
 * @author 
 * @license MIT
 */

import { Command } from "bun:commander"
import {
  handleAdd,
  handleRemove,
  handleList,
  handleInfo,
  handleComplete,
  handleInstall,
  handleJump,
} from "./commands/index.ts"

/**
 * Program version
 */
const VERSION = "0.1.0"

/**
 * Sets up and configures the CLI program.
 * 
 * @returns Configured Commander program instance
 */
function setupProgram(): Command {
  const program = new Command()

  program
    .name("drw")
    .description("Directory Warp - jump to preconfigured directories")
    .version(VERSION)
    .allowUnknownOption()

  // Define CLI options
  program
    .option("--complete [prefix]", "Output space-separated list of shortcut names")
    .option("--list", "List all available shortcuts")
    .option("--info [name]", "Show all paths for a shortcut (useful for duplicates)")
    .option("--install", "Install shell integration to .bashrc/.zshrc")
    .option("--refresh", "Force rebuild of cache")
    .option("--add [path]", "Add a folder to config (default: current directory)")
    .option("--remove [path]", "Remove a folder from config")
    .argument("[name]", "Shortcut name to resolve")

  return program
}

/**
 * Routes the command to the appropriate handler based on options.
 * 
 * @param options - Parsed command options
 * @param name - Positional argument (shortcut name)
 */
async function routeCommand(
  options: Record<string, unknown>,
  name?: string
): Promise<void> {
  // Handle --add
  if (options.add !== undefined) {
    await handleAdd(options.add as string | undefined)
    return
  }

  // Handle --remove
  if (options.remove !== undefined) {
    await handleRemove(options.remove as string | undefined)
    return
  }

  // Handle --complete
  if (options.complete !== undefined) {
    await handleComplete(options.complete as string | true)
    return
  }

  // Handle --list
  if (options.list) {
    await handleList()
    return
  }

  // Handle --info
  if (options.info !== undefined) {
    await handleInfo(options.info as string | undefined)
    return
  }

  // Handle --install
  if (options.install) {
    await handleInstall()
    return
  }

  // Handle --refresh
  if (options.refresh) {
    console.log("Cache refresh not implemented yet - scans are instantaneous for small sets")
    process.exit(0)
    return
  }

  // Default: jump to shortcut
  await handleJump(name)
}

/**
 * Main application entry point.
 */
async function main(): Promise<void> {
  const program = setupProgram()

  program.action(async (name, options) => {
    const opts = program.opts()
    await routeCommand(opts, name)
  })

  await program.parse()
}

// Run the application
main().catch(console.error)
