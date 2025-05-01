import mongoose from 'mongoose'

const chatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },

    message: [
        {
            role: { type: String, enum: ['user', 'ai'], required: true },
            content: { type: String },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now, expires: 86400 },
})

export const chatHistoryModel = mongoose.model('ChatHistories', chatHistorySchema, 'ChatHistories')
