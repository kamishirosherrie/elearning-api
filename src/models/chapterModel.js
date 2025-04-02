import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        order: { type: Number, required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Courses' },
    },
    {
        timestamps: true,
    },
)

export const chapterModel = mongoose.model('Chapters', chapterSchema, 'Chapters')
