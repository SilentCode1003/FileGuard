import { z } from 'zod'

export const createUserLogSchema = z.object({
  ulDescription: z
    .string({ required_error: 'ulDescription is required' })
    .trim()
    .min(1, { message: 'ulDescription is required' }),
})
