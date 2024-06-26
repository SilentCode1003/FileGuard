import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { loginSchema } from '../schema/auth.schema'

export const auth: RequestHandler = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.context = {
    user: req.session.user,
  }

  return next()
}

export const serviceAuth: RequestHandler = async (req, res, next) => {
  const validatedBody = await loginSchema.safeParseAsync({
    username: req.body.username,
    password: req.body.password,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: 'invalid credentials' })
  }

  const user = await prisma.users.findUnique({
    where: {
      userUsername: validatedBody.data.username,
    },
    include: {
      role: true,
      companyDepartment: true,
    },
  })

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.context = {
    user,
  }

  return next()
}
