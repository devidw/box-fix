import { walk } from "https://deno.land/std@0.201.0/fs/walk.ts"
import { copy, emptyDir } from "https://deno.land/std@0.201.0/fs/mod.ts"

const MODE: "sandbox" | "prod" = "prod"
const PROD_DIR = Deno.env.get("PROD_DIR")
const SANDBOX_TPL_DIR = "./sandbox-tpl"
const SANDBOX_DIR = "./sandbox"

if (!PROD_DIR) {
  console.error("env var PROD_DIR missing")
  Deno.exit(1)
}

if (MODE === "sandbox") {
  await emptyDir(SANDBOX_DIR)
  await Deno.remove(SANDBOX_DIR)
  await copy(SANDBOX_TPL_DIR, SANDBOX_DIR)
}

const DIR = MODE === "prod" ? PROD_DIR : SANDBOX_DIR

const entries = []
for await (const entry of walk(DIR)) {
  if (!entry.name.startsWith(" ") && !entry.name.endsWith(" ")) {
    continue
  }
  entries.push(entry)
}

entries.reverse()

for (const entry of entries) {
  if (!entry.name.startsWith(" ") && !entry.name.endsWith(" ")) {
    continue
  }

  const parts = entry.path.split("/")

  parts.pop()

  const newPath =
    parts.join("/") +
    `/${entry.name.trim()}_${globalThis.crypto
      .randomUUID()
      .replaceAll("-", "")}`

  console.info({
    old: entry.path,
    new: newPath,
  })

  const info = await Deno.stat(entry.path)

  await Deno.rename(entry.path, newPath)

  if (!info.mtime) continue

  await Deno.utime(newPath, info.mtime, info.mtime)
}
