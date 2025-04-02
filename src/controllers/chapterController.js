import { chapterModel } from '~/models/chapterModel'
import { courseModel } from '~/models/courseModel'

export const getChapters = async (req, res) => {
    try {
        const chapters = await chapterModel.find().populate('courseId')
        res.status(200).json({
            message: 'Get chapters successfully',
            chapters,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get chapters failed',
            error: error.message,
        })
    }
}

export const getChapterById = async (req, res) => {
    try {
        const chapter = await chapterModel.findById(req.params.id).populated('courseId')
        res.status(200).json({
            message: 'Get chapter by ID successfully',
            chapter,
        })
    } catch (error) {
        res.status(500).json({ message: 'Get chapter by ID failed', error: error.message })
    }
}

export const addNewChapter = async (req, res) => {
    try {
        const chapter = req.body
        if (!chapter.title || !chapter.courseId) {
            return res.status(400).json({
                message: 'Chapter fields are required',
            })
        }

        const course = await courseModel.findById(chapter.courseId)
        if (!course) {
            return res.status(400).json({
                message: 'Course not found',
            })
        }
        const chapterOrder = await chapterModel.find({ courseId: chapter.courseId }).countDocuments()

        const newChapter = new chapterModel({ ...chapter, order: chapterOrder + 1 })

        const isChapterExist = await chapterModel.findOne({
            courseId: newChapter.courseId,
            order: newChapter.order,
            title: newChapter.title,
        })

        if (isChapterExist) {
            return res.status(400).json({
                message: 'Chapter already exists',
            })
        }

        await newChapter.save()

        res.status(200).json({
            message: 'Add chapter successfully',
            newChapter,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Add chapter failed',
            error: error.message,
        })
    }
}
