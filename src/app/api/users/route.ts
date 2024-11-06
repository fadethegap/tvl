import { NextRequest, NextResponse } from "next/server"
import { UserRepository } from "@/lib/db/repositories/user-repository"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const user = await UserRepository.create(data)
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    const user = await UserRepository.update(id, data)
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    if (id) {
      const user = await UserRepository.getById(id)
      return NextResponse.json(user)
    }

    if (email) {
      const user = await UserRepository.getByEmail(email)
      return NextResponse.json(user)
    }

    return NextResponse.json(
      { error: "ID or email is required" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
