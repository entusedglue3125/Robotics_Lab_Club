import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const CONTENT_PATH = join(process.cwd(), "data", "content.json")

export async function GET() {
  try {
    const raw = readFileSync(CONTENT_PATH, "utf-8")
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    writeFileSync(CONTENT_PATH, JSON.stringify(body, null, 2), "utf-8")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to write content" }, { status: 500 })
  }
}
