import type { Files, Revisions } from '@prisma/client'
import type { RequestHandler } from 'express'
import { readFileSync, writeFile } from 'fs'
import { writeFile as asyncWriteFile } from 'fs/promises'
import { CONFIG } from '../config/env.config.js'
import { prisma } from '../db/prisma'
import {
  createFileSchema,
  createRevisionsSchema,
  getFilesByPathSchema,
  getRevisionsByFileIdSchema,
  previewFileSchema,
  searchFilesSchema,
} from '../schema/files.schema'
import { createFolder, decodeBase64ToFile, getFolderPath } from '../util/customhelper.js'
import { nanoid } from '../util/nano.util'
import PdfParse from 'pdf-parse'
import mammoth from 'mammoth'

export const getFilesByPath: RequestHandler = async (req, res) => {
  const validatedBody = getFilesByPathSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    if (!req.query.filePath) {
      const files = await prisma.files.findMany({
        omit: {
          fileBase: true,
        },
      })
      return res.status(200).json({ data: files })
    }
    const files = await prisma.files.findMany({
      where: {
        filePath: `root${validatedBody.data.filePath === '/' ? '' : validatedBody.data.filePath}`,
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

export const getRevisionsByFileId: RequestHandler = async (req, res) => {
  const validatedBody = getRevisionsByFileIdSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  try {
    const revisions = await prisma.revisions.findMany({
      where: {
        revFileId: validatedBody.data.revFileId,
      },
      omit: {
        revFileBase: true,
      },
    })
    return res.status(200).json({ data: revisions })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const searchFiles: RequestHandler = async (req, res) => {
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
  const validatedBody = createFileSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  const validatedData = await createFileSchema.safeParseAsync({
    files: req.body.files.map((file: any) => ({ ...file, fileUserId: req.context.user!.userId })),
  })

  if (!validatedData.success) {
    return res.status(400).json({ message: validatedData.error.errors[0]?.message })
  }

  try {
    let newFiles: Array<Omit<Files, 'fileBase'>> = []
    for (const fileData of validatedData.data.files) {
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

          const folderName = /\w+$/gi.exec(fileData.filePath)!
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

          await asyncWriteFile(filePath, file)

          if (fileData.fileMimeType == 'application/pdf') {
            let databuffer = readFileSync(filePath)
            const content = (await PdfParse(databuffer)).text.replaceAll(/\s+/g, '')

            const newFileContentId = nanoid()
            await prisma.fileContents.create({
              data: {
                fcId: newFileContentId,
                fcFileId: newFileId,
                fcContent: content,
              },
            })
            console.log(`this file is a pdf file: ${fileData.fileName}`)
          }

          if (
            fileData.fileMimeType ==
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileData.fileMimeType == 'application/msword'
          ) {
            const data = await mammoth.extractRawText({
              path: filePath,
            })
            const content = data.value.replaceAll(/\s+/g, '')

            const newFileContentId = nanoid()
            await prisma.fileContents.create({
              data: {
                fcId: newFileContentId,
                fcFileId: newFileId,
                fcContent: content,
              },
            })

            console.log(`this file is a word file: ${fileData.fileName}`)
          }

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
  const validatedBody = createRevisionsSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  const validatedData = await createRevisionsSchema.safeParseAsync({
    files: req.body.files.map((file: any) => ({
      ...file,
      revFileUserId: req.context.user!.userId,
    })),
  })

  if (!validatedData.success) {
    return res.status(400).json({ message: validatedData.error.errors[0]?.message })
  }

  try {
    let newRevisions: Array<Omit<Revisions, 'revFileBase'>> = []
    for (const fileData of validatedData.data.files) {
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
    const { filename, filecontent } = req.body as { filename: string; filecontent: string }
    const targetFolder = `${CONFIG.IS_FILE_SERVER == true ? CONFIG.FILE_SERVER : 'root'}`
    const userId = req.context.user.userId
    let folders = filename.split('_')

    let companyFolder = `${targetFolder}/${folders[0]}`
    let yearOrArchive = `${companyFolder}/${folders[1]}`
    let departmentFolder = `${yearOrArchive}/${folders[2]}`
    let documentTypeFolder = `${departmentFolder}/${folders[3]}`

    if (filename.includes('REV')) {
      const revFileName = filename
      const origFileName = filename.replace(/\_REV[\S\s]+\./i, '.')
      console.log('File Revision detected!')

      await prisma.$transaction(async (prisma) => {
        //check if target file for revision exists

        const checkFile = await prisma.files.findFirst({
          where: {
            AND: [
              {
                filePath: documentTypeFolder,
              },
              {
                fileName: origFileName,
              },
            ],
          },
        })

        if (!checkFile) {
          throw new Error('Original file not found!')
        }

        //check if revision file exists
        const checkRev = await prisma.revisions.findFirst({
          where: {
            AND: [
              {
                revFilePath: documentTypeFolder,
              },
              {
                revFileName: revFileName,
              },
            ],
          },
        })

        if (checkRev) {
          throw new Error('Revision already exists!')
        }

        //check if folder exists
        const folderName = /\w+$/i.exec(documentTypeFolder)!
        const folderPath = getFolderPath(documentTypeFolder)

        const folder = await prisma.folders.findFirst({
          where: {
            AND: [{ folderName: folderName[folderName.length - 1]! }, { folderPath: folderPath }],
          },
        })

        console.log(folder?.folderPath)
        console.log(documentTypeFolder)

        if (!folder) {
          throw new Error('Folder not found!')
        }

        //create new revision
        const newRevId = nanoid()
        await prisma.revisions.create({
          data: {
            revFileBase: filecontent,
            revFileId: checkFile.fileId,
            revFileName,
            revFilePath: documentTypeFolder,
            revUserId: userId,
            revId: newRevId,
          },
          omit: {
            revFileBase: true,
          },
        })

        //create new folder file
        const newFolderFileId = nanoid()
        await prisma.folderFiles.create({
          data: {
            ffId: newFolderFileId,
            ffFolderId: folder.folderId,
            ffRevId: newRevId,
          },
        })

        //write file to disk
        decodeBase64ToFile(filecontent, `${documentTypeFolder}/${revFileName}`)

        return res.status(200).send({ message: 'Revision passed' })
      })
    } else {
      if (folders.length > 4) {
        // console.log(folders[0], folders[1], folders[2], folders[3])

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
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      res.statusMessage = error.message
      return res.status(500).send({ message: error.message })
    }
  }
}
