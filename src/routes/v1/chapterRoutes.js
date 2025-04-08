import express from 'express'
import {
    addNewChapter,
    deleteChapter,
    getChapterByCourseId,
    getChapterById,
    getChapters,
    updateChapter,
} from '~/controllers/chapterController'

const chapterRouter = express.Router()

chapterRouter.get('/', getChapters)
chapterRouter.get('/:id', getChapterById)
chapterRouter.get('/course/:id', getChapterByCourseId)

chapterRouter.post('/addNewChapter', addNewChapter)
chapterRouter.put('/updateChapter', updateChapter)
chapterRouter.delete('/deleteChapter/:id', deleteChapter)

export { chapterRouter }
