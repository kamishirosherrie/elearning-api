import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

import { roleModel } from '~/models/roleModel'
import { userModel } from '~/models/userModel'
import { sendEmail } from '~/services/mailService'

export const login = async (req, res) => {
    try {
        const { identifier, passWord } = req.body
        const user = await userModel.findOne({ $or: [{ userName: identifier }, { email: identifier }] })
        if (!user) {
            return res.status(400).json({ message: 'Login failed! User not found' })
        }
        const isMatch = await bcrypt.compare(passWord, user.passWord)
        if (!isMatch) {
            return res.status(400).json({ message: 'Login failed! Wrong password' })
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({ message: 'Login successfully', user })
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message })
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

            await sendEmail(newUser.email, 'Register successfully', 'Welcome to E-Learning Website!')
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({ message: 'Login successfully', token, user })
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
        })
        res.status(200).json({ message: 'Logout successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error: error.message })
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
    const isUserExist = await userModel.findOne({
        $or: [{ userName: user.userName }, { email: user.email }],
    })
    if (isUserExist) {
        return res.status(400).json({
            message: 'User already exists',
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(user.passWord, 10)
        const newUser = new userModel({ ...user, passWord: hashedPassword, roleId: role._id })
        await newUser.save()

        const token = jwt.sign({ userId: user._id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        await sendEmail(newUser.email, 'Register successfully', 'Welcome to E-Learning Website!')
        res.status(201).json({ message: 'Register successfully', data: newUser })
    } catch (error) {
        res.status(500).json({ message: 'Register failed', error: error.message })
    }
}

export const changePassWord = async (req, res) => {
    try {
        const { userId, currentPassWord, newPassWord, confirmPassWord } = req.body

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(currentPassWord, user.passWord)
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' })
        }
        if (newPassWord !== confirmPassWord) {
            return res.status(400).json({ message: 'New password and confirm password do not match' })
        }

        const hashedPassword = await bcrypt.hash(newPassWord, 10)
        user.passWord = hashedPassword
        await user.save()

        res.status(200).json({ message: 'Change password successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Change password failed', error: error.message })
    }
}

export const forgotPassWord = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message: 'Email is required' })
    }

    try {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
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

        res.status(200).json({ message: 'OTP sent to your email' })
    } catch (error) {
        res.status(500).json({ message: 'Forgot password failed', error: error.message })
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
            return res.status(400).json({ message: 'User not found' })
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' })
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' })
        }

        user.isOtpVerified = true
        user.resetOtp = ''
        user.resetOtpExpireAt = 0
        await user.save()

        const resetToken = jwt.sign({ email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
        res.cookie('resetToken', resetToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 5 * 60 * 1000,
        })

        return res.status(200).json({ message: 'OTP verified' })
    } catch (error) {
        res.status(500).json({ message: 'Verify OTP failed', error: error.message })
    }
}

export const resetPassWord = async (req, res) => {
    const { newPassWord, confirmPassWord } = req.body
    const resetToken = req.cookies.resetToken
    if (!resetToken) {
        return res.status(400).json({ message: 'Reset token is required' })
    }

    if (!newPassWord || !confirmPassWord) {
        return res.status(400).json({ message: 'Reset token, new password and confirm password are required' })
    }

    try {
        const decoded = jwt.verify(resetToken, env.ACCESS_TOKEN_SECRET)
        const email = decoded.email

        const user = await userModel.findOne({ email: email, isOtpVerified: true })
        if (!user) {
            return res.status(400).json({ message: 'User not found or OTP not verified' })
        }

        if (newPassWord === '' || confirmPassWord === '') {
            return res.status(400).json({ message: 'New password and confirm password are required' })
        }

        if (newPassWord !== confirmPassWord) {
            return res.status(400).json({ message: 'New password and confirm password do not match' })
        }

        const hashedPassword = await bcrypt.hash(newPassWord, 10)
        user.passWord = hashedPassword
        user.isOtpVerified = false

        await user.save()

        res.clearCookie('resetToken', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
        })

        res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Reset password failed', error: error.message })
    }
}
