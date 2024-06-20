import type { RequestHandler } from 'express'

export const getHealth: RequestHandler = (req, res, next) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  }

  res.status(200).json({ data })
}
