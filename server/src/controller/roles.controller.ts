import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createUserRoleSchema, userRoleIdSchema } from '../schema/roles.schema'
import { nanoid } from '../util/nano.util'

export const getUserRoles: RequestHandler = async (req, res, next) => {
  try {
    const userRoles = await prisma.userRoles.findMany()

    res.status(200).json({ data: userRoles })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const createUserRole: RequestHandler = async (req, res, next) => {
  const validatedBody = createUserRoleSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const userRole = await prisma.userRoles.create({
      data: {
        urId: nanoid(),
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: userRole })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'User role already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const getUserRoleById: RequestHandler = async (req, res, next) => {
  const validatedId = userRoleIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const userRole = await prisma.userRoles.findUnique({
      where: {
        urId: validatedId.data.id,
      },
    })

    if (!userRole) {
      return res.status(404).json({ message: 'User role not found' })
    }

    res.status(200).json({ data: userRole })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const updateUserRoleById: RequestHandler = async (req, res, next) => {
  const validatedId = userRoleIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  const validatedBody = createUserRoleSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const userRole = await prisma.userRoles.update({
      where: {
        urId: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: userRole })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'User role already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        case 'P2025':
          return res.status(400).json({ message: 'User role to update not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const toggleUserRoleById: RequestHandler = async (req, res, next) => {
  const validatedId = userRoleIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const currentUserRole = await prisma.userRoles.findUnique({
      where: {
        urId: validatedId.data.id,
      },
    })

    if (!currentUserRole) {
      return res.status(404).json({ message: 'User role not found' })
    }

    const userRole = await prisma.userRoles.update({
      where: {
        urId: validatedId.data.id,
      },
      data: {
        urIsActive: !currentUserRole.urIsActive,
      },
    })

    res.status(200).json({ data: userRole })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'User role already exists' })
        case 'P2025':
          return res.status(400).json({ message: 'User role to toggle not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}
