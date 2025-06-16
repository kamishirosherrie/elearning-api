import { postModel } from '~/models/postModel'

export const getTotalLikeByPostId = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id)
        res.status(200).json({ message: 'Get total likes successfully', totalLike: post.likes.length })
    } catch (error) {
        res.status(500).json({ message: 'Get total likes failed', error: error.message })
    }
}

export const toggleLike = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id)
        const { userId } = req.user

        if (!post) {
            return res.status(400).json({
                message: 'Post not found',
            })
        }

        if (post.likes.includes(userId)) {
            post.likes.pull(userId)
        } else {
            post.likes.push(userId)
        }

        await post.save()
        return res.status(200).json({ message: 'Toggle like successfully', totalLike: post.likes.length })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await postModel.aggregate([
            {
                $lookup: {
                    from: 'Comments',
                    localField: 'id',
                    foreignField: 'postId',
                    as: 'comments',
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: { path: '$author', preserveNullAndEmptyArrays: true },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    comments: 1,
                    likes: 1,
                    authorName: '$author.fullName',
                },
            },
        ])

        console.log('posts:', posts)

        return res.status(200).json({ message: 'Get all post successfully', posts })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id)
        if (!post) {
            return res.status(400).json({
                message: 'Post not found',
            })
        }
        return res.status(200).json({ message: 'Get post successfully', post })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body
        const { userId } = req.user
        const newPost = new postModel({ title, content, authorId: userId })
        await newPost.save()
        return res.status(200).json({ message: 'Create post successfully', post: newPost })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { userId } = req.user
        const post = await postModel.findById(req.params.id)
        if (!post) {
            return res.status(400).json({
                message: 'Post not found',
            })
        }

        if (!post.authorId.equals(userId)) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }

        const { title, content } = req.body
        post.title = title
        post.content = content
        await post.save()
        return res.status(200).json({ message: 'Update post successfully', post })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { userId } = req.user
        const post = await postModel.findById(req.params.id)
        if (!post) {
            return res.status(400).json({
                message: 'Post not found',
            })
        }

        if (!post.authorId.equals(userId)) {
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }
        await post.deleteOne()
        return res.status(200).json({ message: 'Delete post successfully' })
    } catch (error) {
        console.error('Internal Server Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
