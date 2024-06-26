import express from 'express'
import {
  getAllCompanyDepartment,
  getCompanyDepartmentById,
  toggleCompanyDepartmentById,
  updateCompanyDepartmentById,
} from '../controller/companyDepartment.controller'

export const companyDepartmentRouter = express.Router()

companyDepartmentRouter.get('/', getAllCompanyDepartment)

companyDepartmentRouter.get('/:id', getCompanyDepartmentById)

companyDepartmentRouter.put('/:cdId', updateCompanyDepartmentById)

companyDepartmentRouter.put('/toggle/:cdId/', toggleCompanyDepartmentById)
