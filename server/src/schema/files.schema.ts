import { z } from 'zod'

export const createFileSchema = z.object({
  file: z.string().base64(),
  fileName: z.string(),
  fileMimeType: z.string(),
})
