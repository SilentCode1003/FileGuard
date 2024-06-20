import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { nanoid } from '../src/util/nano.util'

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

const main = async () => {
  const userRole = await seedUserRole()
  await seedUser(userRole.urId)
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
