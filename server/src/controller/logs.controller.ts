import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createUserLogSchema } from '../schema/logs.schema'
import { nanoid } from '../util/nano.util'

export const getAllUserLogs: RequestHandler = async (req, res, next) => {
  try {
    const userLogs = await prisma.userLogs.findMany()

    res.status(200).json({ data: userLogs })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const createUserLog: RequestHandler = async (req, res, next) => {
  const validatedBody = createUserLogSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const userLog = await prisma.userLogs.create({
      data: {
        ...validatedBody.data,
        ulId: nanoid(),
        ulUserId: req.context.user.userId,
      },
    })

    res.status(200).json({ data: userLog })
  } catch (err) {
    // TODO: Handle errors
  }
}
