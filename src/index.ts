#!/usr/bin/env -S bun run

import {
  handleAdd,
  handleRemove,
  handleList,
  handleInfo,
  handleComplete,
  handleInstall,
  handleJump,
} from "./commands/index.ts"

const VERSION = "0.5.3"

interface ParsedArgs {
  options: Record<string, unknown>
  positional: string[]
}

function parseArgs(): ParsedArgs {
  const options: Record<string, unknown> = {}
  const positional: string[] = []
  const args = process.argv.slice(2)

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg === "--help" || arg === "-h") {
      console.log(`drw - Directory Warp (v${VERSION})
Jump to preconfigured directories

USAGE:
  drw [OPTIONS] [SHORTCUT]

OPTIONS:
  --complete [PREFIX]  Output space-separated list of shortcut names
  --list               List all available shortcuts
  --info [NAME]        Show all paths for a shortcut
  --install            Install shell integration to .bashrc/.zshrc
  --refresh            Force rebuild of cache
  --add [PATH]         Add a folder to config (default: current directory)
  --remove [PATH]      Remove a folder from config
  --version, -v        Show version
  --help, -h           Show this help

EXAMPLES:
  drw myproject        Jump to directory with shortcut "myproject"
  drw --list           List all shortcuts
  drw --add            Add current directory as shortcut`)
      process.exit(0)
    }
    
    if (arg === "--version" || arg === "-v") {
      console.log(VERSION)
      process.exit(0)
    }
    
    if (arg === "--complete") {
      options.complete = args[i + 1] || true
      i++
      continue
    }
    
    if (arg.startsWith("--complete=")) {
      options.complete = arg.slice("--complete=".length) || true
      continue
    }
    
    if (arg === "--list") {
      options.list = true
      continue
    }
    
    if (arg === "--info") {
      options.info = args[i + 1] || true
      i++
      continue
    }
    
    if (arg.startsWith("--info=")) {
      options.info = arg.slice("--info=".length) || true
      continue
    }
    
    if (arg === "--install") {
      options.install = true
      continue
    }
    
    if (arg === "--refresh") {
      options.refresh = true
      continue
    }
    
    if (arg === "--add") {
      options.add = args[i + 1] || true
      i++
      continue
    }
    
    if (arg.startsWith("--add=")) {
      options.add = arg.slice("--add=".length) || true
      continue
    }
    
    if (arg === "--remove") {
      options.remove = args[i + 1] || true
      i++
      continue
    }
    
    if (arg.startsWith("--remove=")) {
      options.remove = arg.slice("--remove=".length) || true
      continue
    }
    
    if (arg.startsWith("--")) {
      console.error(`Unknown option: ${arg}`)
      process.exit(1)
    }
    
    positional.push(arg)
  }

  return { options, positional }
}

async function routeCommand(
  options: Record<string, unknown>,
  name?: string
): Promise<void> {
  if (options.add !== undefined) {
    await handleAdd(options.add as string | undefined)
    return
  }

  if (options.remove !== undefined) {
    await handleRemove(options.remove as string | undefined)
    return
  }

  if (options.complete !== undefined) {
    await handleComplete(options.complete as string | true)
    return
  }

  if (options.list) {
    await handleList()
    return
  }

  if (options.info !== undefined) {
    await handleInfo(options.info as string | undefined)
    return
  }

  if (options.install) {
    await handleInstall()
    return
  }

  if (options.refresh) {
    console.log("Cache refresh not implemented yet - scans are instantaneous for small sets")
    process.exit(0)
    return
  }

  await handleJump(name)
}

async function main(): Promise<void> {
  const { options, positional } = parseArgs()
  await routeCommand(options, positional[0])
}

main().catch(console.error)
