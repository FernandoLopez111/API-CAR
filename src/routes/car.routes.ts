import { Router } from "express";
import CarsController from "../controllers/car.controller";


const router = Router()
const car = CarsController

router.get('/', car.listCars)
router.post('/', car.createCar)
router.get('/:id', car.byIdCar)
router.put('/:id', car.updateCar)
router.delete('/:id', car.deleteCar)


export default router
