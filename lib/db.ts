import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import type { SiteContent } from "./content-types"

const CONTENT_PATH = join(process.cwd(), "data", "content.json")
const TMP_CONTENT_PATH = "/tmp/content.json"
const CLOUD_STORE_URL = "https://jsonblob.com/api/jsonBlob/019f8911-1498-7d39-ac28-00e66d1d57a4"

declare global {
  // eslint-disable-next-line no-var
  var _siteContentCache: SiteContent | undefined
}

export async function getSiteContent(): Promise<SiteContent> {
  // 1. Check in-memory cache
  if (globalThis._siteContentCache) {
    return globalThis._siteContentCache
  }

  // 2. Try Netlify Blobs if in Netlify runtime
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

  // 3. Persistent Cloud Store (JSONBlob) - ensures data survives container recycles & cold starts
  try {
    const res = await fetch(CLOUD_STORE_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    if (res.ok) {
      const data = (await res.json()) as SiteContent
      if (data && Object.keys(data).length > 0) {
        globalThis._siteContentCache = data
        return data
      }
    }
  } catch (err) {
    console.error("Error reading from Persistent Cloud Store:", err)
  }

  // 4. Check /tmp/content.json
  try {
    if (existsSync(TMP_CONTENT_PATH)) {
      const raw = readFileSync(TMP_CONTENT_PATH, "utf-8")
      const parsed = JSON.parse(raw) as SiteContent
      globalThis._siteContentCache = parsed
      return parsed
    }
  } catch (err) {
    console.error("Error reading /tmp/content.json:", err)
  }

  // 5. Default fallback: data/content.json
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
  // Update in-memory cache immediately
  globalThis._siteContentCache = data

  // 1. Sync to Persistent Cloud Store (JSONBlob)
  try {
    await fetch(CLOUD_STORE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    })
  } catch (err) {
    console.error("Error updating Persistent Cloud Store:", err)
  }

  // 2. Try Netlify Blobs if in Netlify runtime
  if (process.env.NETLIFY === "true") {
    try {
      const { getStore } = await import("@netlify/blobs")
      const store = getStore("site-content")
      await store.setJSON("content", data)
    } catch (err) {
      console.error("Error writing to Netlify Blobs:", err)
    }
  }

  // 3. Save to local /tmp directory as backup
  try {
    writeFileSync(TMP_CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Ignore read-only filesystem errors
  }

  // 4. Save to local file if writable (local dev)
  try {
    writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Ignore read-only filesystem errors
  }
}
