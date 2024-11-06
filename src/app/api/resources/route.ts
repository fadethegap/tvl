import { NextResponse } from "next/server"
import { ResourceRepository } from "@/lib/db/repositories/resource-repository"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const resource = await ResourceRepository.create(data)
    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const resources = await ResourceRepository.getAllWithRelations()
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}
