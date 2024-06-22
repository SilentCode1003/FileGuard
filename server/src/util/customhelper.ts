import fs from 'fs'
import { prisma } from '../db/prisma'
import { nanoid } from './nano.util'
import { writeFile } from 'fs/promises'
import { CONFIG } from '../config/env.config'

export const getFolderPath = (folderPath: string) => {
  const initPath = folderPath.split('/')

  initPath.pop()

  const finalPath = `${initPath.length > 1 ? initPath.join('/') : '/'}`

  return finalPath
}
export const createFolder = async (dir: any, folderDepth: number, folderUserId: string) => {
  const folderName = /[\s\w]+$/gi.exec(dir)! // regex to get last /folder as folderName

  const newFolderId = nanoid()
  await prisma.$transaction(async (prisma) => {
    const folderPath = getFolderPath(dir)

    const dirExists = await prisma.folders.findFirst({
      where: {
        AND: [
          {
            folderPath,
          },
          {
            folderName: folderName[0]!,
          },
        ],
      },
    })

    if (dirExists) {
      return
    }

    if (folderDepth > 0) {
      const parentfolderName = /[\s\w]+$/gi.exec(folderPath)! // regex to get last /folder as folderName
      const parentFolder = await prisma.folders.findFirst({
        where: {
          AND: [
            {
              folderPath: getFolderPath(folderPath),
            },
            {
              folderName: parentfolderName[0],
            },
          ],
        },
      })

      await prisma.folders.create({
        data: {
          folderName: folderName[0]!,
          folderDepth: folderDepth,
          folderId: newFolderId,
          folderPath,
          folderUserId,
          folderParentId: parentFolder?.folderId,
        },
      })
    } else {
      await prisma.folders.create({
        data: {
          folderName: folderName[folderName.length - 1]!,
          folderDepth: folderDepth,
          folderId: newFolderId,
          folderPath,
          folderUserId,
        },
      })
    }

    const folderDir = `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}${dir}`

    //console.log(`Create folder: ${dir}`);
    fs.mkdirSync(folderDir, { recursive: true })

    if (fs.existsSync(folderDir)) {
      //console.log(`Path exist: ${dir}`);
      return 'exist'
    } else {
      //console.log(`Create path: ${dir}`);
      fs.mkdirSync(folderDir)
      return 'create'
    }
  })
}

export const decodeBase64ToFile = async (base64String: string, filePath: string) => {
  const path = `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}${filePath}`

  // Decode the Base64 string
  const pdfBuffer = Buffer.from(base64String, 'base64')

  // Write the binary data to a file
  try {
    await writeFile(path, pdfBuffer)
    console.log('File saved successfully')
  } catch (error) {
    console.log('Error saving file:', error)
    throw new Error('Error saving file')
  }
}
