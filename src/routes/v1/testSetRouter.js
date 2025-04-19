import express from 'express'
import { getAllTestSet } from '~/controllers/testSetController'

const testSetRouter = express.Router()

testSetRouter.get('/', getAllTestSet)

export { testSetRouter }
