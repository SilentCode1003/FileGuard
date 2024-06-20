import express from 'express'
import { 
    getAllCompanies, 
    createCompanies,
    updateCompaniesById,
    getCompaniesById,
    toggleCompaniesById
     } from '../controller/companies.controller'


export const companyRouter = express.Router()

companyRouter.get('/', getAllCompanies)

companyRouter.post('/', createCompanies)

companyRouter.get('/:id', getCompaniesById)

companyRouter.put('/:id', updateCompaniesById)

companyRouter.put('/toggle/:id', toggleCompaniesById)