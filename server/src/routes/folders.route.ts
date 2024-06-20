import express from 'express'
import { createFolder, getFolders } from '../controller/folder.controller'

export const foldersRouter = express.Router()

foldersRouter.get('/', getFolders)

foldersRouter.post('/', createFolder)
