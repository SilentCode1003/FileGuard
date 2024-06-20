import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { createFolderFileSchema, folderFilesFolderIdSchema } from '../schema/folderFiles.schema'

export const getFolderFiles: RequestHandler = async (req, res) => {
  const validatedParams = folderFilesFolderIdSchema.safeParse(req.params)

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.errors[0]?.message })
  }

  try {
    const folderFiles = await prisma.folderFiles.findMany({
      where: {
        ffFolderId: validatedParams.data.ffFolderId,
      },
    })
    return res.status(200).json({ data: folderFiles })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const createFolderFile: RequestHandler = async (req, res) => {
  const validatedBody = createFolderFileSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const folderFile = await prisma.folderFiles.create({
      data: {
        ffId: req.body.ffId,
        ffFolderId: req.body.ffFolderId,
        ffFileId: req.body.ffFileId,
      },
    })
    return res.status(200).json({ data: folderFile })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}
