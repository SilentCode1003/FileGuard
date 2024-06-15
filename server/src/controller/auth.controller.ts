import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { CONSTANTS } from '../config/constant.config'
import { prisma } from '../db/prisma'
import { loginSchema } from '../schema/auth.schema'
import { logger } from '../util/logger.util'

export const getMe: RequestHandler = async (req, res, next) => {
  // req.session.user should because this controller should be called after isLoggedIn(or whatever login checker) middleware
  res.status(200).json({ data: req.session!.user })
}

export const login: RequestHandler = async (req, res, next) => {
  const validatedBody = loginSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.flatten() })
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        userUsername: validatedBody.data.username,
      },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordIsMatch = await bcrypt.compare(validatedBody.data.password, user.userPassword)

    if (!passwordIsMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const { userPassword, ...userWithoutPassword } = user

    req.session.user = userWithoutPassword

    res.status(200).json({ data: userWithoutPassword })
  } catch (err) {
    // TODO: Handle possible errors
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Cannot destroy session')
    }

    res.clearCookie(CONSTANTS.SESSION_COOKIE_NAME)

    res.sendStatus(204)
  })
}
