import type { RequestHandler } from 'express'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { CONFIG } from '../config/env.config'
import { prisma } from '../db/prisma'
import {
  createFolderSchema,
  getFoldersByParentIdSchema,
  getFoldersByPathSchema,
} from '../schema/folder.schema'
import { nanoid } from '../util/nano.util'

export const getFoldersByPath: RequestHandler = async (req, res) => {
  const validatedBody = getFoldersByPathSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const folders = await prisma.folders.findMany({
      where: {
        folderPath: validatedBody.data.folderPath,
      },
    })
    return res.status(200).json({ data: folders })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}

export const getFoldersByParentId: RequestHandler = async (req, res) => {
  const validatedBody = getFoldersByParentIdSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const folders = await prisma.folders.findMany({
      where: {
        folderParentId: validatedBody.data.folderParentId ?? null,
      },
    })
    return res.status(200).json({ data: folders })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}

export const createFolder: RequestHandler = async (req, res) => {
  const validatedBody = createFolderSchema.safeParse({
    ...req.body,
    folderUserId: req.context.user!.userId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const newFolderId = nanoid()

    await prisma.$transaction(async (prisma) => {
      const folderPath = `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}/${validatedBody.data.folderPath}/${validatedBody.data.folderName}`

      if (!existsSync(folderPath)) {
        await mkdir(folderPath)
      }

      const checkFolder = await prisma.folders.findFirst({
        where: {
          AND: [
            {
              folderPath: `/${validatedBody.data.folderPath}`,
            },
            {
              folderName: validatedBody.data.folderName,
            },
          ],
        },
      })

      if (checkFolder) {
        if (checkFolder.folderIsActive === false)
          throw new Error('Folder already exists but is currently inactive!')
        throw new Error('Folder already exists')
      }

      const folder = await prisma.folders.create({
        data: {
          ...validatedBody.data,
          folderPath: `/${validatedBody.data.folderPath === '/' ? '' : `${validatedBody.data.folderPath}`}`,
          folderId: newFolderId,
          folderUserId: req.context.user!.userId,
          folderParentId: validatedBody.data.folderParentId ?? null,
        },
      })

      return res.status(200).json({ data: folder })
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}
