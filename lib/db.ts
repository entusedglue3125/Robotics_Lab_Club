import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import type { SiteContent } from "./content-types"

const CONTENT_PATH = join(process.cwd(), "data", "content.json")
const TMP_CONTENT_PATH = "/tmp/content.json"

declare global {
  // eslint-disable-next-line no-var
  var _siteContentCache: SiteContent | undefined
}

export async function getSiteContent(): Promise<SiteContent> {
  // 1. Check in-memory cache
  if (globalThis._siteContentCache) {
    return globalThis._siteContentCache
  }

  // 2. If in Netlify runtime, try Netlify Blobs
  if (process.env.NETLIFY === "true") {
    try {
      const { getStore } = await import("@netlify/blobs")
      const store = getStore("site-content")
      const data = await store.get("content", { type: "json" })
      if (data) {
        globalThis._siteContentCache = data as SiteContent
        return globalThis._siteContentCache
      }
    } catch (err) {
      console.error("Error reading from Netlify Blobs:", err)
    }
  }

  // 3. Try reading from /tmp/content.json if written previously
  try {
    if (existsSync(TMP_CONTENT_PATH)) {
      const raw = readFileSync(TMP_CONTENT_PATH, "utf-8")
      const parsed = JSON.parse(raw) as SiteContent
      globalThis._siteContentCache = parsed
      return parsed
    }
  } catch (err) {
    console.error("Error reading from /tmp/content.json:", err)
  }

  // 4. Local development / default seed file data/content.json
  try {
    const raw = readFileSync(CONTENT_PATH, "utf-8")
    const parsed = JSON.parse(raw) as SiteContent
    globalThis._siteContentCache = parsed
    return parsed
  } catch (err) {
    console.error("Error reading local content file:", err)
    return {} as SiteContent
  }
}

export async function setSiteContent(data: SiteContent): Promise<void> {
  // Always update in-memory cache immediately
  globalThis._siteContentCache = data

  // 1. If in Netlify runtime, attempt writing to Netlify Blobs
  if (process.env.NETLIFY === "true") {
    try {
      const { getStore } = await import("@netlify/blobs")
      const store = getStore("site-content")
      await store.setJSON("content", data)
      return
    } catch (err) {
      console.error("Error writing to Netlify Blobs, falling back to /tmp:", err)
      try {
        writeFileSync(TMP_CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
      } catch (tmpErr) {
        console.error("Error writing to /tmp/content.json:", tmpErr)
      }
      return
    }
  }

  // 2. Local development
  try {
    writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.error("Error writing local content file, writing to /tmp:", err)
    try {
      writeFileSync(TMP_CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
    } catch (tmpErr) {
      console.error("Error writing /tmp fallback file:", tmpErr)
    }
  }
}
