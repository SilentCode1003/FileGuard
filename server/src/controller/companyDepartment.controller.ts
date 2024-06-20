import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { companyDepartmentIdSchema, createCompanyDepartmentSchema } from '../schema/companyDepartment.schema'
import { nanoid } from '../util/nano.util'


export const getAllCompanyDepartment: RequestHandler = async (req, res, next) => {
  try {
    const companyDepartment = await prisma.companyDepartments.findMany()

    res.status(200).json({ data: companyDepartment })
    
  } catch (err) {
    // TODO: Handle errors
  }
}

export const createCompanyDepartment: RequestHandler = async (req, res, next) => {
    const validatedBody = createCompanyDepartmentSchema.safeParse(req.body)

    if (!validatedBody.success) {
      return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
    }

    try {
      const companyDepartment = await prisma.companyDepartments.create({
        data: {
          ...validatedBody.data,
          cdId: nanoid(),
        },
      })
      console.log('data', companyDepartment);

      res.status(200).json({ data: companyDepartment })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            return res.status(400).json({ message: 'Company Department already exists' })
          case 'P2003':
            return res.status(400).json({ message: 'Foreign key does not exist' })
          default:
            return res.status(400).json({ message: 'Prisma client error' })
        }
      }
    }
  }


  export const getCompanyDepartmentById: RequestHandler = async (req, res, next) => {
    const validatedId = companyDepartmentIdSchema.safeParse(req.params)
  
    if (!validatedId.success) {
      return res.status(400).json({ message: validatedId.error.errors[0]?.message })
    }
  
    try {
      const companyDepartment = await prisma.companyDepartments.findUnique({
        where: {
          cdId: validatedId.data.id,
        },
      })
  
      if (!companyDepartment) {
        return res.status(404).json({ message: 'companyDepartment not found' })
      }
  
      res.status(200).json({ data: companyDepartment })
    } catch (err) {
      // TODO: Handle errors
    }
  }


  export const updateCompanyDepartmentById: RequestHandler = async (req, res, next) => {
    const validatedId = companyDepartmentIdSchema.safeParse(req.params)
  
    if (!validatedId.success) {
      return res.status(400).json({ message: validatedId.error.errors[0]?.message })
    }
  
    const validatedBody = createCompanyDepartmentSchema.safeParse(req.body)
  
    if (!validatedBody.success) {
      return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
    }
  
    try {
      const companyDepartment = await prisma.companyDepartments.update({
        where: {
          cdId: validatedId.data.id,
        },
        data: {
          ...validatedBody.data,
        },
      })
  
      res.status(200).json({ data: companyDepartment })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            return res.status(400).json({ message: 'companyDepartment already exists' })
          case 'P2003':
            return res.status(400).json({ message: 'Foreign key does not exist' })
          case 'P2025':
            return res.status(400).json({ message: 'companyDepartment to update not found' })
          default:
            return res.status(400).json({ message: 'Prisma client error' })
        }
      }
    }
  }


  export const toggleCompanyDepartmentById: RequestHandler = async (req, res, next) => {
    const validatedId = companyDepartmentIdSchema.safeParse(req.params)
  
    if (!validatedId.success) {
      return res.status(400).json({ message: validatedId.error.errors[0]?.message })
    }
  
    try {
      const currentCompanyDepartment = await prisma.companyDepartments.findUnique({
        where: {
          cdId: validatedId.data.id,
        },
      })
  
      if (!currentCompanyDepartment) {
        return res.status(404).json({ message: 'currentCompanyDepartment not found' })
      }
  
      const CompanyDepartment = await prisma.companyDepartments.update({
        where: {
          cdId: validatedId.data.id,
        },
        data: {
          cdIsActive: !currentCompanyDepartment.cdIsActive,
        },
      })
  
      res.status(200).json({ data: CompanyDepartment })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            return res.status(400).json({ message: 'Permission already exists' })
          case 'P2025':
            return res.status(400).json({ message: 'Permission to toggle not found' })
          default:
            return res.status(400).json({ message: 'Prisma client error' })
        }
      }
    }
  }



  // export const createCompanyDepartment: RequestHandler = async (req, res, next) => {
//   const validatedBody = createCompanyDepartmentSchema.safeParse(req.body)

//   if (!validatedBody.success) {
//     return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
//   }

//   const { companyName, departmentName, ...rest } = validatedBody.data

//   try {
//     const company = await prisma.companies.create({
//       data: {
//         compId: nanoid(),
//         compName: companyName,
//         compIsActive: true,
//       },
//     })

//     const department = await prisma.departments.create({
//       data: {
//         deptId: nanoid(),
//         deptName: departmentName,
//         deptIsActive: true,
//       },
//     })

//     const companyDepartment = await prisma.companyDepartments.create({
//         data: {
//           cdId: nanoid(),
//           cdCompId: company.compId,
//           cdDeptId: department.deptId,
//           cdIsActive: true,
//           ...rest,
//         },
//       });

//     res.status(200).json({ data: companyDepartment })
//   } catch (err) {
//     if (err instanceof PrismaClientKnownRequestError) {
//       switch (err.code) {
//         case 'P2002':
//           return res.status(400).json({ message: 'Permission already exists' })
//         case 'P2003':
//           return res.status(400).json({ message: 'Foreign key does not exist' })
//         default:
//           return res.status(400).json({ message: 'Prisma client error' })
//       }
//     }
//     next(err)
//   }
// }