// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clerkClient } from "@clerk/nextjs/server"

async function getClerkClient() {
  return await clerkClient()
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, stripeCustomerId } = await request.json()

    const clerk = await getClerkClient()

    // 1. Create user with Clerk
    const newUser = await clerk.users.createUser({
      emailAddress: [email],
      password,
      firstName: name || undefined,
    })

    // 2. Create user in our database
    await prisma.user.create({
      data: {
        id: newUser.id,
        email,
        name: name || null,
        purchasedProduct: true,
        purchasedAt: new Date(),
        stripeCustomerId,
      },
    })

    // Instead of creating a session token, return data for client-side sign-in
    return NextResponse.json({
      success: true,
      userId: newUser.id,
      email,
      password, // We'll use this for immediate sign-in
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
