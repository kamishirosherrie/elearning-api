import express from 'express'
import { getLessonProgress, markLessonCompleted } from '~/controllers/lessonProgressController'

const lessonProgressRouter = express.Router()

lessonProgressRouter.get('/', getLessonProgress)
lessonProgressRouter.put('/markLessonCompleted/:lessonId', markLessonCompleted)

export { lessonProgressRouter }
