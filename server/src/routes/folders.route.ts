import express from 'express'
import {
  createFolder,
  getFoldersByParentId,
  moveFolder,
  updateFolder,
  updateFolderPermissions,
  //   getFoldersByPath,
} from '../controller/folder.controller'

export const foldersRouter = express.Router()

// foldersRouter.get('/', getFoldersByPath)

foldersRouter.get('/', getFoldersByParentId)

foldersRouter.post('/', createFolder)

foldersRouter.put('/', updateFolder)

foldersRouter.put('/move', moveFolder)

foldersRouter.put('/permissions/', updateFolderPermissions)
