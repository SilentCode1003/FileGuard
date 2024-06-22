import express from 'express'
import {
  createFile,
  createRevisions,
  getFilesByPath,
  getRevisionsByFileId,
  searchFiles,
} from '../controller/files.controller'
import { previewFileAuth } from '../middlewares/previewFile.middleware'
import { CONFIG } from '../config/env.config'

export const filesRouter = express.Router()

filesRouter.get('/', getFilesByPath)

filesRouter.get('/search-files', searchFiles)

filesRouter.post('/', createFile)

filesRouter.get('/revisions', getRevisionsByFileId)

filesRouter.post('/revisions', createRevisions)

filesRouter.use(
  '/preview',
  previewFileAuth,
  express.static(`${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}`),
)
