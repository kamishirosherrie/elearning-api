import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, default: '' },
        userName: { type: String, required: true },
        passWord: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: false },
        avatar: { type: String, required: false },
        country: { type: String, required: false },
        city: { type: String, required: false },
        district: { type: String, required: false },
        ward: { type: String, required: false },
        roleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Roles' },
    },
    {
        timestamps: true,
    },
)

export const userModel = mongoose.model('Users', userSchema, 'Users')
