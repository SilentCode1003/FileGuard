import type { Files, Revisions } from '@prisma/client'
import type { RequestHandler } from 'express'
import { readFileSync, writeFile } from 'fs'
import { writeFile as asyncWriteFile } from 'fs/promises'
import mammoth from 'mammoth'
import PdfParse from 'pdf-parse'
import * as xlsx from 'xlsx'
import { CONFIG } from '../config/env.config.js'
import { prisma } from '../db/prisma'
import {
  advancedSearchSchema,
  createFileSchema,
  createRevisionsSchema,
  getFilesByPathSchema,
  getRevisionsByFileIdSchema,
  searchFilesSchema,
} from '../schema/files.schema'
import { createFolder, decodeBase64ToFile, getFolderPath } from '../util/customhelper.js'
import { nanoid } from '../util/nano.util'

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
        filePath: `/${validatedBody.data.filePath === '/' ? '' : validatedBody.data.filePath}`,
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

      await prisma.$transaction(
        async (prisma) => {
          const filePath = `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}${fileData.filePath}/${fileData.fileName}`

          const checkFile = await prisma.files.findFirst({
            where: {
              AND: [
                {
                  filePath: `${fileData.filePath}`,
                },
                {
                  fileName: fileData.fileName,
                },
              ],
            },
          })

          if (checkFile) {
            if (checkFile.fileIsActive === false)
              throw new Error('File already exists but is currently inactive!')

            throw new Error('File already exists!')
          } else {
            const folderName = /[\s\w]+$/gi.exec(fileData.filePath)!
            const folderPath = `${getFolderPath(fileData.filePath)}`

            const folder = await prisma.folders.findFirst({
              where: {
                AND: [{ folderName: folderName[0]! }, { folderPath }],
              },
            })

            if (!folder) {
              throw new Error('Folder not found!')
            }

            const newFileId = nanoid()
            const newFile = await prisma.files.create({
              data: {
                fileBase: fileData.file,
                fileId: newFileId,
                fileFolderId: fileData.fileFolderId,
                fileName: fileData.fileName,
                filePath: `${fileData.filePath}`,
                fileUserId: req.context.user.userId,
              },
              omit: {
                fileBase: true,
              },
            })

            await asyncWriteFile(filePath, file)

            let databuffer = readFileSync(filePath)
            if (fileData.fileMimeType == 'application/pdf') {
              const content = (await PdfParse(databuffer)).text.replaceAll(/\s+/g, '')

              // if (content === '') {
              //   // If the content is empty, we assume that the file only contains images
              //   let ocrContent = ''

              //   const worker = await Tesseract.createWorker('eng', 1)
              //   const outputImages = await pdf2img.convert(databuffer, { scale: 2 })

              //   for (const page of outputImages) {
              //     if (page instanceof Uint8Array) {
              //       const data = await worker.recognize(page)
              //       ocrContent += data.data.text
              //       console.log(data.data.text)
              //     }
              //   }

              //   await worker.terminate()

              //   const newFileContentId = nanoid()
              //   await prisma.fileContents.create({
              //     data: {
              //       fcId: newFileContentId,
              //       fcFileId: newFileId,
              //       fcContent: ocrContent,
              //     },
              //   })
              // } else {
              //   // If the content is not empty, we assume that the file contains a combination of text and images. We will however, not use OCR on the images

              //   const newFileContentId = nanoid()
              //   await prisma.fileContents.create({
              //     data: {
              //       fcId: newFileContentId,
              //       fcFileId: newFileId,
              //       fcContent: content,
              //     },
              //   })

              //   console.log(`this file is a pdf file: ${fileData.fileName}`)
              // }

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
              fileData.fileMimeType ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
              fileData.fileMimeType === 'application/msword'
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

            if (
              fileData.fileMimeType ==
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
              fileData.fileMimeType == 'application/vnd.ms-excel' ||
              fileData.fileMimeType == 'application/vnd.oasis.opendocument.spreadsheet'
            ) {
              const data = xlsx.read(databuffer, { type: 'buffer' })

              const content: Array<string> = []
              for (let i = 0; i < data.SheetNames.length; i++) {
                const sheet = data.Sheets[data.SheetNames[i]!]
                const text = xlsx.utils.sheet_to_txt(sheet!)

                content.push(text.replace(/\s+/g, ''))
              }

              const newFileContentId = nanoid()
              await prisma.fileContents.create({
                data: {
                  fcId: newFileContentId,
                  fcFileId: newFileId,
                  fcContent: content.join('\n'),
                },
              })

              console.log(`this file is an excel file: ${fileData.fileName}`)
            }

            newFiles.push(newFile)
          }
        },
        { maxWait: 3000 },
      )
    }
    return res.status(200).json({ data: newFiles })
  } catch (error) {
    console.log(error)

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
        const filePath = `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}${fileData.revFilePath}/${fileData.revFileName}`

        const checkRevision = await prisma.revisions.findFirst({
          where: {
            AND: [
              {
                revFilePath: `${fileData.revFilePath}`,
              },
              {
                revFileName: fileData.revFileName,
              },
            ],
          },
        })
        if (checkRevision) {
          if (checkRevision.revIsActive)
            throw new Error('Revision already exists but is currently inactive!')
          throw new Error('Revision already exists!')
        } else {
          writeFile(filePath, file, (err) => {
            if (err) throw err
            console.log('The Revision file has been saved!')
          })

          const folderName = /[\s\w]+$/gi.exec(fileData.revFilePath)!
          const folderPath = `${getFolderPath(fileData.revFilePath)}`

          const folder = await prisma.folders.findFirst({
            where: {
              AND: [{ folderName: folderName[0]! }, { folderPath }],
            },
          })

          if (!folder) {
            throw new Error('Folder not found!')
          }

          const newRevId = nanoid()
          const newRevision = await prisma.revisions.create({
            data: {
              revFileBase: fileData.revFile,
              revFileId: fileData.revFileId,
              revFileFolderId: fileData.revFileFolderId,
              revFileName: fileData.revFileName,
              revFilePath: `${fileData.revFilePath}`,
              revUserId: req.context.user.userId,
              revId: newRevId,
            },
            omit: {
              revFileBase: true,
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
    const { filename, filecontent, mimeType } = req.body as {
      filename: string
      filecontent: string
      mimeType: string
    }
    // const targetFolder = `${CONFIG.FILE_SERVER}`
    const userId = req.context.user.userId
    let folders = filename.split('_')

    let companyFolder = `/${folders[0]}`
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
          if (checkRev.revIsActive === false)
            throw new Error('Revision already exists but is currently inactive!')
          throw new Error('Revision already exists!')
        }

        //check if folder exists
        const folderName = /[\s\w]+$/i.exec(documentTypeFolder)!
        const folderPath = getFolderPath(documentTypeFolder)

        const folder = await prisma.folders.findFirst({
          where: {
            AND: [{ folderName: folderName[folderName.length - 1]! }, { folderPath: folderPath }],
          },
        })

        if (!folder) {
          throw new Error('Folder not found!')
        }

        //create new revision
        const newRevId = nanoid()
        await prisma.revisions.create({
          data: {
            revFileBase: filecontent,
            revFileId: checkFile.fileId,
            revFileFolderId: checkFile.fileFolderId,
            revFileName,
            revFilePath: documentTypeFolder,
            revUserId: userId,
            revId: newRevId,
          },
          omit: {
            revFileBase: true,
          },
        })

        //write file to disk
        await decodeBase64ToFile(filecontent, `${documentTypeFolder}/${revFileName}`)

        return res.status(200).send({ message: 'Revision passed' })
      })
    } else {
      if (folders.length > 4) {
        await createFolder(companyFolder, 0, userId)
        await createFolder(yearOrArchive, 1, userId)
        await createFolder(departmentFolder, 2, userId)
        await createFolder(documentTypeFolder, 3, userId)

        await decodeBase64ToFile(filecontent, `${documentTypeFolder}/${filename}`)

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
            if (checkFile.fileIsActive === false)
              throw new Error('File already exists but is currently inactive!')
            throw new Error('File already exists!')
          }

          const folderName = /[\s\w]+$/i.exec(documentTypeFolder)!
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
              fileFolderId: folder.folderId,
              filePath: documentTypeFolder,
              fileUserId: userId,
            },
            omit: {
              fileBase: true,
            },
          })

          let databuffer = readFileSync(
            `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}${documentTypeFolder}/${filename}`,
          )

          if (mimeType === 'application/pdf') {
            const content = (await PdfParse(databuffer)).text.replaceAll(/\s+/g, '')

            const newFileContentId = nanoid()
            await prisma.fileContents.create({
              data: {
                fcId: newFileContentId,
                fcFileId: newFileId,
                fcContent: content,
              },
            })
            console.log(`this file is a pdf file: ${filename}`)
          }

          if (
            mimeType ===
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
          ) {
            const data = await mammoth.extractRawText({
              path: `${documentTypeFolder}/${filename}`,
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

            console.log(`this file is a word file: ${filename}`)
          }

          if (
            mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            mimeType === 'application/vnd.ms-excel' ||
            mimeType === 'application/vnd.oasis.opendocument.spreadsheet'
          ) {
            const data = xlsx.read(databuffer, { type: 'buffer' })

            const content: Array<string> = []
            for (let i = 0; i < data.SheetNames.length; i++) {
              const sheet = data.Sheets[data.SheetNames[i]!]
              const text = xlsx.utils.sheet_to_txt(sheet!)

              content.push(text.replace(/\s+/g, ''))
            }

            const newFileContentId = nanoid()
            await prisma.fileContents.create({
              data: {
                fcId: newFileContentId,
                fcFileId: newFileId,
                fcContent: content.join('\n'),
              },
            })

            console.log(`this file is an excel file: ${filename}`)
          }
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

export const advancedSearch: RequestHandler = async (req, res) => {
  const validatedQueryParams = advancedSearchSchema.safeParse(req.query)

  if (!validatedQueryParams.success) {
    return res.status(400).json({ message: validatedQueryParams.error.errors[0]?.message })
  }

  try {
    const files = await prisma.files.findMany({
      where: {
        AND: [
          validatedQueryParams.data.fileType
            ? {
                fileName: {
                  endsWith: `.${validatedQueryParams.data.fileType}`,
                },
              }
            : {},
          validatedQueryParams.data.companyName
            ? {
                filePath: {
                  startsWith: `/${validatedQueryParams.data.companyName}`,
                },
              }
            : {},
          validatedQueryParams.data.fromDate && validatedQueryParams.data.toDate
            ? {
                fileCreatedAt: {
                  gte: new Date(validatedQueryParams.data.fromDate),
                  lte: new Date(validatedQueryParams.data.toDate),
                },
              }
            : {},
          // TODO: fix this
          validatedQueryParams.data.department
            ? {
                filePath: {
                  contains: `/${validatedQueryParams.data.department}`,
                },
              }
            : {},
          validatedQueryParams.data.keyword
            ? {
                fileContents: {
                  some: {
                    fcContent: {
                      contains: validatedQueryParams.data.keyword,
                    },
                  },
                },
              }
            : {},
          // TODO: documentType
        ],
      },
      omit: {
        fileBase: true,
      },
    })

    res.status(200).json({ data: files })
  } catch (err) {
    // TODO: Handle errors
    res.status(500).json({ message: err })
  }
}
