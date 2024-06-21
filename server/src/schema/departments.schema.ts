import { z } from 'zod'

export const createDepartmentSchema = z.object({
  deptName: z
    .string({ required_error: 'deptName is required' }).trim().min(1, { message: 'deptName is required' }),
})

export const departmentIdSchema = z.object({
  id: z.string().nanoid(),
})
