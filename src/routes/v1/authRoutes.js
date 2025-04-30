import express from 'express'
import {
    changePassWord,
    forgotPassWord,
    login,
    logout,
    refreshAccessToken,
    register,
    resetPassWord,
    socialLogin,
    verifyOTP,
} from '~/controllers/authController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/login/social', socialLogin)
authRouter.post('/logout', authenticateToken, logout)
authRouter.post('/register', register)
authRouter.put('/changePassWord', authenticateToken, changePassWord)
authRouter.post('/forgotPassWord', forgotPassWord)
authRouter.post('/resetPassWord', resetPassWord)
authRouter.post('/verifyOtp', verifyOTP)
authRouter.post('/refreshToken', authenticateToken, refreshAccessToken)

export { authRouter }
