import cors from 'cors'
import type { Express } from 'express'
import { CONFIG } from '../config/env.config'
import { logger } from '../util/logger.util'

const allowedOrigins =
  CONFIG.NODE_ENV === 'production'
    ? CONFIG.CLIENT_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173']

const options: cors.CorsOptions = {
  credentials: true, // Accept cookies
  origin: allowedOrigins,
}

export const initCors = (app: Express) => {
  logger.info(`Adding ${allowedOrigins} on allowed origins`)
  app.use(cors(options))
}
