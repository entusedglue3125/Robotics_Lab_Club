import { NextRequest, NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  // 1. Try Netlify Blobs if in Netlify environment
  if (process.env.NETLIFY === "true") {
    try {
      const { getStore } = await import("@netlify/blobs")
      const store = getStore("site-uploads")
      const res = await store.getWithMetadata(filename, { type: "arrayBuffer" })
      if (res && res.data) {
        const contentType = (res.metadata?.contentType as string) || getContentType(filename)
        return new NextResponse(res.data, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        })
      }
    } catch (err) {
      console.error("Netlify Blobs read error:", err)
    }
  }

  // 2. Fallback to local filesystem public/uploads directory
  const filepath = join(process.cwd(), "public", "uploads", filename)
  if (existsSync(filepath)) {
    try {
      const fileBuffer = readFileSync(filepath)
      const contentType = getContentType(filename)
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      })
    } catch (err) {
      console.error("Local file read error:", err)
    }
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 })
}

function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "png":
      return "image/png"
    case "gif":
      return "image/gif"
    case "webp":
      return "image/webp"
    case "svg":
      return "image/svg+xml"
    case "jpeg":
    case "jpg":
      return "image/jpeg"
    default:
      return "application/octet-stream"
  }
}
