import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
        likes: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' }],
    },
    {
        timestamps: true,
    },
)

export const postModel = mongoose.model('Posts', postSchema, 'Posts')
