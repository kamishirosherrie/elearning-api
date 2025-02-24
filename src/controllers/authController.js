import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { roleModel } from '~/models/roleModel'
import { userModel } from '~/models/userModel'
import { sendEmail } from '~/services/mailService'

// [POST]
export const register = async (req, res) => {
    try {
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
        const hashedPassword = await bcrypt.hash(user.passWord, 10)
        const newUser = new userModel({ ...user, passWord: hashedPassword, roleId: role._id })
        await newUser.save()
        await sendEmail(newUser.email, 'Register successfully', 'Welcome to E-Learning Website!')
        res.status(201).json({ message: 'Register successfully', data: newUser })
    } catch (error) {
        res.status(500).json({ message: 'Register failed', error: error.message })
    }
}
