import { z } from 'zod'

export const createFileSchema = z.object({
  files: z.array(
    z.object({
      file: z
        .string({ required_error: 'file is required' })
        .refine((value) => isValidBase64(value), 'file is not a valid base64 string'),
      fileName: z.string({ required_error: 'fileName is required' }),
      filePath: z.string({ required_error: 'filePath is required' }),
      fileMimeType: z.string({ required_error: 'fileMimeType is required' }),
    }),
    { required_error: 'files is required' },
  ),
})

const isValidBase64 = (b: string) => {
  try {
    return b.length > 3 && !(b.length % 4) && atob(b) && true
  } catch (err) {
    return false
  }
}

export const searchFilesSchema = z.object({
  searchText: z.string().optional(),
})

export const getFilesByPathSchema = z.object({
  filePath: z.string().optional(),
})

export const getRevisionsByFileIdSchema = z.object({
  revFileId: z.string({ required_error: 'fileId is required' }),
})

export const createRevisionsSchema = z.object({
  files: z.array(
    z.object({
      revFile: z.string({ required_error: 'revFile is required' }).base64(),
      revFileName: z.string({ required_error: 'revFileName is required' }),
      revFilePath: z.string({ required_error: 'revFilePath is required' }),
      revFileId: z.string({ required_error: 'revFileId is required' }).nanoid(),
      revFileMimeType: z.string({ required_error: 'revFileMimeType is required' }),
    }),
  ),
})

export const previewFileSchema = z.object({
  fileId: z.string({ required_error: 'fileId is required' }).nanoid(),
})
