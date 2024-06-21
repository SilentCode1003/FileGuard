import fs from 'fs'
import { prisma } from '../db/prisma'
import { nanoid } from './nano.util'
import { writeFile } from 'fs/promises'

export const getFolderPath = (folderPath: string) => {
  const initPath = folderPath.split('/')

  initPath.pop()

  const finalPath = `${initPath.join('/')}`

  return finalPath
}
export const createFolder = async (dir: any, folderDepth: number, folderUserId: string) => {
  const folderName = /\w+[\s]\w+$/gi.exec(dir)! // regex to get last /folder as folderName
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
      const parentfolderName = /\w+[\s]\w+$/gi.exec(folderPath)! // regex to get last /folder as folderName
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

    //console.log(`Create folder: ${dir}`);
    fs.mkdirSync(dir, { recursive: true })

    if (fs.existsSync(dir)) {
      //console.log(`Path exist: ${dir}`);
      return 'exist'
    } else {
      //console.log(`Create path: ${dir}`);
      fs.mkdirSync(dir)
      return 'create'
    }
  })
}

export const decodeBase64ToFile = async (base64String: string, filePath: string) => {
  // Decode the Base64 string
  const pdfBuffer = Buffer.from(base64String, 'base64')

  // Write the binary data to a file
  try {
    await writeFile(filePath, pdfBuffer)
    console.log('File saved successfully')
  } catch (error) {
    console.log('Error saving file:', error)
    throw new Error('Error saving file')
  }
}
