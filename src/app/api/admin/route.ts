import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { addDays, subDays, startOfDay } from "date-fns"

export async function GET() {
  try {
    // Get basic counts
    const [totalResources, pendingResources, totalUsers] = await Promise.all([
      prisma.resource.count({
        where: { status: "approved" },
      }),
      prisma.resource.count({
        where: { status: "pending" },
      }),
      prisma.user.count({
        where: { purchasedProduct: true },
      }),
    ])

    // Get submission trend for last 30 days
    const thirtyDaysAgo = subDays(startOfDay(new Date()), 30)
    const submissions = await prisma.resource.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    // Format submission trend data
    const submissionTrend = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i)
      const count = submissions.filter(
        (s) =>
          startOfDay(new Date(s.createdAt)).getTime() ===
          startOfDay(date).getTime()
      ).length
      return { date, count }
    }).reverse()

    // Calculate growth rate
    const prevMonthUsers = await prisma.user.count({
      where: {
        purchasedProduct: true,
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    const growthRate = prevMonthUsers
      ? ((totalUsers - prevMonthUsers) / prevMonthUsers) * 100
      : 0

    return NextResponse.json({
      totalResources,
      pendingResources,
      activeUsers: totalUsers,
      averageGrowth: Math.round(growthRate * 10) / 10,
      submissionTrend,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    )
  }
}
