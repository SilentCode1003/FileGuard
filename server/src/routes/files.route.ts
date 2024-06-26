import express from 'express'
import { CONFIG } from '../config/env.config'
import {
  advancedSearch,
  createFile,
  createRevisions,
  getFilesByFolderId,
  getRevisionsByFileId,
  searchFiles,
} from '../controller/files.controller'
import { previewFileAuth } from '../middlewares/previewFile.middleware'

export const filesRouter = express.Router()

filesRouter.get('/', getFilesByFolderId)

filesRouter.get('/search-files', searchFiles)

filesRouter.post('/', createFile)

filesRouter.get('/revisions', getRevisionsByFileId)

filesRouter.post('/revisions', createRevisions)

filesRouter.get('/advanced-search', advancedSearch)

filesRouter.put('/')

filesRouter.put('/move')

filesRouter.use(
  '/preview',
  previewFileAuth,
  express.static(`${CONFIG.FILE_SERVER === 'root' ? './' : ''}${CONFIG.FILE_SERVER}`),
)
