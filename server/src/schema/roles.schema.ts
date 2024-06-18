import { z } from 'zod'

export const createUserRoleSchema = z.object({
  urName: z
    .string({ required_error: 'urName is required' })
    .trim()
    .min(1, { message: 'urName is required' }),
})

export const userRoleIdSchema = z.object({
  id: z.string().nanoid(),
})
