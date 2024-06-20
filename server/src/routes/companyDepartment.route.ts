import express from 'express'
import { 
    createCompanyDepartment, 
    getAllCompanyDepartment, 
    getCompanyDepartmentById, 
    toggleCompanyDepartmentById, 
    updateCompanyDepartmentById 
} from '../controller/companyDepartment.controller'

export const CompanyDepartmentRouter = express.Router()

CompanyDepartmentRouter.get('/', getAllCompanyDepartment)

CompanyDepartmentRouter.post('/', createCompanyDepartment)

CompanyDepartmentRouter.get('/:id', getCompanyDepartmentById)

CompanyDepartmentRouter.put('/:id', updateCompanyDepartmentById)

CompanyDepartmentRouter.put('/:id/toggle', toggleCompanyDepartmentById)