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

export const addUser = async (req, res) => {
    try {
        const user = req.body
        const isUserNameExist = await userModel.findOne({ userName: user.userName })
        const isEmailExist = await userModel.findOne({ email: user.email })
        const isPhoneNumberExist = await userModel.findOne({ phoneNumber: user.phoneNumber })

        switch (user) {
            case isUserNameExist:
                return res.status(400).json({ message: 'User name already exists' })
            case isEmailExist:
                return res.status(400).json({ message: 'Email already exists' })
            case isPhoneNumberExist:
                return res.status(400).json({ message: 'Phone number already exists' })
            default:
                break
        }

        const newUser = new userModel(user)
        await newUser.save()
        return res.status(201).json({ message: 'Add user successfully', user: newUser })
    } catch (error) {
        res.status(500).json({ message: 'Add user failed', error: error.message })
    }
}

export const updateUserInfo = async (req, res) => {}

export const changePassword = async (req, res) => {}
