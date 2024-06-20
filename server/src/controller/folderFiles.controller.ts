import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'

export const getFolderFiles: RequestHandler = async (req, res) => {
  try {
    const folderFiles = await prisma.folderFiles.findMany({
      where: {
        ffFolderId: req.params.folderId,
      },
    })
    return res.status(200).json({ data: folderFiles })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const createFolderFile: RequestHandler = async (req, res) => {
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
