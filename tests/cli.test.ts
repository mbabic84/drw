import { test, expect } from "bun:test"
import { mkdir, writeFile, rm } from "fs/promises"
import { join } from "path"

test("CLI: --complete outputs space-separated names", async () => {
  const testDir = "/tmp/drw-cli-test"
  await mkdir(testDir, { recursive: true })

  const base = join(testDir, "projects")
  await mkdir(join(base, "env-foo"), { recursive: true })
  await mkdir(join(base, "env-bar"), { recursive: true })

  const configPath = join(testDir, "config.json")
  await writeFile(configPath, JSON.stringify({ folders: [base] }))

  const origDrwConfig = process.env.DRW_CONFIG
  process.env.DRW_CONFIG = configPath

  try {
    const { getConfig } = await import("../src/config/index.ts")
    const config = await getConfig()
    const { scan } = await import("../src/core/scanner.ts")
    const result = await scan(config.folders)
    const output = [...result.shortcuts.keys()].sort().join(" ")
    expect(output).toBe("env-bar env-foo")
  } finally {
    if (origDrwConfig) process.env.DRW_CONFIG = origDrwConfig
    else delete process.env.DRW_CONFIG
    await rm(testDir, { recursive: true, force: true })
  }
})

test("CLI: --list outputs name: path format", async () => {
  const testDir = "/tmp/drw-cli-list-test"
  await mkdir(testDir, { recursive: true })

  const base = join(testDir, "projects")
  await mkdir(join(base, "env-foo"), { recursive: true })
  await mkdir(join(base, "env-bar"), { recursive: true })

  const configPath = join(testDir, "config.json")
  await writeFile(configPath, JSON.stringify({ folders: [base] }))

  const origDrwConfig = process.env.DRW_CONFIG
  process.env.DRW_CONFIG = configPath

  try {
    const { getConfig } = await import("../src/config/index.ts")
    const config = await getConfig()
    const { scan } = await import("../src/core/scanner.ts")
    const result = await scan(config.folders)

    const lines = []
    for (const [key, paths] of result.shortcuts) {
      lines.push(`${key}: ${paths[0]}`)
    }

    expect(lines.length).toBe(2)
    expect(lines.some(l => l.includes("env-foo") && l.includes(base))).toBe(true)
    expect(lines.some(l => l.includes("env-bar") && l.includes(base))).toBe(true)
  } finally {
    if (origDrwConfig) process.env.DRW_CONFIG = origDrwConfig
    else delete process.env.DRW_CONFIG
    await rm(testDir, { recursive: true, force: true })
  }
})

test("CLI: shell integration generates bash script", () => {
  const { generateBashInit } = require("../src/shell/bash.ts")
  const script = generateBashInit()

  expect(script).toContain("# drw shell integration for Bash")
  expect(script).toContain("_drw_completion")
  expect(script).toContain("complete -o nosort -F _drw_completion drw")
  expect(script).toContain("drw() {")
  expect(script).toContain('builtin cd "$path"')
})

test("CLI: shell integration generates zsh script", () => {
  const { generateZshInit } = require("../src/shell/zsh.ts")
  const script = generateZshInit()

  expect(script).toContain("# drw shell integration for Zsh")
  expect(script).toContain("_drw_completion")
  expect(script).toContain("compdef _drw_completion drw")
  expect(script).toContain("drw() {")
  expect(script).toContain('cd "$path"')
})