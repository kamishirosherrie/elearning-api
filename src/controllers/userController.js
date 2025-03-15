import { userModel } from '~/models/userModel'

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find().populate('roleId', 'roleName')
        res.status(200).json({ message: 'Get user successfully', users })
    } catch (error) {
        res.status(500).json({ message: 'Get user failed', error: error.message })
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const user = await userModel.findOne({ userName: req.params.userName })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'Get user by userName successfully', user })
    } catch (error) {
        res.status(500).json({ message: 'Get user by userName failed', error: error.message })
    }
}

export const updateUserInfo = async (req, res) => {}

export const changePassword = async (req, res) => {}
