import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
    {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
    },
)

export const commentModel = mongoose.model('Comments', commentSchema, 'Comments')
