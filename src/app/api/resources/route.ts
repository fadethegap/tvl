import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { platformRegistry } from "@/lib/platforms/registry"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate the URL with the appropriate platform handler
    const platform = await prisma.platform.findUnique({
      where: { id: data.platformId },
    })

    if (!platform) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
    }

    // Validate URL format
    const isValid = platformRegistry.validateUrl(
      platform.name,
      data.contentLink
    )
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid content URL for the selected platform" },
        { status: 400 }
      )
    }

    // Create the resource
    const resource = await prisma.resource.create({
      data: {
        ...data,
        userId,
        submittedById: userId,
        status: "pending",
      },
      include: {
        platform: true,
        category: true,
        duration: true,
        language: true,
        editingStyle: true,
        orientation: true,
      },
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error submitting resource:", error)
    return NextResponse.json(
      { error: "Failed to submit resource" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = sessionClaims?.role as string
    const isAdmin = ["admin", "staff_admin"].includes(role)

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const platform = searchParams.get("platform")
    const category = searchParams.get("category")

    // Build where clause
    const where = {
      ...(status && { status }),
      ...(platform && { platformId: parseInt(platform) }),
      ...(category && { categoryId: parseInt(category) }),
      // If not admin, only show approved resources or own submissions
      ...(!isAdmin && {
        OR: [{ status: "approved" }, { submittedById: userId }],
      }),
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        platform: true,
        category: true,
        duration: true,
        language: true,
        editingStyle: true,
        orientation: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}
