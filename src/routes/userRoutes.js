import express from 'express'
import { addUser, getUserInfo, getUsers } from '~/controllers/userController'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/:userName', getUserInfo)
userRouter.post('/addUser', addUser)

export { userRouter }
