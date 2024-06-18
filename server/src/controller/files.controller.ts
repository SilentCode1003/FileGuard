import type { RequestHandler } from 'express'
import { writeFile } from 'fs'
import { createFileSchema } from '../schema/files.schema'
import { prisma } from '../db/prisma'

export const getFile: RequestHandler = async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      omit: {
        fileBase: true,
      },
    })
    return res.status(200).json({ data: files })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const createFile: RequestHandler = async (req, res) => {
  const validatedBody = await createFileSchema.safeParseAsync({
    file: req.body.file,
    fileUserId: req.context.user!.userId,
    fileMimeType: req.body.fileMimeType,
    fileName: req.body.fileName,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ error: validatedBody.error.errors })
  }

  try {
    const file = Buffer.from(validatedBody.data.file, 'base64')

    writeFile(`./root/${validatedBody.data.fileName}`, file, (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    })

    return res.status(200).json({ message: 'File created' })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}
