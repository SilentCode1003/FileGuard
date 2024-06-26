import { z } from 'zod'

export const companyDepartmentIdSchema = z.object({
  id: z.string().nanoid(),
})

export const updateCompanyDepartmentSchema = z.object({
  cdId: z
    .string({ required_error: 'cdId is required' })
    .trim()
    .min(1, { message: 'cdId is required' }),
  cdCompId: z.string().optional(),
  cdDeptId: z.string().optional(),
})

export const toggleCompanyDepartmentSchema = z.object({
  cdId: z
    .string({
      required_error: 'cdId  is required',
    })
    .nanoid(),
})
