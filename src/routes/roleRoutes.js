import express from 'express'
import { getRoles } from '~/controllers/roleController'

const roleRouter = express.Router()

roleRouter.get('/', getRoles)

export { roleRouter }
