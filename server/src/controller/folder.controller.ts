import type { RequestHandler } from 'express'
import { createFolderSchema } from '../schema/folder.schema'
import { nanoid } from '../util/nano.util'
import { prisma } from '../db/prisma'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

export const getFolders: RequestHandler = async (req, res) => {}

export const createFolder: RequestHandler = async (req, res) => {
  const validatedBody = await createFolderSchema.safeParse({
    ...req.body,
    folderUserId: req.context.user!.userId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ error: validatedBody.error.errors[0]?.message })
  }

  try {
    const newFolderId = nanoid()

    await prisma.$transaction(async (prisma) => {
      const folderPath = `root/${validatedBody.data.folderPath}/${validatedBody.data.folderName}`

      if (existsSync(folderPath)) {
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

      if (!checkFolder) {
        const folder = await prisma.folders.create({
          data: {
            ...validatedBody.data,
            folderId: newFolderId,
            folderUserId: req.context.user!.userId,
            folderParentId: validatedBody.data.folderParentId ?? null,
          },
        })
        return res.status(200).json({ folder })
      } else throw new Error('Folder already exists')
    })
  } catch (error) {
    // console.log(error)

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error })
  }
}
