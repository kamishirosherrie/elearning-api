import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import { refreshTokenModel } from '~/models/refreshTokenModel'

import { roleModel } from '~/models/roleModel'
import { userModel } from '~/models/userModel'
import { sendEmail } from '~/services/mailService'
import { changePassWordValidation, registerValidation } from '~/validations/inputValidation'

const createAccessToken = (user) => {
    return jwt.sign({ userId: user._id }, env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

const createRefreshToken = (user) => {
    return jwt.sign({ userId: user._id }, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const sendRefreshToken = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

export const refreshAccessToken = async (req, res) => {
    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(400).json({ message: 'Refresh token is required' })
    }

    try {
        const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET)

        const storedToken = await refreshTokenModel.findOne({
            userId: decoded.userId,
            refreshToken: token,
        })

        if (!storedToken) {
            return res.status(403).json({ message: 'Refresh token is invalid or has been revoked' })
        }

        const user = await userModel.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const accessToken = createAccessToken(user)

        return res.status(200).json({
            message: 'Refresh access token successfully',
            accessToken,
        })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Refresh token expired' })
        }

        return res.status(403).json({ message: 'Invalid refresh token', error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { identifier, passWord } = req.body
        const user = await userModel.findOne({ $or: [{ userName: identifier }, { email: identifier }] })
        if (!user) {
            return res.status(400).json({ message: 'Đăng nhập thất bại! Tài khoản không tồn tại' })
        }
        const isMatch = await bcrypt.compare(passWord, user.passWord)
        if (!isMatch) {
            return res.status(400).json({ message: 'Đăng nhập thất bại! Sai mật khẩu' })
        }

        const accessToken = createAccessToken(user)
        const refreshToken = createRefreshToken(user)

        await refreshTokenModel.create({ userId: user._id, refreshToken })
        sendRefreshToken(res, refreshToken)

        res.status(200).json({ message: 'Đăng nhập thành công!', user, accessToken })
    } catch (error) {
        res.status(500).json({ message: 'Đăng nhập thất bại! Vui lòng thử lại sau', error: error.message })
    }
}

export const socialLogin = async (req, res) => {
    try {
        const { email, fullName } = req.body
        let user = await userModel.findOne({ email: email })
        if (!user) {
            const role = await roleModel.findOne({ roleName: 'User' })
            if (!role) {
                return res.status(400).json({
                    message: 'Role not found',
                })
            }

            const randomPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(randomPassword, 10)

            user = await userModel.create({
                fullName: fullName,
                email: email,
                userName: email,
                passWord: hashedPassword,
                roleId: role._id,
            })

            await sendEmail(user.email, 'Đăng kí thành công', 'Welcome to E-Learning Website!')
        }

        const accessToken = createAccessToken(user)
        const refreshToken = createRefreshToken(user)

        await refreshTokenModel.create({ userId: user._id, refreshToken })
        sendRefreshToken(res, refreshToken)

        res.status(200).json({ message: 'Đăng nhập thành công!', user, accessToken })
    } catch (error) {
        res.status(500).json({ message: 'Đăng nhập thất bại! Vui lòng thử lại sau.', error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        })
        await refreshTokenModel.deleteOne({ refreshToken: req.cookies.refreshToken })
        res.status(200).json({ message: 'Đăng xuất thành công!' })
    } catch (error) {
        res.status(500).json({ message: 'Đăng xuất thất bại! Vui lòng thử lại sau.', error: error.message })
    }
}

export const register = async (req, res) => {
    const role = await roleModel.findOne({ roleName: 'User' })
    if (!role) {
        return res.status(400).json({
            message: 'Role not found',
        })
    }

    const user = req.body
    const { isValid, message } = registerValidation(user)
    if (!isValid) {
        return res.status(400).json({ message })
    }

    const isUserNameExist = await userModel.findOne({ userName: user.userName })
    const isEmailExist = await userModel.findOne({ email: user.email })

    if (isUserNameExist) return res.status(400).json({ message: 'Tên người dùng đã tồn tại' })
    if (isEmailExist) return res.status(400).json({ message: 'Email đã tồn tại' })

    try {
        const hashedPassword = await bcrypt.hash(user.passWord, 10)
        const newUser = new userModel({ ...user, passWord: hashedPassword, roleId: role._id })
        await newUser.save()

        const accessToken = createAccessToken(newUser)
        const refreshToken = createRefreshToken(newUser)

        await refreshTokenModel.create({ userId: newUser._id, refreshToken })
        sendRefreshToken(res, refreshToken)

        await sendEmail(newUser.email, 'Đăng kí thành công!', 'Welcome to E-Learning Website!')
        res.status(201).json({ message: 'Đăng kí thành công!', data: newUser, accessToken })
    } catch (error) {
        res.status(500).json({ message: 'Đăng kí thất bại', error: error.message })
    }
}

export const changePassWord = async (req, res) => {
    try {
        const { userId, currentPassWord, newPassWord, confirmPassWord } = req.body

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy tài khoản' })
        }

        const isMatch = await bcrypt.compare(currentPassWord, user.passWord)
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai mật khẩu!' })
        }

        const { isValid, message } = changePassWordValidation({
            currentPassWord,
            newPassWord,
            confirmPassWord,
        })
        if (!isValid) {
            return res.status(400).json({ message })
        }

        const hashedPassword = await bcrypt.hash(newPassWord, 10)
        user.passWord = hashedPassword
        await user.save()

        res.status(200).json({ message: 'Đổi mật khẩu thành công!' })
    } catch (error) {
        res.status(500).json({ message: 'Đổi mật khẩu thất bại!', error: error.message })
    }
}

export const forgotPassWord = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message: 'Email không được bỏ trống' })
    }

    try {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy tài khoản' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false

        await user.save()
        await sendEmail(
            user.email,
            'Password reset OTP',
            `Your OTP is ${otp}. Using this OTP to reset your password. This OTP will expire in 5 minutes.`,
        )

        res.status(200).json({ message: 'OTP đã được gửi tới email của bạn' })
    } catch (error) {
        res.status(500).json({ message: 'Thất bại!', error: error.message })
    }
}

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' })
    }

    try {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy tài khoản' })
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ message: 'OTP không hợp lệ' })
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ message: 'OTP đã hết hạn' })
        }

        user.isOtpVerified = true
        user.resetOtp = ''
        user.resetOtpExpireAt = 0
        await user.save()

        const resetToken = jwt.sign({ email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
        res.cookie('resetToken', resetToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 5 * 60 * 1000,
        })

        return res.status(200).json({ message: 'Xác thực OTP thành công!' })
    } catch (error) {
        res.status(500).json({ message: 'Xác thực OTP thất bại', error: error.message })
    }
}

