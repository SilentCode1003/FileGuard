import { z } from 'zod'

export const createUserSchema = z.object({
  userFullname: z.string({
    required_error: 'Fullname is required',
  }),
  userUsername: z.string({
    required_error: 'Username is required',
  }),
  userPassword: z.string({
    required_error: 'Password is required',
  }),
  userRoleId: z
    .string({
      required_error: 'Role is required',
    })
    .nanoid(),
})

export const updateUserSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
    })
    .nanoid(),
  userFullname: z.string().optional(),
  userUsername: z.string().optional(),
  userRoleId: z.string().nanoid().optional(),
  userPassword: z.string().optional(),
})

export const toggleUserSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
    })
    .nanoid(),
})
