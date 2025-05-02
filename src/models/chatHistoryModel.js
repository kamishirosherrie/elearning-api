import mongoose from 'mongoose'

const chatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },

    message: [
        {
            from: { type: String, enum: ['user', 'ai'], required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now, expires: 86400 },
})

export const chatHistoryModel = mongoose.model('ChatHistories', chatHistorySchema, 'ChatHistories')
