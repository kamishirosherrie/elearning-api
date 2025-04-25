import express from 'express'
import { getCourseProgress, markLessonCompleted } from '~/controllers/lessonProgressController'

const lessonProgressRouter = express.Router()

lessonProgressRouter.get('/', getCourseProgress)
lessonProgressRouter.put('/markLessonCompleted/:lessonId', markLessonCompleted)

export { lessonProgressRouter }
