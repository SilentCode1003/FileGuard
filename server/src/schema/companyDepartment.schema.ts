import { z } from 'zod'

export const createCompanyDepartmentSchema = z.object({
    // cdId: z.string({ required_error: 'cdId is required' }).nanoid(),
    cdCompId: z.string({ required_error: 'cdCompId is required' }).nanoid(),
    cdDeptId: z.string({ required_error: 'cdDeptId is required' }).nanoid(),
})


export const companyDepartmentIdSchema = z.object({
    id: z.string().nanoid(),
  })
  