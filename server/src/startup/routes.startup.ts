import type { Express } from 'express'
import { authRouter } from '../routes/auth.route'
import { healthRouter } from '../routes/health.route'
import { auth } from '../middlewares/auth.middleware'
import { fileRouter } from '../routes/file.route'

export const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use(auth)
  app.use('/health', healthRouter)
  app.use('/file', fileRouter)
}
