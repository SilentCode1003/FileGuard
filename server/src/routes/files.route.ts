import express from 'express'
import { createFile, getFiles } from '../controller/files.controller'

export const filesRouter = express.Router()

filesRouter.get('/', getFiles)

filesRouter.post('/', createFile)
