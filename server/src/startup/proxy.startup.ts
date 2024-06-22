import type { Express } from 'express'
import { logger } from '../util/logger.util'
import { CONFIG } from '../config/env.config'

export const initProxy = (app: Express) => {
  if (CONFIG.NODE_ENV === 'production') {
    logger.info('Setting trust proxy to 1')
    app.set('trust proxy', 1)
  } else {
    logger.info('Noop on trust proxy because NODE_ENV is not production')
  }
}
