import type { RequestHandler } from 'express'
import { existsSync, writeFile } from 'fs'
import { prisma } from '../db/prisma'
import { createFileSchema } from '../schema/files.schema'
import { createFolder, decodeBase64ToFile, getFolderPath } from '../util/customhelper.js'

import { CONFIG } from '../config/env.config.js'
import { nanoid } from '../util/nano.util'

export const getFiles: RequestHandler = async (req, res) => {
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
    filePath: req.body.filePath,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const file = Buffer.from(validatedBody.data.file, 'base64')

    await prisma.$transaction(async (prisma) => {
      const filePath = `./root${validatedBody.data.filePath}/${validatedBody.data.fileName}`

      if (existsSync(filePath)) {
        // make revision entry of file
        return res.status(400).json({ message: 'File already exists!' })
      } else {
        writeFile(filePath, file, (err) => {
          if (err) throw err
          console.log('The file has been saved!')
        })

        const newFileId = nanoid()
        const newFile = await prisma.files.create({
          data: {
            fileBase: validatedBody.data.file,
            fileId: newFileId,
            fileName: validatedBody.data.fileName,
            filePath: validatedBody.data.filePath,
            fileUserId: req.context.user.userId,
          },
          omit: {
            fileBase: true,
          },
        })

        const folderName = /\w+/gi.exec(validatedBody.data.filePath)!
        const folderPath = `root${getFolderPath(validatedBody.data.filePath)}`

        const folder = await prisma.folders.findFirst({
          where: {
            AND: [{ folderName: folderName[0]! }, { folderPath }],
          },
        })

        if (!folder) {
          return res.status(400).json({ message: 'Folder not found!' })
        }

        await prisma.folderFiles.create({
          data: {
            ffId: newFileId,
            ffFolderId: folder.folderId,
            ffFileId: newFileId,
          },
        })

        return res.status(200).json({ data: newFile })
      }
    })
  } catch (err) {
    return res.status(500).json({ message: err })
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
