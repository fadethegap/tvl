import { createCrudHandler } from "@/lib/api/crud-handler"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const handler = await createCrudHandler("category")
  return handler.GET()
}

export async function POST(request: NextRequest) {
  const handler = await createCrudHandler("category")
  return handler.POST(request)
}
