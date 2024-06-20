import express from 'express'
import {
  createFile,
  createRevisions,
  getFilesByPath,
  getRevisionsByFileId,
  searchFiles,
} from '../controller/files.controller'

export const filesRouter = express.Router()

filesRouter.get('/', getFilesByPath)

filesRouter.get('/search-files', searchFiles)

filesRouter.post('/', createFile)

filesRouter.get('/revisions', getRevisionsByFileId)

filesRouter.post('/revisions', createRevisions)
