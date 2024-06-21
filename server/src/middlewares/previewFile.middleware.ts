import type { RequestHandler } from 'express'

export const previewFileAuth: RequestHandler = async (req, res, next) => {
  console.log(req.url)

  // return res.status(401).json({ message: 'Unauthorized' })

  next()
}
