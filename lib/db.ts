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
}

export async function getSiteContent(): Promise<SiteContent> {
  // 1. Check in-memory cache
  if (globalThis._siteContentCache) {
    return globalThis._siteContentCache
  }

  // 2. Check /tmp/content.json if written previously during runtime
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

  // 3. Read local data/content.json
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

  // 1. Write to /tmp/content.json (fast local fallback)
  try {
    writeFileSync(TMP_CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Ignore read-only filesystem errors
  }

  // 2. Write to local data/content.json if filesystem is writable
  try {
    writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Ignore read-only filesystem errors
  }

  // 3. Commit updated content directly to GitHub Repository
  // This triggers Netlify auto-rebuild and permanently bakes the changes into git!
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
        const jsonString = JSON.stringify(data, null, 2)
        const base64Content = Buffer.from(jsonString).toString("base64")

        const putRes = await fetch(getUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "CMS Admin: Update website content & images",
            content: base64Content,
            sha: sha,
          }),
        })

        if (!putRes.ok) {
          const errText = await putRes.text()
          console.error("GitHub API commit error:", putRes.status, errText)
        } else {
          console.log("Successfully committed content update to GitHub repository!")
        }
      } else {
        console.error("Failed to fetch content.json SHA from GitHub:", getRes.status)
      }
    } catch (err) {
      console.error("Error committing content to GitHub:", err)
    }
  }
}
