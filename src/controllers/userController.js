import bcrypt from 'bcrypt'
import { courseEnrollmentModel } from '~/models/courseEnrollmentModel'
import { userModel } from '~/models/userModel'

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find().populate('roleId', 'roleName')
        res.status(200).json({ message: 'Get user successfully', users })
    } catch (error) {
        res.status(500).json({ message: 'Get user failed', error: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).populate('roleId', 'roleName')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'Get user by id successfully', user })
    } catch (error) {
        res.status(500).json({ message: 'Get user by id failed', error: error.message })
    }
}

export const getUserByUserName = async (req, res) => {
    try {
        const user = await userModel.findOne({ userName: req.params.userName }).populate('roleId', 'roleName')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'Get user by userName successfully', user })
    } catch (error) {
        res.status(500).json({ message: 'Get user by userName failed', error: error.message })
    }
}

export const getUserCourses = async (req, res) => {
    try {
        const user = await courseEnrollmentModel.find({ userId: req.params.userId }).populate('courseId')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: `Get user's courses successfully`, user })
    } catch (error) {
        res.status(500).json({ message: 'Get user courses failed', error: error.message })
    }
}

export const addUser = async (req, res) => {
    try {
        const user = req.body

        const isUserNameExist = await userModel.findOne({ userName: user.userName })

        const isEmailExist = await userModel.findOne({ email: user.email })

        const isPhoneNumberExist = await userModel.findOne({ phoneNumber: user.phoneNumber })

        if (isUserNameExist) return res.status(400).json({ message: 'User name already exists' })

        if (isEmailExist) return res.status(400).json({ message: 'Email already exists' })

        if (isPhoneNumberExist) return res.status(400).json({ message: 'Phone number already exists' })

        const hashedPassword = await bcrypt.hash(user.passWord, 10)

        const newUser = new userModel({ ...user, passWord: hashedPassword })
        await newUser.save()

        return res.status(201).json({ message: 'Add user successfully', user: newUser })
    } catch (error) {
        res.status(500).json({ message: 'Add user failed', error: error.message })
    }
}

export const updateUserInfo = async (req, res) => {
    try {
        const user = req.body

        const existingUser = await userModel.findById(user._id)
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isUserNameExist = await userModel.findOne({ userName: user.userName, _id: { $ne: user._id } })
        const isEmailExist = await userModel.findOne({ email: user.email, _id: { $ne: user._id } })

        if (isUserNameExist) return res.status(400).json({ message: 'User name already exists' })
        if (isEmailExist) return res.status(400).json({ message: 'Email already exists' })

        const hashedPassword = await bcrypt.hash(user.passWord, 10)
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { ...user, passWord: hashedPassword },
            { new: true, runValidators: true },
        )

        return res.status(200).json({ message: 'Update user successfully', user: updatedUser })
    } catch (error) {
        res.status(500).json({ message: 'Update user failed', error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findOneAndUpdate(
            { userName: req.params.userName },
            { isDisabled: true },
            {
                new: true,
            },
        )
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ message: 'Delete user successfully', user })
    } catch (error) {
        res.status(500).json({ message: 'Delete user failed', error: error.message })
    }
}
