import { z } from 'zod'

export const createFolderFileSchema = z.object({
  file: z.string({ required_error: 'file is required' }).base64(),
  fileName: z.string({ required_error: 'fileName is required' }),
  fileMimeType: z.string({ required_error: 'fileMimeType is required' }),
})
