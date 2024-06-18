import type { Express } from 'express'
import { uploadFile } from '../controller/files.controller'
import { auth } from '../middlewares/auth.middleware'
import { authRouter } from '../routes/auth.route'
import { filesRouter } from '../routes/files.route'
import { foldersRouter } from '../routes/folders.route'
import { healthRouter } from '../routes/health.route'
import { permissionsRouter } from '../routes/permissions.route'
import { userRolesRouter } from '../routes/roles.route'
import { usersRouter } from '../routes/users.route'

export const initRoutes = (app: Express) => {
  app.post('/upload', uploadFile)
  app.use('/auth', authRouter)
  app.use(auth)
  app.use('/health', healthRouter)
  app.use('/files', filesRouter)
  app.use('/folders', foldersRouter)
  app.use('/users', usersRouter)
  app.use('/user-roles', userRolesRouter)
  app.use('/permissions', permissionsRouter)
}
