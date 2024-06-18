import type { ErrorRequestHandler } from 'express'
import { logger } from '../util/logger.util'

export const errorController: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ messsage: 'JSON Syntax Error' })
  }

  console.log(err)
  logger.error(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  res.status(500).json({ message: 'Internal server error' })
}
