import { test, expect } from "bun:test"
import { mkdir, writeFile } from "fs/promises"
import { accessSync } from "fs"
import { join } from "path"

async function ensureClean(dir: string) {
  try { 
    const { rm } = await import("fs/promises")
    await rm(dir, { recursive: true, force: true }) 
  } catch {}
  await mkdir(dir, { recursive: true })
}

test("getConfig: loads valid config", async () => {
  const testDir = "/tmp/drw-test-config"
  await ensureClean(testDir)
  const configPath = join(testDir, "config.json")
  await writeFile(configPath, JSON.stringify({ folders: ["/tmp/test"] }))

  const origDrwConfig = process.env.DRW_CONFIG
  process.env.DRW_CONFIG = configPath

  try {
    const { getConfig } = await import("../src/config/index.ts")
    const config = await getConfig()
    expect(config.folders).toEqual(["/tmp/test"])
  } finally {
    if (origDrwConfig) process.env.DRW_CONFIG = origDrwConfig
    else delete process.env.DRW_CONFIG
  }
})

test("getConfig: creates default when missing", async () => {
  const configDir = "/tmp/drw-test-default"
  const origXdg = process.env.XDG_CONFIG_HOME
  process.env.XDG_CONFIG_HOME = configDir

  try {
    const { getConfig } = await import("../src/config/index.ts")
    const config = await getConfig()

    const configPath = join(configDir, "drw/config.json")
    expect(config.folders).toEqual([])
    expect(() => accessSync(configPath)).not.toThrow()
  } finally {
    if (origXdg) process.env.XDG_CONFIG_HOME = origXdg
    else delete process.env.XDG_CONFIG_HOME
  }
})

test("validatePaths: throws on non-existent path", async () => {
  const { validatePaths } = await import("../src/config/index.ts")
  expect(() => validatePaths(["/nonexistent/path"])).toThrow(/does not exist/)
})

test("validatePaths: succeeds on existing paths", async () => {
  const { validatePaths } = await import("../src/config/index.ts")
  expect(() => validatePaths(["/tmp"])).not.toThrow()
})