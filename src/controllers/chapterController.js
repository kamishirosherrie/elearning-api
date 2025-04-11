import { chapterModel } from '~/models/chapterModel'
import { courseModel } from '~/models/courseModel'
import { lessonModel } from '~/models/lessonModel'

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
        const chapter = await chapterModel.findById(req.params.id).populate('courseId')
        res.status(200).json({
            message: 'Get chapter by ID successfully',
            chapter,
        })
    } catch (error) {
        res.status(500).json({ message: 'Get chapter by ID failed', error: error.message })
    }
}

export const getChapterByCourseId = async (req, res) => {
    try {
        const chapters = await chapterModel.find({ courseId: req.params.id })
        if (!chapters) {
            return res.status(400).json({
                message: 'Chapters not found',
            })
        }
        res.status(200).json({
            message: 'Get chapters by course ID successfully',
            chapters,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Get chapters by course ID failed',
            error: error.message,
        })
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

export const updateChapter = async (req, res) => {
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

        const isChapterExist = await chapterModel.findOne({
            courseId: chapter.courseId,
            order: chapter.order,
            title: chapter.title,
        })

        if (isChapterExist) {
            return res.status(400).json({
                message: 'Chapter already exists',
            })
        }

        await chapterModel.findByIdAndUpdate(req.body._id, chapter)

        res.status(200).json({
            message: 'Update chapter successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Update chapter failed',
            error: error.message,
        })
    }
}

export const deleteChapter = async (req, res) => {
    try {
        const chapter = await chapterModel.findById(req.params.id)
        if (!chapter) {
            return res.status(400).json({
                message: 'Chapter not found',
            })
        }

        await lessonModel.findByIdAndDelete({ chapterId: chapter._id })
        await chapterModel.findByIdAndDelete(chapter._id)

        res.status(200).json({
            message: 'Delete chapter successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Delete chapter failed',
            error: error.message,
        })
    }
}
