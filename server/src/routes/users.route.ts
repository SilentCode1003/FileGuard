import express from 'express'

import { createUser, getUsers, updateUser } from '../controller/users.controller'

export const usersRouter = express.Router()

usersRouter.get('/', getUsers)

usersRouter.post('/', createUser)

usersRouter.put('/:userId', updateUser)
