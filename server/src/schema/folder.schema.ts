import { z } from 'zod'

export const createFolderSchema = z.object({
  folderName: z
    .string({ required_error: 'folderName is required' })
    .trim()
    .min(1, { message: 'folderName is required' }),
  folderPath: z
    .string({ required_error: 'folderPath is required' })
    .trim()
    .min(1, { message: 'folderPath is required' }),
  folderParentId: z.string().trim().optional(),
  folderUserId: z.string({ required_error: 'folderUserId is required' }).nanoid(),
  folderDepth: z.number({ required_error: 'folderDepth is required' }),
})

export const getFoldersByPathSchema = z.object({
  folderPath: z.string().min(1),
})

export const getFoldersByParentIdSchema = z.object({
  folderParentId: z.string().optional(),
})
