import { z } from 'zod'

export const createFileSchema = z.object({
  file: z.string().base64(),
  fileName: z.string(),
  fileMimeType: z.string(),
  filePath: z.string(),
})

export const searchFilesSchema = z.object({
  searchText: z.string().optional(),
})
