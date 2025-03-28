import express from 'express'
import { login, loginWithGoogle, logout, register } from '~/controllers/authController'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/login/google', loginWithGoogle)
authRouter.post('/logout', logout)
authRouter.post('/register', register)

export { authRouter }
