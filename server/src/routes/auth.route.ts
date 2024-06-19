import express from 'express'
import { getCurrentUser, login, logout } from '../controller/auth.controller'
import { auth } from '../middlewares/auth.middleware'

export const authRouter = express.Router()

authRouter.post('/login', login)

authRouter.delete('/logout', logout)

authRouter.get('/me', auth, getCurrentUser)
