import express from 'express'
import {
    getSubmissionById,
    getSubmissions,
    getSubmissionsByUserId,
    submitQuiz,
    submitWriting,
} from '~/controllers/submissionController'

const submissionRoutes = express.Router()

submissionRoutes.post('/submit', submitQuiz)
submissionRoutes.post('/submit/writing', submitWriting)

submissionRoutes.get('/getSubmission', getSubmissions)
submissionRoutes.get('/getSubmission/:id', getSubmissionById)
submissionRoutes.get('/getSubmissions/:userId', getSubmissionsByUserId)

export { submissionRoutes }
