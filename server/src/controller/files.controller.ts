import type { Files, Revisions } from '@prisma/client'
import type { RequestHandler } from 'express'
import { writeFile } from 'fs'
import { CONFIG } from '../config/env.config.js'
import { prisma } from '../db/prisma'
import { createFileSchema, createRevisionsSchema, searchFilesSchema } from '../schema/files.schema'
import { createFolder, decodeBase64ToFile, getFolderPath } from '../util/customhelper.js'
import { nanoid } from '../util/nano.util'

export const getFiles: RequestHandler = async (req, res) => {
  const validatedBody = searchFilesSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    if (!req.query.searchText) {
      const files = await prisma.files.findMany({
        omit: {
          fileBase: true,
        },
      })
      return res.status(200).json({ data: files })
    }
    const files = await prisma.files.findMany({
      where: {
        OR: [
          {
            fileName: {
              contains: validatedBody.data.searchText,
            },
          },
        ],
      },
      omit: {
        fileBase: true,
      },
    })
    return res.status(200).json({ data: files })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const createFile: RequestHandler = async (req, res) => {
  const validatedBody = await createFileSchema.safeParseAsync({
    files: req.body.files.map((file: any) => ({ ...file, fileUserId: req.context.user!.userId })),
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    let newFiles: Array<Omit<Files, 'fileBase'>> = []
    for (const fileData of validatedBody.data.files) {
      const file = Buffer.from(fileData.file, 'base64')

      await prisma.$transaction(async (prisma) => {
        const filePath = `./root${fileData.filePath}/${fileData.fileName}`

        const checkFile = await prisma.files.findFirst({
          where: {
            AND: [
              {
                filePath: `root${fileData.filePath}`,
              },
              {
                fileName: fileData.fileName,
              },
            ],
          },
        })
        if (checkFile) {
          throw new Error('File already exists!')
        } else {
          writeFile(filePath, file, (err) => {
            if (err) throw err
            console.log('The file has been saved!')
          })

          const newFileId = nanoid()
          const newFile = await prisma.files.create({
            data: {
              fileBase: fileData.file,
              fileId: newFileId,
              fileName: fileData.fileName,
              filePath: `root${fileData.filePath}`,
              fileUserId: req.context.user.userId,
            },
            omit: {
              fileBase: true,
            },
          })

          const folderName = /\w+/gi.exec(fileData.filePath)!
          const folderPath = `root${getFolderPath(fileData.filePath)}`

          const folder = await prisma.folders.findFirst({
            where: {
              AND: [{ folderName: folderName[0]! }, { folderPath }],
            },
          })

          if (!folder) {
            throw new Error('Folder not found!')
          }

          const newFolderFileId = nanoid()

          await prisma.folderFiles.create({
            data: {
              ffId: newFolderFileId,
              ffFolderId: folder.folderId,
              ffFileId: newFileId,
            },
          })

          newFiles.push(newFile)
        }
      })
    }
    return res.status(200).json({ data: newFiles })
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      res.statusMessage = error.message
      return res.status(500).send({ message: error.message })
    }
  }
}

export const createRevisions: RequestHandler = async (req, res) => {
  const validatedBody = await createRevisionsSchema.safeParseAsync({
    files: req.body.files.map((file: any) => ({
      ...file,
      revFileUserId: req.context.user!.userId,
    })),
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    let newRevisions: Array<Omit<Revisions, 'revFileBase'>> = []
    for (const fileData of validatedBody.data.files) {
      const file = Buffer.from(fileData.revFile, 'base64')

      await prisma.$transaction(async (prisma) => {
        const filePath = `./root${fileData.revFilePath}/${fileData.revFileName}`

        const checkRevision = await prisma.revisions.findFirst({
          where: {
            AND: [
              {
                revFilePath: `root${fileData.revFilePath}`,
              },
              {
                revFileName: fileData.revFileName,
              },
            ],
          },
        })
        if (checkRevision) {
          throw new Error('Revision already exists!')
        } else {
          writeFile(filePath, file, (err) => {
            if (err) throw err
            console.log('The Revision file has been saved!')
          })

          const newRevId = nanoid()
          const newRevision = await prisma.revisions.create({
            data: {
              revFileBase: fileData.revFile,
              revFileId: fileData.revFileId,
              revFileName: fileData.revFileName,
              revFilePath: `root${fileData.revFilePath}`,
              revUserId: req.context.user.userId,
              revId: newRevId,
            },
            omit: {
              revFileBase: true,
            },
          })

          const folderName = /\w+/gi.exec(fileData.revFilePath)!
          const folderPath = `root${getFolderPath(fileData.revFilePath)}`

          const folder = await prisma.folders.findFirst({
            where: {
              AND: [{ folderName: folderName[0]! }, { folderPath }],
            },
          })

          if (!folder) {
            throw new Error('Folder not found!')
          }

          const newFolderFileId = nanoid()

          await prisma.folderFiles.create({
            data: {
              ffId: newFolderFileId,
              ffFolderId: folder.folderId,
              ffRevId: newRevId,
            },
          })

          newRevisions.push(newRevision)
        }
      })
    }
    return res.status(200).json({ data: newRevisions })
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      res.statusMessage = error.message
      return res.status(500).send({ message: error.message })
    }
  }
}

export const uploadFile: RequestHandler = async (req, res) => {
  try {
    const { filename, filecontent } = req.body
    const targetFolder = `${CONFIG.IS_FILE_SERVER == true ? CONFIG.FILE_SERVER : 'root'}`
    const userId = req.context.user.userId
    let folders = filename.split('_')

    if (filename.includes('REV')) {
      console.log('File Revision detected!')
    }

    if (folders.length > 4) {
      // console.log(folders[0], folders[1], folders[2], folders[3])
      let companyFolder = `${targetFolder}/${folders[0]}`
      let yearOrArchive = `${companyFolder}/${folders[1]}`
      let departmentFolder = `${yearOrArchive}/${folders[2]}`
      let documentTypeFolder = `${departmentFolder}/${folders[3]}`

      await createFolder(companyFolder, 0, userId)
      await createFolder(yearOrArchive, 1, userId)
      await createFolder(departmentFolder, 2, userId)
      await createFolder(documentTypeFolder, 3, userId)

      decodeBase64ToFile(filecontent, `${documentTypeFolder}/${filename}`)

      await prisma.$transaction(async (prisma) => {
        const newFileId = nanoid()

        const checkFile = await prisma.files.findFirst({
          where: {
            AND: [
              {
                filePath: documentTypeFolder,
              },
              {
                fileName: filename,
              },
            ],
          },
        })

        if (checkFile) {
          throw new Error('File already exists!')
        }

        const folderName = /\w+$/i.exec(documentTypeFolder)!
        const folderPath = getFolderPath(documentTypeFolder)

        const folder = await prisma.folders.findFirst({
          where: {
            AND: [{ folderName: folderName[folderName.length - 1]! }, { folderPath: folderPath }],
          },
        })

        if (!folder) {
          throw new Error('Folder not found!')
        }

        await prisma.files.create({
          data: {
            fileBase: filecontent,
            fileId: newFileId,
            fileName: filename,
            filePath: documentTypeFolder,
            fileUserId: userId,
          },
          omit: {
            fileBase: true,
          },
        })

        const newFolderFileId = nanoid()
        await prisma.folderFiles.create({
          data: {
            ffId: newFolderFileId,
            ffFolderId: folder.folderId,
            ffFileId: newFileId,
          },
        })
      })
      return res.status(200).send({ message: 'Upload Success' })
    } else {
      console.log('Incorrect Filename!', filename)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      res.statusMessage = error.message
      return res.status(500).send({ message: error.message })
    }
  }
}
