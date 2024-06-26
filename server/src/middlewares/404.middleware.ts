import type { RequestHandler } from 'express'

export const notFoundController: RequestHandler = (req, res, next) => {
  res.status(404).json({ message: 'Resource not found' })
}
