import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { CONSTANTS } from '../config/constant.config'
import { prisma } from '../db/prisma'
import { loginSchema } from '../schema/auth.schema'

export const login: RequestHandler = async (req, res, next) => {
  const validatedBody = loginSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        userUsername: validatedBody.data.username,
      },
      include: {
        role: true,
        comp: true,
        dept: true,
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

export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { userId: req.context.user.userId },
    })

    if (!user) {
      return res.status(401).json({
        data: {
          isLogged: false,
        },
      })
    } else {
      return res.status(200).json({
        data: {
          isLogged: true,
          user: {
            userId: user.userId,
            userFullname: user.userFullname,
            userUsername: user.userUsername,
            userRoleId: user.userRoleId,
            userIsActive: user.userIsActive,
          },
        },
      })
    }
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}
