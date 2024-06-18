import type { RequestHandler } from 'express'
import { createFileSchema } from '../schema/files.schema'

export const getFile: RequestHandler = async (req, res) => {}

export const createFile: RequestHandler = async (req, res) => {
  const validatedBody = await createFileSchema.safeParseAsync({
    file: req.body.file,
    fileUserId: req.context.user!.userId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ error: validatedBody.error.errors })
  }

  try {
    const file = Buffer.from(validatedBody.data.file, 'base64')

    const newFile = new File([file], 'test')
    console.log(newFile)

    return res.status(200).json({ message: 'File created' })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}
