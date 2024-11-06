import { prisma } from "../prisma"
import { User } from "@prisma/client"

export type UserCreateInput = {
  email: string
  name?: string | null
  roleId?: number
  stripeCustomerId?: string
  purchasedProduct?: boolean
  purchasedAt?: Date | null
}

export type UserUpdateInput = Partial<UserCreateInput>

export const UserRepository = {
  create: async (data: UserCreateInput): Promise<User> => {
    return prisma.user.create({
      data: {
        ...data,
        roleId: data.roleId || 1, // Default role
      },
    })
  },

  update: async (id: string, data: UserUpdateInput): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data,
    })
  },

  delete: async (id: string): Promise<User> => {
    return prisma.user.delete({
      where: { id },
    })
  },

  getById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        favorites: true,
        submissions: true,
      },
    })
  },

  getByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  updatePurchaseStatus: async (
    id: string,
    stripeCustomerId: string
  ): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: {
        purchasedProduct: true,
        purchasedAt: new Date(),
        stripeCustomerId,
      },
    })
  },
}
