// lib/prisma.ts

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// import { PrismaClient } from "@prisma/client"

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["query"], // Optional: logs queries for debugging
//   })

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// export default prisma

// import { PrismaClient } from "@prisma/client"

// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// export default prisma
