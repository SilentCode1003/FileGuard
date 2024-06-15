import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 10)

const prisma = new PrismaClient()

const seedUserRole = () => {
  return prisma.userRoles.create({
    data: {
      urId: nanoid(),
      urName: 'admin',
    },
  })
}

const seedUser = async (adminRoleId: string) => {
  return prisma.users.create({
    data: {
      userId: nanoid(),
      userFullname: 'John Doe',
      userPassword: await bcrypt.hash('password', 10),
      userUsername: 'admin',
      userIsActive: true,
      userRoleId: adminRoleId,
    },
  })
}

const seedPermissions = (adminRoleId: string) => {
  return prisma.permissions.create({
    data: {
      permId: nanoid(),
      permUrId: adminRoleId,
      permFolderId: nanoid(), // Dummy folder id
      permIsActive: true,
    },
  })
}

const main = async () => {
  const userRole = await seedUserRole()
  await seedUser(userRole.urId)
  await seedPermissions(userRole.urId)
}

main()
  .then(async () => {
    console.log('Finished seeding')
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
  })
