import { z } from 'zod'

export const folderFilesFolderIdSchema = z.object({
  ffFolderId: z.string({ required_error: 'ffFolderId is required' }).nanoid(),
})

export const createFolderFileSchema = z.object({
  file: z.string({ required_error: 'file is required' }).base64(),
  fileName: z
    .string({ required_error: 'fileName is required' })
    .trim()
    .min(1, { message: 'fileName is required' }),
  fileMimeType: z
    .string({ required_error: 'fileMimeType is required' })
    .min(1, { message: 'fileMimeType is required' }),
})
