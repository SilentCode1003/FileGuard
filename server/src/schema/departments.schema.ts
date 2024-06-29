import { z } from 'zod'

export const createDepartmentSchema = z.object({
  deptName: z
    .string({ required_error: 'deptName is required' })
    .trim()
    .min(1, { message: 'deptName is required' }),
  compId: z.string({ required_error: 'compId is required' }).nanoid(),
})

export const departmentIdSchema = z.object({
  id: z.string().nanoid(),
})

export const updateDepartmentSchema = z.object({
  deptId: z
    .string({
      required_error: 'deptId is required',
    })
    .nanoid(),
  deptName: z.string().trim().min(1, { message: 'deptName is required' }).optional(),
})
