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

const seedUser = async (adminRoleId: string, userCdId: string) => {
  return prisma.users.create({
    data: {
      userId: nanoid(),
      userFullname: 'John Doe',
      userPassword: await bcrypt.hash('password', 10),
      userCdId,
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
      permFolderId: nanoid(),
      permIsActive: true,
    },
  })
}

const seedCompany = async () => {
  return prisma.companies.create({
    data: {
      compId: nanoid(),
      compName: 'Company Name',
      compIsActive: true,
    },
  })
}

const seedDepartment = async () => {
  return prisma.departments.create({
    data: {
      deptId: nanoid(),
      deptName: 'Department Name',
      deptIsActive: true,
    },
  })
}

const seedCompanyDepartment = async (cdCompId: string, cdDeptId: string) => {
  return prisma.companyDepartments.create({
    data: {
      cdId: nanoid(),
      cdCompId,
      cdDeptId,
      cdIsActive: true,
    },
  })
}

const main = async () => {
  const userRole = await seedUserRole()
  const company = await seedCompany()
  const department = await seedDepartment()
  const companyDepartment = await seedCompanyDepartment(company.compId, department.deptId)
  await seedUser(userRole.urId, companyDepartment.cdId)
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
