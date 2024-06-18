import { z } from 'zod'

export const createPermissionSchema = z.object({
  permUrId: z.string({ required_error: 'permUrId is required' }).nanoid(),
  permFolderId: z.string({ required_error: 'permFolderId is required' }).nanoid(),
})

export const permissionIdSchema = z.object({
  id: z.string().nanoid(),
})
