import express from 'express'
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  toggleDepartmentById,
  updateDepartment,
} from '../controller/departments.controller'

export const departmentsRouter = express.Router()

departmentsRouter.get('/', getAllDepartments)

departmentsRouter.post('/', createDepartment)

departmentsRouter.get('/:id', getDepartmentById)

departmentsRouter.put('/:id', updateDepartment)

departmentsRouter.put('/:id/toggle', toggleDepartmentById)
