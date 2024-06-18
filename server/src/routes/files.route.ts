import express from 'express'
import { createFile, getFile } from '../controller/files.controller'

export const fileRouter = express.Router()

fileRouter.get('/', getFile)

fileRouter.post('/', createFile)
