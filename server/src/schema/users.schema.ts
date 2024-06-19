import { z } from 'zod'

export const createUserSchema = z.object({
  userFullname: z.string({
    required_error: 'userFullname is required',
  }),
  userUsername: z.string({
    required_error: 'userUsername is required',
  }),
  userPassword: z.string({
    required_error: 'userPassword is required',
  }),
  userRoleId: z
    .string({
      required_error: 'userRoleId is required',
    })
    .nanoid(),
})

export const updateUserSchema = z.object({
  userId: z
    .string({
      required_error: 'userId is required',
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
      required_error: 'userId is required',
    })
    .nanoid(),
})
