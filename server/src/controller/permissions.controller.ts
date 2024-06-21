import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createPermissionSchema, permissionIdSchema } from '../schema/permissions.schema'
import { nanoid } from '../util/nano.util'

export const getAllPermissions: RequestHandler = async (req, res, next) => {
  try {
    const permissions = await prisma.permissions.findMany()

    res.status(200).json({ data: permissions })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const createPermission: RequestHandler = async (req, res, next) => {
  const validatedBody = createPermissionSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const permission = await prisma.permissions.create({
      data: {
        ...validatedBody.data,
        permId: nanoid(),
      },
    })

    res.status(200).json({ data: permission })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'Permission already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const getPermissionById: RequestHandler = async (req, res, next) => {
  const validatedId = permissionIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const permission = await prisma.permissions.findUnique({
      where: {
        permId: validatedId.data.id,
      },
    })

    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' })
    }

    res.status(200).json({ data: permission })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const updatePermissionById: RequestHandler = async (req, res, next) => {
  const validatedId = permissionIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  const validatedBody = createPermissionSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const permission = await prisma.permissions.update({
      where: {
        permId: validatedId.data.id,
      },
      data: {
        ...validatedBody.data,
      },
    })

    res.status(200).json({ data: permission })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'Permission already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        case 'P2025':
          return res.status(400).json({ message: 'Permission to update not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const togglePermissionById: RequestHandler = async (req, res, next) => {
  const validatedId = permissionIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const currentPermission = await prisma.permissions.findUnique({
      where: {
        permId: validatedId.data.id,
      },
    })

    if (!currentPermission) {
      return res.status(404).json({ message: 'Permission not found' })
    }

    const permission = await prisma.permissions.update({
      where: {
        permId: validatedId.data.id,
      },
      data: {
        permIsActive: !currentPermission.permIsActive,
      },
    })

    res.status(200).json({ data: permission })
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
