import express from 'express'
import {
  createFolder,
  getFoldersByParentId,
  //   getFoldersByPath,
} from '../controller/folder.controller'

export const foldersRouter = express.Router()

// foldersRouter.get('/', getFoldersByPath)

foldersRouter.get('/', getFoldersByParentId)

foldersRouter.post('/', createFolder)
