import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import type { SiteContent } from "./content-types"

const CONTENT_PATH = join(process.cwd(), "data", "content.json")

export async function getSiteContent(): Promise<SiteContent> {
  // If we are in the Netlify runtime, use Netlify Blobs
  if (process.env.NETLIFY === "true") {
    try {
      const { getStore } = await import("@netlify/blobs")
      const store = getStore("site-content")
      const data = await store.get("content", { type: "json" })
      if (data) {
        return data as SiteContent
      }
    } catch (err) {
      console.error("Error reading from Netlify Blobs:", err)
    }
  }

  // Local development / fallback
  try {
    const raw = readFileSync(CONTENT_PATH, "utf-8")
    return JSON.parse(raw) as SiteContent
  } catch (err) {
    console.error("Error reading local content file:", err)
    return {} as SiteContent
  }
}

export async function setSiteContent(data: SiteContent): Promise<void> {
  // If we are in the Netlify runtime, use Netlify Blobs
  if (process.env.NETLIFY === "true") {
    try {
      const { getStore } = await import("@netlify/blobs")
      const store = getStore("site-content")
      await store.setJSON("content", data)
      return
    } catch (err) {
      console.error("Error writing to Netlify Blobs:", err)
      throw err
    }
  }

  // Local development / fallback
  try {
    writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.error("Error writing local content file:", err)
    throw err
  }
}
