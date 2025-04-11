import express from 'express'
import { getSubmissions, getSubmissionsByUserId, submitQuiz } from '~/controllers/submissionController'

const submissionRoutes = express.Router()

submissionRoutes.post('/submit', submitQuiz)
submissionRoutes.get('/getSubmission', getSubmissions)
submissionRoutes.get('/getSubmission/:id', getSubmissionsByUserId)

export { submissionRoutes }
