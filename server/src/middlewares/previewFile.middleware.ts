import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import { getFolderPath } from '../util/customhelper'

export const previewFileAuth: RequestHandler = async (req, res, next) => {
  try {
    // check if file exists

    const checkFile = await prisma.files.findFirst({
      where: {
        filePath: getFolderPath(req.url),
      },
    })
    if (!checkFile) throw new Error('File not found!')

    // check user role
    if (req.context.user.role.urName === 'admin') next()
    else {
      // check user permission

      const permission = await prisma.permissions.findFirst({
        where: {
          AND: [
            {
              permCdId: req.context.user.userCdId,
            },
            {
              permFolderId: checkFile.fileFolderId,
            },
          ],
        },
      })

      if (!permission) throw new Error('Unauthorized!')

      next()
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      res.statusMessage = error.message
      return res.status(500).send({ message: error.message })
    }
  }
}
