import express from 'express'
import { createUserLog, getAllUserLogs } from '../controller/logs.controller'

export const userLogsRouter = express.Router()

userLogsRouter.get('/', getAllUserLogs)

userLogsRouter.post('/', createUserLog)
