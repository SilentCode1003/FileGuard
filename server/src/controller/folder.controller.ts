import type { RequestHandler } from 'express'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { CONFIG } from '../config/env.config'
import { prisma } from '../db/prisma'
import {
  createFolderSchema,
  getFolderBreadcrumbSchema,
  getFoldersByParentIdSchema,
  getFoldersByPathSchema,
  moveFolderSchema,
  updateFolderPermissionsSchema,
  updateFolderSchema,
} from '../schema/folder.schema'
import { nanoid } from '../util/nano.util'

export const getFoldersByPath: RequestHandler = async (req, res) => {
  const validatedBody = getFoldersByPathSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const folders = await prisma.folders.findMany({
      where: {
        folderPath: validatedBody.data.folderPath,
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

export const getFolderBreadcrumb: RequestHandler = async (req, res) => {
  const validatedBody = getFolderBreadcrumbSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    if (!validatedBody.data.folderId)
      return res.status(200).json({
        data: null,
      })

    const breadCrumb: Array<{
      folderId: string
      folderName: string
    }> = []
    let folder = await prisma.folders.findUnique({
      where: {
        folderId: validatedBody.data.folderId,
      },
    })

    while (folder?.folderParentId) {
      breadCrumb.push({
        folderId: folder.folderId,
        folderName: folder.folderName,
      })
      folder = await prisma.folders.findUnique({
        where: {
          folderId: folder.folderParentId,
        },
      })
    }

    breadCrumb.push({
      folderId: folder!.folderId,
      folderName: folder!.folderName,
    })
    return res.status(200).json({ data: breadCrumb })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}

export const getFoldersByParentId: RequestHandler = async (req, res) => {
  const validatedBody = getFoldersByParentIdSchema.safeParse(req.query)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const folders = await prisma.folders.findMany({
      where: {
        folderParentId: validatedBody.data.folderParentId ?? null,
      },
    })

    let currentFolder = null
    if (validatedBody.data.folderParentId) {
      currentFolder = await prisma.folders.findFirst({
        where: {
          folderId: validatedBody.data.folderParentId,
        },
      })
    }
    const permissions = await prisma.permissions.findMany({
      where: {
        permCdId: req.context.user!.userCdId,
      },
    })
    return res.status(200).json({
      data: {
        currentFolder,
        folders:
          req.context.user.role.urName === 'admin'
            ? folders
            : folders.filter((folder) =>
                permissions.some((perm) => perm.permFolderId === folder.folderId),
              ),
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}

export const createFolder: RequestHandler = async (req, res) => {
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
      const folderPath = `${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}/${validatedBody.data.folderPath}/${validatedBody.data.folderName}`

      if (!existsSync(folderPath)) {
        await mkdir(folderPath)
      }

      const checkFolder = await prisma.folders.findFirst({
        where: {
          AND: [
            {
              folderParentId: validatedBody.data.folderParentId ?? null,
            },
            {
              folderName: validatedBody.data.folderName,
            },
          ],
        },
      })

      if (checkFolder) {
        if (checkFolder.folderIsActive === false)
          throw new Error('Folder already exists but is currently inactive!')
        throw new Error('Folder already exists')
      }

      const folder = await prisma.folders.create({
        data: {
          ...validatedBody.data,
          folderPath: `${validatedBody.data.folderPath}`,
          folderId: newFolderId,
          folderUserId: req.context.user!.userId,
          folderParentId: validatedBody.data.folderParentId ?? null,
        },
      })

      // Create user permissions for folder

      if (req.context.user.role.urName !== 'admin') {
        const users = await prisma.users.findMany({
          where: {
            companyDepartment: req.context.user.companyDepartment,
          },
        })
        await prisma.permissions.createMany({
          data: users.map((user) => {
            const newPermId = nanoid()

            return {
              permId: newPermId,
              permFolderId: folder.folderId,
              permCdId: user.userCdId,
            }
          }),
        })
      }

      return res.status(200).json({ data: folder })
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}

export const updateFolder: RequestHandler = async (req, res) => {
  const validatedBody = updateFolderSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }
  try {
    const folder = await prisma.folders.update({
      where: {
        folderId: validatedBody.data.folderId,
      },
      data: validatedBody.data,
    })
    return res.status(200).json({ data: folder })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}

export const updateFolderPermissions: RequestHandler = async (req, res) => {
  const validatedBody = updateFolderPermissionsSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }
  try {
    await prisma.$transaction(async (prisma) => {
      const permissions = await prisma.permissions.findMany({
        where: {
          permFolderId: validatedBody.data.folderId,
        },
      })

      const removedPermissions = permissions.filter((permission) =>
        validatedBody.data.cdIds.some((cdId) => cdId === permission.permCdId),
      )

      await prisma.permissions.deleteMany({
        where: {
          permId: {
            in: removedPermissions.map((permission) => permission.permId),
          },
        },
      })

      const newPermissions = validatedBody.data.cdIds.map((cdId) => {
        const newPermId = nanoid()

        return {
          permId: newPermId,
          permFolderId: validatedBody.data.folderId,
          permCdId: cdId,
        }
      })

      await prisma.permissions.createMany({
        data: newPermissions,
      })

      const folder = await prisma.folders.findUnique({
        where: {
          folderId: validatedBody.data.folderId,
        },
      })

      // add new permissions to parent folders

      let parentFolder = await prisma.folders.findFirst({
        where: folder?.folderParentId
          ? {
              folderId: folder.folderParentId,
            }
          : {},
      })
      while (parentFolder?.folderParentId) {
        if (!parentFolder) break
        await prisma.permissions.createMany({
          data: newPermissions.map((permission) => {
            return {
              permId: nanoid(),
              permFolderId: parentFolder!.folderId,
              permCdId: permission.permCdId,
            }
          }),
          skipDuplicates: true,
        })
        parentFolder = await prisma.folders.findFirst({
          where: {
            folderId: parentFolder.folderParentId,
          },
        })
      }

      await prisma.permissions.createMany({
        data: newPermissions.map((permission) => {
          return {
            permId: nanoid(),
            permFolderId: parentFolder!.folderId,
            permCdId: permission.permCdId,
          }
        }),
        skipDuplicates: true,
      })

      return res.status(200).json({ data: newPermissions })
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}

export const moveFolder: RequestHandler = async (req, res) => {
  const validatedBody = moveFolderSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }
  try {
    const folder = await prisma.folders.update({
      where: {
        folderId: validatedBody.data.folderId,
      },
      data: validatedBody.data,
    })
    return res.status(200).json({ data: folder })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: error })
  }
}
