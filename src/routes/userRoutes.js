import express from 'express'
import { getUserInfo, getUsers } from '~/controllers/userController'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/:userName', getUserInfo)

export { userRouter }
