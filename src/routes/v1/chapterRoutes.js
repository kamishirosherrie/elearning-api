import express from 'express'
import { addNewChapter, getChapterById, getChapters } from '~/controllers/chapterController'

const chapterRouter = express.Router()

chapterRouter.get('/', getChapters)
chapterRouter.get('/:id', getChapterById)

chapterRouter.post('/addNewChapter', addNewChapter)

export { chapterRouter }
