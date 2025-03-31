import express from 'express'
import {
    addUser,
    deleteUser,
    getUserById,
    getUserByUserName,
    getUserCourses,
    getUsers,
    updateUserInfo,
} from '~/controllers/userController'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.get('/getUserInfo', getUserByUserName)
userRouter.get('/getUserInfo/course/:userId', getUserCourses)
userRouter.post('/addUser', addUser)
userRouter.put('/updateUserInfo', updateUserInfo)
userRouter.put('/deleteUser/:userName', deleteUser)

export { userRouter }
