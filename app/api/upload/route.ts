import { NextRequest, NextResponse } from "next/server"
import { writeFileSync, mkdirSync } from "fs"
import { join, extname } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate it's an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    // Generate unique filename preserving extension
    const ext = extname(file.name) || ".jpg"
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\s+/g, "_")
    const timestamp = Date.now()
    const filename = `${timestamp}_${safeName}`
    const arrayBuffer = await file.arrayBuffer()

    // 1. If running on Netlify runtime, store in Netlify Blobs
    if (process.env.NETLIFY === "true") {
      try {
        const { getStore } = await import("@netlify/blobs")
        const store = getStore("site-uploads")
        await store.set(filename, arrayBuffer, {
          metadata: { contentType: file.type }
        })
        const url = `/api/uploads/${filename}`
        return NextResponse.json({ url, filename })
      } catch (blobErr: unknown) {
        console.error("Netlify Blobs upload error, falling back to base64 Data URL:", blobErr)
        const base64 = Buffer.from(arrayBuffer).toString("base64")
        const url = `data:${file.type || "image/jpeg"};base64,${base64}`
        return NextResponse.json({ url, filename })
      }
    }

    // 2. Local development: save to public/uploads directory
    try {
      mkdirSync(UPLOAD_DIR, { recursive: true })
      const filepath = join(UPLOAD_DIR, filename)
      const buffer = Buffer.from(arrayBuffer)
      writeFileSync(filepath, buffer)

      const url = `/api/uploads/${filename}`
      return NextResponse.json({ url, filename })
    } catch (fsErr) {
      console.error("Filesystem write error, falling back to base64 Data URL:", fsErr)
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      const url = `data:${file.type || "image/jpeg"};base64,${base64}`
      return NextResponse.json({ url, filename })
    }
  } catch (err: unknown) {
    console.error("Upload error:", err)
    const msg = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}


