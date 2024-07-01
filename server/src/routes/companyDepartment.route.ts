import express from 'express'
import {
  getAllCompanyDepartment,
  getCompanyDepartmentByCompId,
  getCompanyDepartmentById,
  toggleCompanyDepartmentById,
  updateCompanyDepartmentById,
} from '../controller/companyDepartment.controller'

export const companyDepartmentRouter = express.Router()

companyDepartmentRouter.get('/', getAllCompanyDepartment)

companyDepartmentRouter.get('/company/:compId', getCompanyDepartmentByCompId)

companyDepartmentRouter.get('/:id', getCompanyDepartmentById)

companyDepartmentRouter.put('/:cdId', updateCompanyDepartmentById)

companyDepartmentRouter.put('/toggle/:cdId/', toggleCompanyDepartmentById)
