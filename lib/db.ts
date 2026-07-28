import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import type { SiteContent } from "./content-types"

const CONTENT_PATH = join(process.cwd(), "data", "content.json")
const TMP_CONTENT_PATH = "/tmp/content.json"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = process.env.GITHUB_OWNER || "entusedglue3125"
const GITHUB_REPO = process.env.GITHUB_REPO || "Robotics_Lab_Club"
const GITHUB_CONTENT_FILE = process.env.GITHUB_CONTENT_FILE || "data/content.json"

// GitHub raw URL for always-fresh reads (no auth needed for public repos)
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_CONTENT_FILE}`

declare global {
  // eslint-disable-next-line no-var
  var _siteContentCache: SiteContent | undefined
  // eslint-disable-next-line no-var
  var _siteContentCacheTime: number | undefined
}

// Cache TTL: 15 seconds — content appears updated within 15s of saving
const CACHE_TTL_MS = 15000

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
    data.gallery.images = (data.gallery.images as any[]).map((img: Record<string, unknown>) => {
      const legacyUrl = img.url as string | undefined
      const currentSrc = img.src as string | undefined
      if (legacyUrl && !currentSrc) {
        return { ...img, src: legacyUrl, url: undefined }
      }
      return img
    })
  }
  return data
}

/** Fetch fresh content.json directly from GitHub (always latest, bypasses build cache) */
async function fetchFromGitHub(): Promise<SiteContent | null> {
  try {
    // Use GitHub API with auth for private repos, or raw URL for public
    const url = GITHUB_TOKEN
      ? `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_CONTENT_FILE}`
      : GITHUB_RAW_URL

    const headers: Record<string, string> = { "Cache-Control": "no-cache" }
    if (GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`
      headers["Accept"] = "application/vnd.github.v3.raw"
    }

    const res = await fetch(url, { headers, cache: "no-store" })
    if (!res.ok) return null

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

  // 1. Return cached content if it's fresh (within TTL)
  if (globalThis._siteContentCache && cacheAge < CACHE_TTL_MS) {
    return globalThis._siteContentCache
  }

  // 2. Fetch fresh content from GitHub (works on Vercel, Netlify, anywhere)
  //    This ensures admin saves appear on the site within 15 seconds — no redeploy needed!
  const githubContent = await fetchFromGitHub()
  if (githubContent) {
    globalThis._siteContentCache = githubContent
    globalThis._siteContentCacheTime = now
    return githubContent
  }

  // 3. Fallback: use stale cache if GitHub fetch failed
  if (globalThis._siteContentCache) {
    return globalThis._siteContentCache
  }

  // 4. Check /tmp/content.json (written during this runtime session)
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

  // 5. Last resort: read baked-in data/content.json from build
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

  // Update in-memory cache immediately so the admin sees changes right away
  globalThis._siteContentCache = cleanData
  globalThis._siteContentCacheTime = Date.now()

  // 1. Write to /tmp/content.json (fast local fallback for this runtime instance)
  try {
    writeFileSync(TMP_CONTENT_PATH, JSON.stringify(cleanData, null, 2), "utf-8")
  } catch {
    // Ignore read-only filesystem errors
  }

  // 2. Write to local data/content.json if filesystem is writable (local dev)
  try {
    writeFileSync(CONTENT_PATH, JSON.stringify(cleanData, null, 2), "utf-8")
  } catch {
    // Ignore read-only filesystem errors
  }

  // 3. Commit updated content to GitHub so it persists and is fetched on next getSiteContent()
  if (GITHUB_TOKEN) {
    try {
      const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_CONTENT_FILE}`
      const getRes = await fetch(getUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      })

      if (getRes.ok) {
        const fileMetaData = await getRes.json()
        const sha = fileMetaData.sha
        const jsonString = JSON.stringify(cleanData, null, 2)
        const base64Content = Buffer.from(jsonString).toString("base64")

        const putRes = await fetch(getUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "CMS Admin: Update website content",
            content: base64Content,
            sha: sha,
          }),
        })

        if (!putRes.ok) {
          const errText = await putRes.text()
          console.error("GitHub API commit error:", putRes.status, errText)
          // Don't throw — content is saved in cache and /tmp, just not persisted to GitHub
        } else {
          console.log("Successfully committed content update to GitHub!")
          // Invalidate cache so next read fetches fresh from GitHub
          globalThis._siteContentCacheTime = 0
        }
      } else {
        console.error("Failed to fetch content.json SHA from GitHub:", getRes.status)
      }
    } catch (err) {
      console.error("Error committing content to GitHub:", err)
      // Don't throw — partial save is better than showing an error to the user
    }
  }
}
