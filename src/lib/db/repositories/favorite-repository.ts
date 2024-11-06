import { prisma } from "../prisma"
import { Favorite } from "@prisma/client"

export type FavoriteCreateInput = {
  userId: string
  resourceId: number
}

export const FavoriteRepository = {
  create: async (data: FavoriteCreateInput): Promise<Favorite> => {
    return prisma.favorite.create({
      data,
    })
  },

  delete: async (userId: string, resourceId: number): Promise<Favorite> => {
    return prisma.favorite.delete({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    })
  },

  getByUserId: async (userId: string) => {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        resource: {
          include: {
            platform: true,
            category: true,
            duration: true,
            language: true,
          },
        },
      },
    })
  },

  exists: async (userId: string, resourceId: number): Promise<boolean> => {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    })
    return !!favorite
  },
}
