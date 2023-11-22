import {Router} from 'express'
import AuthController from '../controllers/auth.controller'
const router = Router()
const authorize = AuthController
router.post('/sign', authorize.Login)
export default router