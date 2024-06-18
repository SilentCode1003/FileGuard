import type { Express } from 'express'
import { auth } from '../middlewares/auth.middleware'
import { authRouter } from '../routes/auth.route'
import { fileRouter } from '../routes/files.route'
import { healthRouter } from '../routes/health.route'
import { usersRouter } from '../routes/users.route'

export const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use(auth)
  app.use('/health', healthRouter)
  app.use('/file', fileRouter)
  app.use('/users', usersRouter)
}
