import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createUserSchema, toggleUserSchema, updateUserSchema } from '../schema/users.schema'
import bcrypt from 'bcrypt'
import { nanoid } from '../util/nano.util'

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        userRole: true,
      },
    })
    return res.status(200).json({ users })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

export const createUser: RequestHandler = async (req, res) => {
  const validatedBody = await createUserSchema.safeParseAsync(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ error: validatedBody.error.errors[0]?.message })
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
    return res.status(200).json({ user })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

export const updateUser: RequestHandler = async (req, res) => {
  const validatedBody = await updateUserSchema.safeParseAsync({
    ...req.body,
    userId: req.params.userId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ error: validatedBody.error.errors[0]?.message })
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
    return res.status(200).json({ user })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

export const toggleUser: RequestHandler = async (req, res) => {
  const validatedBody = await toggleUserSchema.safeParseAsync({
    userId: req.params.userId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ error: validatedBody.error.errors[0]?.message })
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
    })
    return res.status(200).json({ user: toggledUser })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}
