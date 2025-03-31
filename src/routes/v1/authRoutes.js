import express from 'express'
import { login, logout, register, socialLogin } from '~/controllers/authController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/login/social', socialLogin)
authRouter.post('/logout', authenticateToken, logout)
authRouter.post('/register', register)

export { authRouter }
