import { commentModel } from '~/models/commentModel'

export const getCommentByPost = async (req, res) => {
    try {
        const comments = await commentModel.find({ postId: req.params.postId }).populate('userId')
        res.status(200).json({ message: 'Get comments successfully', comments })
    } catch (error) {
        res.status(500).json({ message: 'Get comments failed', error: error.message })
    }
}

export const createComment = async (req, res) => {
    try {
        const { userId } = req.user
        const { postId, content } = req.body
        if (!postId || !content || content.trim() === '') {
            return res.status(400).json({ message: 'Invalid data' })
        }
        if (!userId) {
            return res.status(401).json({ message: 'Bạn cần đăng nhập để có thể bình luận' })
        }
        const comment = await commentModel.create({ userId, postId, content })
        await comment.save()
        return res.status(200).json({ message: 'Create comment successfully', comment })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const editComment = async (req, res) => {
    try {
        const { userId } = req.user
        const comment = await commentModel.findById(req.params.id)
        if (!comment) {
            return res.status(400).json({ message: 'Comment not found' })
        }
        if (!comment.userId.toString().equals(userId)) {
            return res.status(401).json({ message: 'Bạn cần đăng nhập để có thể bình luận' })
        }
        const { content } = req.body
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Invalid data' })
        }
        comment.content = content
        await comment.save()
        return res.status(200).json({ message: 'Edit comment successfully', comment })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { userId } = req.user
        const comment = await commentModel.findById(req.params.id)
        if (!comment) {
            return res.status(400).json({ message: 'Comment not found' })
        }
        if (!comment.userId.toString().equals(userId)) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        await comment.deleteOne()
        return res.status(200).json({ message: 'Delete comment successfully' })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
