import express from 'express'
import {
    createPost,
    deletePost,
    getAllPost,
    getPostById,
    getTotalLikeByPostId,
    toggleLike,
    updatePost,
} from '~/controllers/postController'
import { authenticateToken } from '~/middlewares/authenticateToken'

const postRouter = express.Router()

postRouter.get('/', getAllPost)
postRouter.get('/:id', getPostById)
postRouter.get('/totalLike/:id', getTotalLikeByPostId)
postRouter.post('/toggleLike/:id', authenticateToken, toggleLike)
postRouter.post('/create', authenticateToken, createPost)
postRouter.put('/update/:id', authenticateToken, updatePost)
postRouter.delete('/delete/:id', authenticateToken, deletePost)

export { postRouter }
