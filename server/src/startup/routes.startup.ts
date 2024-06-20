import type { Express } from 'express'
import { uploadFile } from '../controller/files.controller'
import { auth, serviceAuth } from '../middlewares/auth.middleware'
import { authRouter } from '../routes/auth.route'
import { departmentsRouter } from '../routes/departments.route'
import { filesRouter } from '../routes/files.route'
import { folderFilesRouter } from '../routes/folderFiles.route'
import { foldersRouter } from '../routes/folders.route'
import { healthRouter } from '../routes/health.route'
//import { fileRouter } from '../routes/file.route'
import { userLogsRouter } from '../routes/logs.route'
import { permissionsRouter } from '../routes/permissions.route'
import { userRolesRouter } from '../routes/roles.route'
import { usersRouter } from '../routes/users.route'
import { companyRouter } from '../routes/companies.route'
import { CompanyDepartmentRouter } from '../routes/companyDepartment.route'

export const initRoutes = (app: Express) => {
  app.post('/upload', serviceAuth, uploadFile)
  app.use('/auth', authRouter)
  //app.use(auth)
  app.use('/health', healthRouter)
  app.use('/files', filesRouter)
  app.use('/folders', foldersRouter)
  app.use('/folder-files', folderFilesRouter)
  app.use('/users', usersRouter)
  app.use('/user-roles', userRolesRouter)
  app.use('/permissions', permissionsRouter)
  app.use('/departments', departmentsRouter)
  app.use('/user-logs', userLogsRouter)
  app.use('/companies', companyRouter)
  app.use('/companyDepartments', CompanyDepartmentRouter)
}
