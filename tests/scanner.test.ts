import { test, expect } from "bun:test"
import { mkdir, rm } from "fs/promises"
import { join } from "path"

test("scan: finds immediate subdirectories", async () => {
  const base = "/tmp/drw-scan-test"
  await rm(base, { recursive: true, force: true })
  await mkdir(join(base, "dir1"), { recursive: true })
  await mkdir(join(base, "dir2"), { recursive: true })

  const { scan } = await import("../src/core/scanner.ts")
  const result = await scan([base])

  expect(result.shortcuts.size).toBe(2)
  expect(result.shortcuts.get("dir1")).toEqual([join(base, "dir1")])
  expect(result.shortcuts.get("dir2")).toEqual([join(base, "dir2")])
  expect(result.duplicates).toEqual([])

  await rm(base, { recursive: true, force: true })
})

test("scan: works with multiple base paths", async () => {
  const base1 = "/tmp/drw-base1"
  const base2 = "/tmp/drw-base2"

  await rm(base1, { recursive: true, force: true })
  await rm(base2, { recursive: true, force: true })

  await mkdir(join(base1, "a"), { recursive: true })
  await mkdir(join(base2, "b"), { recursive: true })

  const { scan } = await import("../src/core/scanner.ts")
  const result = await scan([base1, base2])

  expect(result.shortcuts.size).toBe(2)
  expect(result.shortcuts.get("a")).toEqual([join(base1, "a")])
  expect(result.shortcuts.get("b")).toEqual([join(base2, "b")])
  expect(result.duplicates).toEqual([])

  await rm(base1, { recursive: true, force: true })
  await rm(base2, { recursive: true, force: true })
})

test("scan: handles duplicate names across bases", async () => {
  const base1 = "/tmp/drw-dup1"
  const base2 = "/tmp/drw-dup2"

  await rm(base1, { recursive: true, force: true })
  await rm(base2, { recursive: true, force: true })

  await mkdir(join(base1, "common"), { recursive: true })
  await mkdir(join(base2, "common"), { recursive: true })

  const { scan } = await import("../src/core/scanner.ts")
  const result = await scan([base1, base2])

  // Should now handle duplicates instead of throwing
  expect(result.duplicates).toContain("common")
  expect(result.shortcuts.get("common")?.length).toBe(2)

  await rm(base1, { recursive: true, force: true })
  await rm(base2, { recursive: true, force: true })
})