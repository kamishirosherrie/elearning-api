import mongoose from 'mongoose'

const courseEnrollmentSchema = new mongoose.Schema(
    {
        enrolledAt: { type: Date, required: true, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
        courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Courses' },
    },
    {
        timestamps: true,
    },
)

export const courseEnrollmentModel = mongoose.model('CourseEnrollments', courseEnrollmentSchema, 'CourseEnrollments')
