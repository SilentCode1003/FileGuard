import express from 'express'
import { getMe, login, logout } from '../controller/auth.controller'

export const authRouter = express.Router()

authRouter.get('/me', getMe)

authRouter.post('/login', login)

authRouter.delete('/logout', logout)
