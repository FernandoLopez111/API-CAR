import {Router} from 'express'
import BrandController from '../controllers/brand.controller'

const router = Router() 
const brand = BrandController

router.get('/', brand.listBrand)
router.post('/', brand.createBrand)
router.get('/:id', brand.byIdBrand)
router.put('/:id', brand.updateBrand)
router.delete('/:id', brand.deleteBrand)


export default router