import express from 'express'
import { createFolderFile, getFolderFiles } from '../controller/folderFiles.controller'

export const folderFilesRouter = express.Router()

folderFilesRouter.get('/', getFolderFiles)

folderFilesRouter.post('/', createFolderFile)
