import { z } from 'zod'

export const createCompaniesSchema = z.object({
  compName: z
    .string({ required_error: 'compName is required' })
    .trim()
    .min(1, { message: 'compName is required' }),
})

export const companiesIdSchema = z.object({
  id: z.string().nanoid(),
})



export const updateCompaniesSchema = z.object({
  compId: z
    .string({ required_error: 'compId is required' })
    .trim()
    .min(1, { message: 'compId is required' }),
  compName: z.string().optional(),
})


export const toggleCompaniesSchema = z.object({
  compId: z
    .string({
      required_error: 'Comp ID is required',
    })
    .nanoid(),
})


