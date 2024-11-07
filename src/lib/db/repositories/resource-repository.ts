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
  submittedById: string // Added for new schema
  status?: string // Optional since it has a default
}

// Define update input type
export type ResourceUpdateInput = Partial<ResourceCreateInput> & {
  approvedById?: string
  approvedAt?: Date
}

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
      submittedById,
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
        submittedBy: { connect: { id: submittedById } }, // Added for new schema
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
      submittedById,
      approvedById,
      approvedAt,
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
      ...(submittedById && { submittedBy: { connect: { id: submittedById } } }),
      ...(approvedById && {
        approvedBy: { connect: { id: approvedById } },
        approvedAt: approvedAt || new Date(),
      }),
    }

    return prisma.resource.update({
      where: { id },
      data: updateData,
    })
  },

  approve: async (id: number, approvedById: string): Promise<Resource> => {
    return prisma.resource.update({
      where: { id },
      data: {
        status: "approved",
        approvedAt: new Date(),
        approvedBy: { connect: { id: approvedById } },
      },
    })
  },

  reject: async (id: number, approvedById: string): Promise<Resource> => {
    return prisma.resource.update({
      where: { id },
      data: {
        status: "rejected",
        approvedAt: new Date(),
        approvedBy: { connect: { id: approvedById } },
      },
    })
  },

  getPendingApprovals: async () => {
    return prisma.resource.findMany({
      where: { status: "pending" },
      include: {
        platform: true,
        orientation: true,
        editingStyle: true,
        category: true,
        duration: true,
        language: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })
  },

  getApprovedResources: async (params?: {
    skip?: number
    take?: number
    where?: Prisma.ResourceWhereInput
    orderBy?: Prisma.ResourceOrderByWithRelationInput
  }) => {
    return prisma.resource.findMany({
      ...params,
      where: {
        status: "approved",
        ...params?.where,
      },
      include: {
        platform: true,
        orientation: true,
        editingStyle: true,
        category: true,
        duration: true,
        language: true,
        submittedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  countApprovedResources: async (where?: Prisma.ResourceWhereInput) => {
    return prisma.resource.count({
      where: {
        status: "approved",
        ...where,
      },
    })
  },
}

// import { prisma } from "../prisma"
// import { Prisma, Resource } from "@prisma/client"

// // Define base input type without relations
// type ResourceBaseInput = {
//   totalViews: number
//   totalFollowers: number
//   initialSubscriberCount: number
//   creatorName: string
//   postingDate: Date
//   tags?: string | null
//   contentLink: string
//   contentDescription?: string | null
// }

// // Define create input type
// export type ResourceCreateInput = ResourceBaseInput & {
//   platformId: number
//   orientationId: number
//   editingStyleId: number
//   categoryId: number
//   durationId: number
//   languageId: number
//   userId: string
// }

// // Define update input type
// export type ResourceUpdateInput = Partial<ResourceCreateInput>

// export const ResourceRepository = {
//   create: async (data: ResourceCreateInput): Promise<Resource> => {
//     const {
//       platformId,
//       orientationId,
//       editingStyleId,
//       categoryId,
//       durationId,
//       languageId,
//       userId,
//       ...resourceData
//     } = data

//     return prisma.resource.create({
//       data: {
//         ...resourceData,
//         platform: { connect: { id: platformId } },
//         orientation: { connect: { id: orientationId } },
//         editingStyle: { connect: { id: editingStyleId } },
//         category: { connect: { id: categoryId } },
//         duration: { connect: { id: durationId } },
//         language: { connect: { id: languageId } },
//         user: { connect: { id: userId } },
//       },
//     })
//   },

//   update: async (id: number, data: ResourceUpdateInput): Promise<Resource> => {
//     const {
//       platformId,
//       orientationId,
//       editingStyleId,
//       categoryId,
//       durationId,
//       languageId,
//       userId,
//       ...resourceData
//     } = data

//     const updateData: Prisma.ResourceUpdateInput = {
//       ...resourceData,
//       ...(platformId && { platform: { connect: { id: platformId } } }),
//       ...(orientationId && { orientation: { connect: { id: orientationId } } }),
//       ...(editingStyleId && {
//         editingStyle: { connect: { id: editingStyleId } },
//       }),
//       ...(categoryId && { category: { connect: { id: categoryId } } }),
//       ...(durationId && { duration: { connect: { id: durationId } } }),
//       ...(languageId && { language: { connect: { id: languageId } } }),
//       ...(userId && { user: { connect: { id: userId } } }),
//     }

//     return prisma.resource.update({
//       where: { id },
//       data: updateData,
//     })
//   },

//   delete: async (id: number): Promise<Resource> => {
//     return prisma.resource.delete({
//       where: { id },
//     })
//   },

//   getById: async (id: number) => {
//     return prisma.resource.findUnique({
//       where: { id },
//       include: {
//         platform: true,
//         orientation: true,
//         editingStyle: true,
//         category: true,
//         duration: true,
//         language: true,
//       },
//     })
//   },

//   getByUserId: async (userId: string) => {
//     return prisma.resource.findMany({
//       where: { userId },
//       include: {
//         platform: true,
//         orientation: true,
//         editingStyle: true,
//         category: true,
//         duration: true,
//         language: true,
//       },
//     })
//   },

//   getAllWithRelations: async () => {
//     return prisma.resource.findMany({
//       include: {
//         platform: true,
//         orientation: true,
//         editingStyle: true,
//         category: true,
//         duration: true,
//         language: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     })
//   },
// }
