import { createCrudHandler } from "@/lib/api/crud-handler"
import { NextRequest } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const handler = await createCrudHandler("orientation")
  return handler.PATCH(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const handler = await createCrudHandler("orientation")
  return handler.DELETE(request, { params })
}
