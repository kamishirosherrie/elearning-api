import express from 'express'
import {
    getGlobalRanking,
    getSubmissionById,
    getSubmissions,
    getSubmissionsByUserId,
    submitQuiz,
    submitWriting,
} from '~/controllers/submissionController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const submissionRoutes = express.Router()

submissionRoutes.post('/submit', authenticateToken, submitQuiz)
submissionRoutes.post('/submit/writing', authenticateToken, submitWriting)

submissionRoutes.get('/getSubmission', authenticateToken, getSubmissions)
submissionRoutes.get('/getSubmission/:id', authenticateToken, getSubmissionById)
submissionRoutes.get('/getSubmissions/:userId', authenticateToken, getSubmissionsByUserId)
submissionRoutes.get('/ranking', getGlobalRanking)

export { submissionRoutes }
