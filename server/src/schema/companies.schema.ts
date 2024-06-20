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

