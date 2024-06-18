import express from 'express'
import {
  createUserRole,
  toggleUserRoleById,
  getUserRoleById,
  getUserRoles,
  updateUserRoleById,
} from '../controller/roles.controller'

export const userRolesRouter = express.Router()

userRolesRouter.get('/', getUserRoles)

userRolesRouter.post('/', createUserRole)

userRolesRouter.get('/:id', getUserRoleById)

userRolesRouter.put('/:id', updateUserRoleById)

userRolesRouter.put('/:id/toggle', toggleUserRoleById)
