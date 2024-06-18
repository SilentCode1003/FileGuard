import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'

export const auth: RequestHandler = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.context = {
    user: req.session.user,
  }

  return next()
}
