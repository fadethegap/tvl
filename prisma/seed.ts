const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  try {
    // Create default roles
    const roles = [
      { id: 1, name: "User" },
      { id: 2, name: "Admin" },
    ]

    console.log(`Start seeding roles...`)

    for (const role of roles) {
      const createdRole = await prisma.role.upsert({
        where: { id: role.id },
        update: {},
        create: {
          id: role.id,
          name: role.name,
        },
      })
      console.log(`Created role ${createdRole.name} with id: ${createdRole.id}`)
    }

    console.log(`Seeding finished.`)
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
