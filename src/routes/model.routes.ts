import {Router} from 'express'
import ModelController from '../controllers/model.controller'


const router = Router()
const model = ModelController

router.get('/', model.listModel)
router.post('/', model.createModel)
router.get('/:id', model.byIdModel)
router.put('/:id', model.updateModel)
router.delete('/:id', model.deleteModel)


export default router