import { z } from 'zod'

export const createFolderSchema = z.object({
  folderName: z.string().min(1),
  folderPath: z.string().min(1),
  folderParentId: z.string().min(1).optional(),
  folderUserId: z.string().nanoid(),
  folderDepth: z.number(),
})

export const getFoldersSchema = z.object({
  folderPath: z.string().min(1),
})
