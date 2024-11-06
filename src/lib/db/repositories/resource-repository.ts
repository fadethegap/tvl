import { prisma } from "../prisma"
import { Prisma, Resource } from "@prisma/client"

// Define base input type without relations
type ResourceBaseInput = {
  totalViews: number
  totalFollowers: number
  initialSubscriberCount: number
  creatorName: string
  postingDate: Date
  tags?: string | null
  contentLink: string
  contentDescription?: string | null
}

// Define create input type
export type ResourceCreateInput = ResourceBaseInput & {
  platformId: number
  orientationId: number
  editingStyleId: number
  categoryId: number
  durationId: number
  languageId: number
  userId: string
}

// Define update input type
export type ResourceUpdateInput = Partial<ResourceCreateInput>

export const ResourceRepository = {
  create: async (data: ResourceCreateInput): Promise<Resource> => {
    const {
      platformId,
      orientationId,
      editingStyleId,
      categoryId,
      durationId,
      languageId,
      userId,
      ...resourceData
    } = data

    return prisma.resource.create({
      data: {
        ...resourceData,
        platform: { connect: { id: platformId } },
        orientation: { connect: { id: orientationId } },
        editingStyle: { connect: { id: editingStyleId } },
        category: { connect: { id: categoryId } },
        duration: { connect: { id: durationId } },
        language: { connect: { id: languageId } },
        user: { connect: { id: userId } },
      },
    })
  },

  update: async (id: number, data: ResourceUpdateInput): Promise<Resource> => {
    const {
      platformId,
      orientationId,
      editingStyleId,
      categoryId,
      durationId,
      languageId,
      userId,
      ...resourceData
    } = data

    const updateData: Prisma.ResourceUpdateInput = {
      ...resourceData,
      ...(platformId && { platform: { connect: { id: platformId } } }),
      ...(orientationId && { orientation: { connect: { id: orientationId } } }),
      ...(editingStyleId && {
        editingStyle: { connect: { id: editingStyleId } },
      }),
      ...(categoryId && { category: { connect: { id: categoryId } } }),
      ...(durationId && { duration: { connect: { id: durationId } } }),
      ...(languageId && { language: { connect: { id: languageId } } }),
      ...(userId && { user: { connect: { id: userId } } }),
    }

    return prisma.resource.update({
      where: { id },
      data: updateData,
    })
  },

  delete: async (id: number): Promise<Resource> => {
    return prisma.resource.delete({
      where: { id },
    })
  },

  getById: async (id: number) => {
    return prisma.resource.findUnique({
      where: { id },
      include: {
        platform: true,
        orientation: true,
        editingStyle: true,
        category: true,
        duration: true,
        language: true,
      },
    })
  },

  getByUserId: async (userId: string) => {
    return prisma.resource.findMany({
      where: { userId },
      include: {
        platform: true,
        orientation: true,
        editingStyle: true,
        category: true,
        duration: true,
        language: true,
      },
    })
  },

  getAllWithRelations: async () => {
    return prisma.resource.findMany({
      include: {
        platform: true,
        orientation: true,
        editingStyle: true,
        category: true,
        duration: true,
        language: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },
}
