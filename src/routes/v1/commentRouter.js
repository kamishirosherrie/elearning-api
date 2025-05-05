import express from 'express'
import { createComment, deleteComment, editComment, getCommentByPost } from '~/controllers/commentController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const commentRouter = express.Router()

commentRouter.get('/:postId', getCommentByPost)
commentRouter.post('/create', authenticateToken, createComment)
commentRouter.put('/update/:id', authenticateToken, editComment)
commentRouter.delete('/delete/:id', authenticateToken, deleteComment)

export { commentRouter }
