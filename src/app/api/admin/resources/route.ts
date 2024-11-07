import { NextRequest, NextResponse } from "next/server"
import { ResourceRepository } from "@/lib/db/repositories/resource-repository"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth()
    const userRole = sessionClaims?.role as string

    // Check if user is admin or staff_admin
    if (!userId || !["admin", "staff_admin"].includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    let resources
    if (status === "pending") {
      resources = await ResourceRepository.getPendingApprovals()
    } else {
      resources = await ResourceRepository.getApprovedResources({
        where: { status },
      })
    }

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth()
    const userRole = sessionClaims?.role as string

    if (!userId || !["admin", "staff_admin"].includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, action } = await request.json()

    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const resource =
      action === "approve"
        ? await ResourceRepository.approve(id, userId)
        : await ResourceRepository.reject(id, userId)

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    )
  }
}
