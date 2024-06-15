import morgan, { type StreamOptions } from 'morgan'
import { logger } from '../util/logger.util'

const stream: StreamOptions = {
  write: (message) => logger.http(message),
}

export const loggerMiddleware = morgan('common', { stream })
