import type { ErrorRequestHandler } from 'express'

export const errorController: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ messsage: 'JSON Syntax Error' })
  }

  res.status(500).json({ message: 'Internal server error' })
}
