import {Router} from 'express'
import ModelController from '../controllers/model.controller'
import { ValidateToken } from '../jwt/tokenvalido'


const router = Router()
const model = ModelController

router.get('/', ValidateToken, model.listModel)
router.post('/',ValidateToken, model.createModel)
router.get('/:id',ValidateToken, model.byIdModel)
router.put('/:id',ValidateToken, model.updateModel)
router.delete('/:id',ValidateToken, model.deleteModel)


export default router