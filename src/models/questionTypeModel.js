import mongoose from 'mongoose'

const questionTypeSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
    },
    {
        timestamps: true,
    },
)

export const questionTypeModel = mongoose.model('QuestionTypes', questionTypeSchema, 'QuestionTypes')
