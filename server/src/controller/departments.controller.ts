import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createDepartmentSchema, departmentIdSchema } from '../schema/departments.schema'
import { nanoid } from '../util/nano.util'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const getAllDeparments: RequestHandler = async (req, res, next) => {
  try {
    const departments = await prisma.departments.findMany()

    res.status(200).json({ data: departments })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const createDepartment: RequestHandler = async (req, res, next) => {
  const validatedBody = createDepartmentSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const department = await prisma.departments.create({
      data: {
        ...validatedBody.data,
        deptId: nanoid(),
      },
    })

    res.status(200).json({ data: department })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'Department already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const getDepartmentById: RequestHandler = async (req, res, next) => {
  const validatedId = departmentIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const department = await prisma.departments.findUnique({
      where: {
        deptId: validatedId.data.id,
      },
    })

    if (!department) {
      return res.status(404).json({ message: 'Department not found' })
    }

    res.status(200).json({ data: department })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const updateDepartmentById: RequestHandler = async (req, res, next) => {
  const validatedId = departmentIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  const validatedBody = createDepartmentSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const department = await prisma.departments.update({
      where: {
        deptId: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: department })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'Department already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        case 'P2025':
          return res.status(400).json({ message: 'Department to update not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const toggleDepartmentById: RequestHandler = async (req, res, next) => {
  const validatedId = departmentIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const currentDepartment = await prisma.departments.findUnique({
      where: {
        deptId: validatedId.data.id,
      },
    })

    if (!currentDepartment) {
      return res.status(404).json({ message: 'Department not found' })
    }

    const department = await prisma.departments.update({
      where: {
        deptId: validatedId.data.id,
      },
      data: {
        deptIsActive: !currentDepartment.deptIsActive,
      },
    })

    res.status(200).json({ data: department })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'Department already exists' })
        case 'P2025':
          return res.status(400).json({ message: 'Department to toggle not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}
