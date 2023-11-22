import dotenv from 'dotenv'
import { Router } from 'express'
import routerCar from './car.routes'
import routerClient from './client.routes'
import routerUser from './user.routes'
import routerRol from './rol.routes'
import routerBrand from './brand.routes'
import routerModel from './model.routes'
import routerCarWash from './carwash.routes'
import routerAuth from './auth.routes'

dotenv.config()

const URL = process.env.URL || 'api/v1'

const routes = Router()
//rutas
routes.use(`${URL}/car`, routerCar)
routes.use(`${URL}/carwash`, routerCarWash)
routes.use(`${URL}/client`, routerClient)
routes.use(`${URL}/user`, routerUser)
routes.use(`${URL}/login`,  routerAuth)
routes.use(`${URL}/rol`, routerRol)
routes.use(`${URL}/model`, routerModel)
routes.use(`${URL}/brand`, routerBrand)

export default routes