import { NextRequest, NextResponse } from "next/server"
import { writeFileSync, mkdirSync } from "fs"
import { join, extname } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function POST(req: NextRequest) {
  try {
    // Ensure uploads directory exists
    mkdirSync(UPLOAD_DIR, { recursive: true })

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate it's an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    // Generate unique filename preserving extension
    const ext = extname(file.name) || ".jpg"
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\s+/g, "_")
    const timestamp = Date.now()
    const filename = `${timestamp}_${safeName}`
    const filepath = join(UPLOAD_DIR, filename)

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer())
    writeFileSync(filepath, buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ url, filename })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
