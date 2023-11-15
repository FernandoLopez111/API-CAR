import {Router} from 'express'
import CarwashController from '../controllers/carwash.controller'

const router = Router()
const carwash = CarwashController

router.get('/serviceList', carwash.servicesList)
  router.get('/', carwash.listCarWashs)
router.patch('/', carwash.lisQuery)
router.post('/', carwash.createCarwash)
router.get('/:id', carwash.byIdCarWash )
router.put('/:id', carwash.updateCarwash)
router.delete('/:id', carwash.deleteCarWash)

export default router