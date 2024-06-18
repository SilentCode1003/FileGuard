import express from 'express'
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  togglePermissionById,
  updatePermissionById,
} from '../controller/permissions.controller'

export const permissionsRouter = express.Router()

permissionsRouter.get('/', getAllPermissions)

permissionsRouter.post('/', createPermission)

permissionsRouter.get('/:id', getPermissionById)

permissionsRouter.put('/:id', updatePermissionById)

permissionsRouter.put('/:id/toggle', togglePermissionById)