export const resetPassWord = async (req, res) => {
    const { newPassWord, confirmPassWord } = req.body
    const resetToken = req.cookies.resetToken
    if (!resetToken) {
        return res.status(400).json({ message: 'Reset token is required' })
    }

    if (!newPassWord || !confirmPassWord) {
        return res.status(400).json({ message: 'Mật khẩu mới và xác nhận mật khẩu không được bỏ trống!' })
    }

    try {
        const decoded = jwt.verify(resetToken, env.ACCESS_TOKEN_SECRET)
        const email = decoded.email

        const user = await userModel.findOne({ email: email, isOtpVerified: true })
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy tài khoản hoặc OTP chưa được xác thực!' })
        }

        if (newPassWord === '' || confirmPassWord === '') {
            return res.status(400).json({ message: 'Mật khẩu mới và xác nhận mật khẩu không được bỏ trống!' })
        }

        if (newPassWord !== confirmPassWord) {
            return res.status(400).json({ message: 'Mật khẩu mới không khớp!' })
        }

        const hashedPassword = await bcrypt.hash(newPassWord, 10)
        user.passWord = hashedPassword
        user.isOtpVerified = false

        await user.save()

        res.clearCookie('resetToken', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        })

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công!' })
    } catch (error) {
        res.status(500).json({ message: 'Đặt lại mật khẩu thất bại', error: error.message })
    }
}
