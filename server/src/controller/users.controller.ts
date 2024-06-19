import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createUserSchema, toggleUserSchema, updateUserSchema } from '../schema/users.schema'
import bcrypt from 'bcrypt'
import { nanoid } from '../util/nano.util'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        role: true,
      },
      omit: {
        userPassword: true,
      },
    })
    return res.status(200).json({ data: users })
  } catch (err) {
    // TODO: handle error
  }
}

export const createUser: RequestHandler = async (req, res) => {
  const validatedBody = createUserSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const newUserId = nanoid()

    const user = await prisma.users.create({
      data: {
        ...validatedBody.data,
        userId: newUserId,
        userPassword: await bcrypt.hash('password', 10),
        userRoleId: validatedBody.data.userRoleId,
      },
      omit: {
        userPassword: true,
      },
    })
    return res.status(200).json({ data: user })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'User already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Role id does not exist' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const updateUser: RequestHandler = async (req, res) => {
  const validatedBody = updateUserSchema.safeParse({
    ...req.body,
    userId: req.params.userId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const user = await prisma.users.update({
      where: { userId: req.params.userId },
      data: {
        ...validatedBody.data,
        userPassword: await bcrypt.hash('password', 10),
      },
      omit: {
        userPassword: true,
      },
    })
    return res.status(200).json({ data: user })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'User already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        case 'P2025':
          return res.status(400).json({ message: 'User to update not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const toggleUser: RequestHandler = async (req, res) => {
  const validatedBody = toggleUserSchema.safeParse({
    userId: req.params.userId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const user = await prisma.users.findUnique({
      where: { userId: validatedBody.data.userId },
    })
    const toggledUser = await prisma.users.update({
      where: { userId: validatedBody.data.userId },
      data: {
        userIsActive: !user?.userIsActive,
      },
      omit: {
        userPassword: true,
      },
    })
    return res.status(200).json({ data: toggledUser })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}
