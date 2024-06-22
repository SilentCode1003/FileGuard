import type { RequestHandler } from 'express'
import { createFolderSchema, getFoldersSchema } from '../schema/folder.schema'
import { nanoid } from '../util/nano.util'
import { prisma } from '../db/prisma'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { CONFIG } from '../config/env.config'

export const getFolders: RequestHandler = async (req, res) => {
  const validatedBody = getFoldersSchema.safeParse(req.query)
  
  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const folders = await prisma.folders.findMany({
      where: {
        folderPath: `${validatedBody.data.folderPath}`,
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
  console.log(req.body)
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
      const folderPath = `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}${validatedBody.data.folderPath}/${validatedBody.data.folderName}`

      if (!existsSync(folderPath)) {
        await mkdir(folderPath)
      }

      const checkFolder = await prisma.folders.findFirst({
        where: {
          AND: [
            {
              folderPath: validatedBody.data.folderPath,
            },
            {
              folderName: validatedBody.data.folderName,
            },
          ],
        },
      })

      if (checkFolder) {
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
