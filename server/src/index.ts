import express from 'express'
import { CONFIG } from './config/env.config'
import { prisma } from './db/prisma.js'
import { notFoundController } from './middlewares/404.middleware'
import { errorController } from './middlewares/error.middleware'
import { loggerMiddleware } from './middlewares/logger.middleware'
import { initDocs } from './providers/swagger.provider'
import { initCors } from './startup/cors.startup'
import { initRoutes } from './startup/routes.startup'
import { initSession } from './startup/session.startup'
import { logger } from './util/logger.util'

const app = express()

const startServer = () => {
  logger.info('--------------------Server starting--------------------')
  logger.info(`Running application on ${CONFIG.NODE_ENV} environment`)

  logger.info('Adding req body json parser')
  app.use(express.json())

  logger.info('Adding logger middleware')
  app.use(loggerMiddleware)

  logger.info('Adding CORS middleware')
  initCors(app)

  logger.info('Adding session middleware')
  initSession(app)

  logger.info('Adding routes')
  initRoutes(app)

  logger.info('Adding swagger docs')
  initDocs(app)

  logger.info('Adding notFoundController')
  app.use(notFoundController)

  logger.info('Adding errorController')
  app.use(errorController)

  const server = app.listen(CONFIG.SERVER_PORT, () => {
    logger.info(`Server listening on port ${CONFIG.SERVER_PORT}`)
  })

  process.on('SIGINT', () => {
    logger.info(
      '--------------------SIGINT signal recieved, Closing the application--------------------',
    )
    prisma.$disconnect().then(() => logger.info('Prisma disconnected'))
    server.close()
  })
}

startServer()
