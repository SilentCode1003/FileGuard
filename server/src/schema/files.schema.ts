import { z } from 'zod'

export const createFileSchema = z.object({
  files: z.array(
    z.object({
      file: z.string().base64(),
      fileName: z.string(),
      fileMimeType: z.string(),
      filePath: z.string(),
    }),
  ),
})

export const searchFilesSchema = z.object({
  searchText: z.string().optional(),
})

export const createRevisionsSchema = z.object({
  files: z.array(
    z.object({
      revFile: z.string().base64(),
      revFileName: z.string(),
      revFileMimeType: z.string(),
      revFilePath: z.string(),
      revFileId: z.string().nanoid(),
    }),
  ),
})
