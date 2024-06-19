import express from 'express'
import {
  createDepartment,
  getAllDeparments,
  getDepartmentById,
  toggleDepartmentById,
  updateDepartmentById,
} from '../controller/departments.controller'

export const departmentsRouter = express.Router()

departmentsRouter.get('/', getAllDeparments)

departmentsRouter.post('/', createDepartment)

departmentsRouter.get('/:id', getDepartmentById)

departmentsRouter.put('/:id', updateDepartmentById)

departmentsRouter.put('/:id/toggle', toggleDepartmentById)
