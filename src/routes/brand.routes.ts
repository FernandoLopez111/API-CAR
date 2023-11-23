import { ValidateToken } from './../jwt/tokenvalido';
import {Router} from 'express'
import BrandController from '../controllers/brand.controller'

const router = Router() 
const brand = BrandController

router.get('/', ValidateToken, brand.listBrand)
router.post('/',ValidateToken, brand.createBrand)
router.get('/:id',ValidateToken, brand.byIdBrand)
router.put('/:id',ValidateToken, brand.updateBrand)
router.delete('/:id',ValidateToken, brand.deleteBrand)


export default router