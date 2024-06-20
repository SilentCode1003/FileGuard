import express from 'express'
import { createFile, createRevisions, getFiles } from '../controller/files.controller'

export const filesRouter = express.Router()

filesRouter.get('/', getFiles)

filesRouter.post('/', createFile)

filesRouter.post('/revisions', createRevisions)
