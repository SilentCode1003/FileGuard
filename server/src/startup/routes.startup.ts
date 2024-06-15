import type { Express } from 'express'
import { authRouter } from '../routes/auth.route'
import { healthRouter } from '../routes/health.route'

export const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use('/health', healthRouter)
}
