import fs from 'fs'
import { prisma } from '../db/prisma'
import { nanoid } from './nano.util'

export const createFolder = async (dir: any, folderDepth: number, folderUserId: string) => {
  await prisma.$transaction(async (prisma) => {
    const folderName = /\w+/gi.exec(dir)!
    const newFolderId = nanoid()
    await prisma.folders.create({
      data: {
        folderName: folderName[folderName.length - 1]!,
        folderDepth: folderDepth,
        folderId: newFolderId,
        folderPath: dir.split('/').pop() as string,
        folderUserId,
      },
    })

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

export const decodeBase64ToFile = (base64String: string, filePath: string) => {
  // Decode the Base64 string
  const pdfBuffer = Buffer.from(base64String, 'base64')

  // Write the binary data to a file
  fs.writeFile(filePath, pdfBuffer, (err) => {
    if (err) {
      console.error('Error writing file:', err)
    } else {
      console.log('File saved successfully:', filePath)
    }
  })
}
