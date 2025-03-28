import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const lessonSchema = new mongoose.Schema(
    {
        chapterTitle: { type: String, required: true },
        lesson: [
            {
                title: { type: String, required: true },
                videoUrl: { type: String, required: false },
                content: { type: String, required: true, default: '' },
                slug: { type: String, required: false, slug: 'title', unique: true, forceIdSlug: false },
            },
        ],
        order: { type: Number, required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Courses' },
        userId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Users' },
    },
    {
        timestamps: true,
    },
)

export const lessonModel = mongoose.model('Lessons', lessonSchema, 'Lessons')
