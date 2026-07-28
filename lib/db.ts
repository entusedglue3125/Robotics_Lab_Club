import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import type { SiteContent } from "./content-types"

const CONTENT_PATH = join(process.cwd(), "data", "content.json")
const TMP_CONTENT_PATH = "/tmp/content.json"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = process.env.GITHUB_OWNER || "entusedglue3125"
const GITHUB_REPO = process.env.GITHUB_REPO || "Robotics_Lab_Club"
const GITHUB_CONTENT_FILE = process.env.GITHUB_CONTENT_FILE || "data/content.json"

declare global {
  // eslint-disable-next-line no-var
  var _siteContentCache: SiteContent | undefined
  // eslint-disable-next-line no-var
  var _siteContentCacheTime: number | undefined
}

// Cache TTL: 30 seconds between GitHub re-fetches
const CACHE_TTL_MS = 30000

/**
 * Recursively strip base64 data: URLs from any object.
 * Replaces them with empty string to prevent bloating content.json.
 * Images should be uploaded separately via /api/upload which stores them on GitHub.
 */
function stripBase64Images(obj: unknown): unknown {
  if (typeof obj === "string") {
    return obj.startsWith("data:image") ? "" : obj
  }
  if (Array.isArray(obj)) {
    return obj.map(stripBase64Images)
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = stripBase64Images(value)
    }
    return result
  }
  return obj
}

/**
 * Migrate legacy field names from older admin versions.
 * e.g. gallery images used `url` instead of `src` in older code.
 */
function migrateLegacyFields(data: SiteContent): SiteContent {
  if (data.gallery?.images) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const migrated = (data.gallery.images as any[]).map((img: any) => {
      if (img.url && !img.src) {
        return { ...img, src: img.url as string, url: undefined }
      }
      return img
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.gallery.images = migrated as any
  }
  return data
}

/**
 * Fetch latest content.json directly from GitHub API.
 * Uses cache-busting timestamp so GitHub never returns a stale CDN-cached version.
 */
async function fetchFromGitHub(): Promise<SiteContent | null> {
  if (!GITHUB_TOKEN) return null
  try {
    // Add timestamp as query param to bust any intermediate caches
    const bust = Date.now()
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_CONTENT_FILE}?t=${bust}`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
      },
      cache: "no-store",
    })
    if (!res.ok) {
      console.error("GitHub fetch failed:", res.status)
      return null
    }
    const text = await res.text()
    return migrateLegacyFields(JSON.parse(text) as SiteContent)
  } catch (err) {
    console.error("Failed to fetch content from GitHub:", err)
    return null
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const now = Date.now()
  const cacheAge = now - (globalThis._siteContentCacheTime ?? 0)

  // 1. Return in-memory cache if fresh
  if (globalThis._siteContentCache && cacheAge < CACHE_TTL_MS) {
    return globalThis._siteContentCache
  }

  // 2. Fetch fresh from GitHub API (always gets latest committed content)
  const githubContent = await fetchFromGitHub()
  if (githubContent) {
    globalThis._siteContentCache = githubContent
    globalThis._siteContentCacheTime = now
    return githubContent
  }

  // 3. Fallback: stale cache is better than nothing
  if (globalThis._siteContentCache) {
    return globalThis._siteContentCache
  }

  // 4. Check /tmp/content.json (written by setSiteContent in this runtime session)
  try {
    if (existsSync(TMP_CONTENT_PATH)) {
      const raw = readFileSync(TMP_CONTENT_PATH, "utf-8")
      const parsed = migrateLegacyFields(JSON.parse(raw) as SiteContent)
      globalThis._siteContentCache = parsed
      globalThis._siteContentCacheTime = now
      return parsed
    }
  } catch (err) {
    console.error("Error reading /tmp/content.json:", err)
  }

  // 5. Last resort: baked-in data/content.json from build
  try {
    const raw = readFileSync(CONTENT_PATH, "utf-8")
    const parsed = migrateLegacyFields(JSON.parse(raw) as SiteContent)
    globalThis._siteContentCache = parsed
    globalThis._siteContentCacheTime = now
    return parsed
  } catch (err) {
    console.error("Error reading local content file:", err)
    return {} as SiteContent
  }
}

export async function setSiteContent(data: SiteContent): Promise<void> {
  // Strip any base64 images before saving
  const cleanData = stripBase64Images(data) as SiteContent

  // ✅ Update in-memory cache with the CORRECT new data right away.
  //    We do NOT invalidate the cache after GitHub commit — doing so caused a
  //    re-fetch that returned old CDN-cached data, reverting images to stock photos.
  globalThis._siteContentCache = cleanData
  globalThis._siteContentCacheTime = Date.now()

  // Write to /tmp for this runtime instance
  try {
    writeFileSync(TMP_CONTENT_PATH, JSON.stringify(cleanData, null, 2), "utf-8")
  } catch {
    // Ignore read-only filesystem errors (Vercel/Netlify)
  }

  // Write locally if filesystem is writable (local dev)
  try {
    writeFileSync(CONTENT_PATH, JSON.stringify(cleanData, null, 2), "utf-8")
  } catch {
    // Ignore
  }

  // Persist to GitHub so other Vercel instances and future deploys see the new content
  if (GITHUB_TOKEN) {
    try {
      const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_CONTENT_FILE}`

      // Get current SHA
      const getRes = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      })

      if (!getRes.ok) {
        console.error("Failed to get content SHA from GitHub:", getRes.status)
        return
      }

      const fileMetaData = await getRes.json()
      const sha = fileMetaData.sha
      const jsonString = JSON.stringify(cleanData, null, 2)
      const base64Content = Buffer.from(jsonString).toString("base64")

      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "CMS Admin: Update website content",
          content: base64Content,
          sha,
        }),
      })

      if (!putRes.ok) {
        const errText = await putRes.text()
        console.error("GitHub commit error:", putRes.status, errText)
        // Don't throw or reset cache — in-memory still has correct data
      } else {
        console.log("Content committed to GitHub successfully.")
        // ✅ DO NOT set _siteContentCacheTime = 0 here!
        //    The cache already holds the correct data. Resetting to 0 would
        //    immediately re-fetch from GitHub which may still serve old CDN-cached
        //    content, reverting the gallery back to stock images.
      }
    } catch (err) {
      console.error("Error committing content to GitHub:", err)
      // Don't throw — user's save is preserved in memory and /tmp
    }
  }
}
