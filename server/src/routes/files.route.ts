import express from 'express'
import { createFile, getFile } from '../controller/files.controller'

export const filesRouter = express.Router()

filesRouter.get('/', getFile)

filesRouter.post('/', createFile)
