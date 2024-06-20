import express from 'express'
import {
  createFile,
  createRevisions,
  getFilesByPath,
  searchFiles,
} from '../controller/files.controller'

export const filesRouter = express.Router()

filesRouter.get('/', getFilesByPath)

filesRouter.get('/search-files', searchFiles)

filesRouter.post('/', createFile)

filesRouter.post('/revisions', createRevisions)
