import { NextRequest, NextResponse } from "next/server"
import { getSiteContent, setSiteContent } from "@/lib/db"

function isAuthorized(req: NextRequest): boolean {
  const password = req.headers.get("x-admin-password")
  const expectedPassword = process.env.ADMIN_PASSWORD || "12345678"
  return password === expectedPassword
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await getSiteContent()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Failed to read content in API GET:", err)
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    await setSiteContent(body)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to write content in API POST:", err)
    return NextResponse.json({ error: "Failed to write content" }, { status: 500 })
  }
}

