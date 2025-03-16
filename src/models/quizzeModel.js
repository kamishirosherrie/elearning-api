import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const quizzeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: false },
        time: { type: Number, required: true },
        slug: { type: String, slug: 'title', unique: true, forceIdSlug: false },
        lessonId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lessons' },
    },
    {
        timestamps: true,
    },
)

export const quizzeModel = mongoose.model('Quizzes', quizzeSchema, 'Quizzes')
