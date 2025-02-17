import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema(
    {
        roleName: { type: String, required: true },
    },
    {
        timestamps: true,
    },
)

export const roleModel = mongoose.model('Roles', roleSchema, 'Roles')
