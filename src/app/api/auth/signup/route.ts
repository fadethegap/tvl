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

    // 2. Create session token for automatic sign-in
    const sessionToken = await clerk.signInTokens.createSignInToken({
      userId: newUser.id,
      expiresInSeconds: 3600, // 1 hour
    })

    // 3. Create user in our database
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

    // 4. Create login URL for automatic sign-in
    const loginUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/session/new?session_token=${sessionToken.token}`

    return NextResponse.json({
      success: true,
      userId: newUser.id,
      loginUrl,
      sessionToken: sessionToken.token,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
