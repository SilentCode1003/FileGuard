import express from 'express'
import { createFolder, getFolders } from '../controller/folder.controller'

export const folderRouter = express.Router()

folderRouter.get('/', getFolders)

folderRouter.post('/', createFolder)
