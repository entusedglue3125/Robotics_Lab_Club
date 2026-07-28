import { NextRequest, NextResponse } from "next/server"
import { writeFileSync, mkdirSync } from "fs"
import { join, extname } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""
const GITHUB_OWNER = process.env.GITHUB_OWNER || "entusedglue3125"
const GITHUB_REPO = process.env.GITHUB_REPO || "Robotics_Lab_Club"

/** Upload image to GitHub repo's public/uploads folder and return a raw URL */
async function uploadToGitHub(
  filename: string,
  arrayBuffer: ArrayBuffer,
  contentType: string
): Promise<string | null> {
  if (!GITHUB_TOKEN) return null

  const base64Content = Buffer.from(arrayBuffer).toString("base64")
  const path = `public/uploads/${filename}`
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

  // Check if file already exists (get SHA)
  let sha: string | undefined
  try {
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    if (getRes.ok) {
      const meta = await getRes.json()
      sha = meta.sha
    }
  } catch {
    // File doesn't exist, that's fine
  }

  const body: Record<string, string> = {
    message: `Upload image: ${filename}`,
    content: base64Content,
  }
  if (sha) body.sha = sha

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!putRes.ok) {
    const err = await putRes.text()
    console.error("GitHub upload error:", putRes.status, err)
    return null
  }

  // Return raw.githubusercontent.com URL so it works on any host
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${path}`
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    const ext = extname(file.name) || ".jpg"
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\s+/g, "_")
    const timestamp = Date.now()
    const filename = `${timestamp}_${safeName}`
    const arrayBuffer = await file.arrayBuffer()

    // 1. Try GitHub upload (works on Netlify, Vercel, anywhere)
    if (GITHUB_TOKEN) {
      const githubUrl = await uploadToGitHub(filename, arrayBuffer, file.type)
      if (githubUrl) {
        return NextResponse.json({ url: githubUrl, filename })
      }
    }

    // 2. On Netlify runtime, try Netlify Blobs
    if (process.env.NETLIFY === "true") {
      try {
        const { getStore } = await import("@netlify/blobs")
        const store = getStore("site-uploads")
        await store.set(filename, arrayBuffer, {
          metadata: { contentType: file.type },
        })
        const url = `/api/uploads/${filename}`
        return NextResponse.json({ url, filename })
      } catch (blobErr) {
        console.error("Netlify Blobs error:", blobErr)
      }
    }

    // 3. Local development: save to public/uploads
    try {
      mkdirSync(UPLOAD_DIR, { recursive: true })
      const filepath = join(UPLOAD_DIR, filename)
      const buffer = Buffer.from(arrayBuffer)
      writeFileSync(filepath, buffer)
      const url = `/api/uploads/${filename}`
      return NextResponse.json({ url, filename })
    } catch (fsErr) {
      console.error("Filesystem write error:", fsErr)
    }

    // 4. Last resort: return base64 Data URL (not ideal but functional)
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const url = `data:${file.type || "image/jpeg"};base64,${base64}`
    return NextResponse.json({ url, filename })
  } catch (err: unknown) {
    console.error("Upload error:", err)
    const msg = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
