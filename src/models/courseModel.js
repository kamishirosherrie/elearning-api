import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, unique: true, required: true },
        description: { type: String, required: false },
        slug: { type: String, slug: 'title', unique: true, forceIdSlug: false },
    },
    {
        timestamps: true,
    },
)

export const courseModel = mongoose.model('Courses', courseSchema, 'Courses')
