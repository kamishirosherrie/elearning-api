import express from 'express'
import {
    getAnswersByUserId,
    getSubmissionById,
    getSubmissions,
    getSubmissionsByUserId,
    submitQuiz,
} from '~/controllers/submissionController'

const submissionRoutes = express.Router()

submissionRoutes.post('/submit', submitQuiz)
submissionRoutes.get('/getSubmission', getSubmissions)
submissionRoutes.get('/getSubmission/:id', getSubmissionById)
submissionRoutes.get('/getSubmissions/:userId', getSubmissionsByUserId)

export { submissionRoutes }
