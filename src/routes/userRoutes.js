import express from 'express'
import { addUser, deleteUser, getUserByUserName, getUsers, updateUserInfo } from '~/controllers/userController'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/getUserInfo/:userName', getUserByUserName)
userRouter.post('/addUser', addUser)
userRouter.put('/updateUserInfo', updateUserInfo)
userRouter.put('/deleteUser/:userName', deleteUser)

export { userRouter }
