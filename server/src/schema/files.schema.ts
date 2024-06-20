import { z } from 'zod'

export const createFileSchema = z.object({
  files: z.array(
    z.object({
      file: z.string({ required_error: 'file is required' }).base64(),
      fileName: z.string({ required_error: 'fileName is required' }),
      fileMimeType: z.string({ required_error: 'fileMimeType is required' }),
      filePath: z.string({ required_error: 'filePath is required' }),
    }),
  ),
})

export const searchFilesSchema = z.object({
  searchText: z.string().optional(),
})

export const createRevisionsSchema = z.object({
  files: z.array(
    z.object({
      revFile: z.string({ required_error: 'revFile is required' }).base64(),
      revFileName: z.string({ required_error: 'revFileName is required' }),
      revFileMimeType: z.string({ required_error: 'revFileMimeType is required' }),
      revFilePath: z.string({ required_error: 'revFilePath is required' }),
      revFileId: z.string({ required_error: 'revFileId is required' }).nanoid(),
    }),
  ),
})
