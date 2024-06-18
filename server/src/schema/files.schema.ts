import { z } from 'zod'

export const createFileSchema = z.object({
  file: z.string().base64(),
  fileUserId: z.string().nanoid(),
})
