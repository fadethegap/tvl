import { NextRequest, NextResponse } from "next/server"
import { FavoriteRepository } from "@/lib/db/repositories/favorite-repository"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const favorite = await FavoriteRepository.create(data)
    return NextResponse.json(favorite)
  } catch (error) {
    console.error("Error creating favorite:", error)
    return NextResponse.json(
      { error: "Failed to create favorite" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, resourceId } = await request.json()
    const favorite = await FavoriteRepository.delete(userId, resourceId)
    return NextResponse.json(favorite)
  } catch (error) {
    console.error("Error deleting favorite:", error)
    return NextResponse.json(
      { error: "Failed to delete favorite" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const favorites = await FavoriteRepository.getByUserId(userId)
    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    )
  }
}
