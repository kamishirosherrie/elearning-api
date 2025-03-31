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
        const token = jwt.sign({ userId: user._id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 60 * 60 * 1000,
        })

        res.status(200).json({ message: 'Login successfully', token, user })
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

        const token = jwt.sign({ userId: user._id, email: user.email }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 60 * 60 * 1000,
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
            sameSite: 'none',
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
        await sendEmail(newUser.email, 'Register successfully', 'Welcome to E-Learning Website!')
        res.status(201).json({ message: 'Register successfully', data: newUser })
    } catch (error) {
        res.status(500).json({ message: 'Register failed', error: error.message })
    }
}
