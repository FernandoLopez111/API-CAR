import { Router } from "express";
import CarsController from "../controllers/car.controller";
import { ValidateToken } from "../jwt/tokenvalido";
const router = Router()
const car = CarsController

router.get('/', ValidateToken, car.listCars)
router.post('/', ValidateToken,car.createCar)
router.get('/:id',ValidateToken, car.byIdCar)
router.put('/:id',ValidateToken, car.updateCar)
router.delete('/:id',ValidateToken, car.deleteCar)

export default router
