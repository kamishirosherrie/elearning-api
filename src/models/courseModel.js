import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: false },
    },
    {
        timestamps: true,
    },
)

export const courseModel = mongoose.model('Courses', courseSchema, 'Courses')
