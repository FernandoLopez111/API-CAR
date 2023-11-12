import dotenv from 'dotenv'
import { Router } from 'express'
import routerCar from './car.routes'

dotenv.config()
const URL = process.env.URL || '/api/v1'

const routes = Router()
//rutas
routes.use(`${URL}/car`, routerCar)

export default routes