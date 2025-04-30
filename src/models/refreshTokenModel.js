import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
        refreshToken: { type: String, required: true },
    },
    {
        timestamps: true,
    },
)

export const refreshTokenModel = mongoose.model('RefreshTokens', refreshTokenSchema, 'RefreshTokens')
