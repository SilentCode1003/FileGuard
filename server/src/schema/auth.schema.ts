import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'username is required' })
    .trim()
    .min(1, { message: 'username is required' }),
  password: z
    .string({ required_error: 'password is required' })
    .trim()
    .min(1, { message: 'password is required' }),
})
