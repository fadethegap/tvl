import { PrismaClient } from "@prisma/client"

const TestPrismaPage = () => {
  const prisma = new PrismaClient()

  async function main() {
    try {
      const users = await prisma.user.findMany() // Adjust based on your schema
      console.log(users)
    } catch (error) {
      console.error("Error connecting to Prisma:", error)
    } finally {
      await prisma.$disconnect()
    }
  }

  main()
  return <div>Test Prisma Page</div>
}

export default TestPrismaPage
