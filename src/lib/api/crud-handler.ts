import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import type { Prisma } from "@prisma/client"

// Define the allowed model names based on your schema
type CrudModel =
  | "platform"
  | "category"
  | "duration"
  | "language"
  | "editingStyle"
  | "orientation"

interface CrudHandlerContext {
  modelName: CrudModel
  model: {
    findMany: (args: {
      include: { _count: { select: { resources: boolean } } }
      orderBy: { createdAt: "desc" | "asc" }
    }) => Promise<any>
    create: (args: { data: { name: string } }) => Promise<any>
    update: (args: {
      where: { id: number }
      data: { name: string }
    }) => Promise<any>
    findUnique: (args: {
      where: { id: number }
      include: { _count: { select: { resources: boolean } } }
    }) => Promise<any>
    delete: (args: { where: { id: number } }) => Promise<any>
  }
}

export async function createCrudHandler(modelName: CrudModel) {
  const context: CrudHandlerContext = {
    modelName,
    model: prisma[modelName],
  }

  return {
    GET: async () => {
      try {
        const items = await context.model.findMany({
          include: {
            _count: {
              select: {
                resources: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        return NextResponse.json(items)
      } catch (error) {
        console.error(`Error fetching ${modelName}:`, error)
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        )
      }
    },

    POST: async (request: NextRequest) => {
      try {
        const { userId } = await auth()
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()
        const item = await context.model.create({
          data: {
            name: data.name,
          },
        })

        return NextResponse.json(item)
      } catch (error) {
        console.error(`Error creating ${modelName}:`, error)
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        )
      }
    },

    PATCH: async (
      request: NextRequest,
      { params }: { params: { id: string } }
    ) => {
      try {
        const { userId } = await auth()
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()
        const id = parseInt(params.id)

        const item = await context.model.update({
          where: { id },
          data: {
            name: data.name,
          },
        })

        return NextResponse.json(item)
      } catch (error) {
        console.error(`Error updating ${modelName}:`, error)
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        )
      }
    },

    DELETE: async (
      request: NextRequest,
      { params }: { params: { id: string } }
    ) => {
      try {
        const { userId, sessionClaims } = await auth()
        const role = sessionClaims?.role as string

        if (!userId || role !== "admin") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const id = parseInt(params.id)

        // Check if item has resources
        const item = await context.model.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                resources: true,
              },
            },
          },
        })

        if (item?._count?.resources && item._count.resources > 0) {
          return NextResponse.json(
            { error: `Cannot delete ${modelName} with existing resources` },
            { status: 400 }
          )
        }

        await context.model.delete({
          where: { id },
        })

        return NextResponse.json({ success: true })
      } catch (error) {
        console.error(`Error deleting ${modelName}:`, error)
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        )
      }
    },
  }
}
