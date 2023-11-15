import { CarWash } from '../models/CarWash'
import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import {Car} from '../models/Car'
import { getConnection, SelectQueryBuilder } from 'typeorm';

class CarwashController{

static listCarWashs = async(req:Request, res:Response)=>{
const repoCarWash = AppDataSource.getRepository(CarWash)
try {
    const carwash = await repoCarWash.find({
        where:{state:true},
    })
    return carwash.length > 0
    ?res.json({
        ok:true,
        message:"List of Carwash",
        carwash
    })
    :res.json({ok:false, message:"Data not found ", carwash})
    
} catch (error) {
    return res.json({
        ok:false,
        message:`ERROR ${error}`
    })
}
}


static createCarwash = async (req: Request, res:Response) =>{
    const{carId,service,price} = req.body
    const repoCarWash = AppDataSource.getRepository(CarWash)
const carRepository = AppDataSource.getRepository(Car)

try {
    
    

    if(!carId){
        return res.json({
           ok:false,
           message:'carId  is required in the request body' 
        })
}

const existingCar = await carRepository.findOne({where:{id:carId}});
    if (!existingCar){
        return res.json({
            ok:false,
            message:`Car with Id ${carId} does not exist`
        })
    }
    
    
        const carwash = new CarWash()
        carwash.car = carId
        carwash.service = service
        carwash.price = price

        await repoCarWash.save(carwash)
        
        return res.json({
            ok:true,
            STATUS_CODES: 200,
            message: "CarWash was created"
        })
        
    } 
    
    catch (error) {
        return res.json({
            ok:false,
            STATUS_CODES: 500,
            message: `error = ${error.message}`
        })
    }

}

static updateCarwash =async(req:Request, res:Response)=>{
    const id = parseInt(req.params.id)
    const {carId,service,price} = req.body
    const repoCarWash = AppDataSource.getRepository(CarWash)

    let carWashs : CarWash
    try {
        carWashs = await repoCarWash.findOne({where:{id, state:true}})

        if(!carWashs){
            throw new Error("CarWash dont exist in database");

        }

        if(carId){
            carWashs.carId = carId
        }
        // if(service){
        //     carWashs.service=service
        // }
        // if(price){
        //     carWashs.price = price
        // }

        // carWashs.carId = carId
        // carWashs.service = service
        carWashs.price = price
        await repoCarWash.save(carWashs)
        return res.json({
            ok:true,
            STATUS_CODE: 200,
            message:`Carwash was update`
        })
    } catch (error) {
        return res.json({
            ok:true,
            STATUS_CODE: 500,
            message: `error = ${error.message}`
        })
        
    }
}

static byIdCarWash = async (req:Request, res:Response)=>{
    const id =parseInt(req.params.id)
    const repoCarWash = AppDataSource.getRepository(CarWash)
   try {
    const  carWashs = await repoCarWash.findOne({
        where:{id,state:true}
    })
    return carWashs
    ?res.json({ok:true, carWashs, message:"Succes"})
    :res.json
    ({    ok:false, message:"the Id dont exist"})
    
   } catch (error) {
    return res.json({
        ok:false,
        message:`ERROR ==> ${error}`,
    })
    
   }
}


static deleteCarWash = async (req:Request, res:Response)=>{
    const id = parseInt(req.params.id)
    const repoCarWash = AppDataSource.getRepository(CarWash)
    try{
        const carwashs = await repoCarWash.findOne({where:{id, state:true},})
        if(!carwashs){
            throw new Error("Car dont exist in datbase")
        }
        carwashs.state = false
        await repoCarWash.save(carwashs)
        return res.json({ok:true, message:"Carwash was delete"})
    }catch(error){
        return res.json({
            ok:false,
            message:`ERROR ==> ${error}`
        })
    }
}

static lisQuery = async (req:Request, res:Response)=>{
    const {carId,service,price} = req.query
    const repoCarWash = AppDataSource.getRepository(CarWash)
   try {
    
    const carwashs = await repoCarWash.createQueryBuilder("carwashs")
    .where("car.owner like :owner OR car.brand like :brand", {carId: `%${carId}%`, service:`%${service}%`, price: `%${price}%`})    
    .getOne()
    return carwashs
    ? res.json({
        ok:true,
        message:"CarId and Service and price is ",
        carwashs
    })
    :res.json({ok:false, message:"Data not found" ,carwashs})
   } catch (error) {
    return res.json({
        ok:false,
        message:`ERROR ==> ${error}`
    })
    
   }

}

// static servicesList = async(req:Request, res:Response)=>{
// const repoCarWash = AppDataSource.getRepository(CarWash) 
// try {
//     const result = await repoCarWash
//     .createQueryBuilder('carWash')
//     .select(['carWash.carId','MAX(car.owner) AS owner','COUNT(carWash.id) AS serviceCount'])
//     .innerJoin  ('carWash.car','car')  
//     .groupBy('carWash.carId')
//     .orderBy('serviceCount','DESC')
//     .limit(1)
//     .getRawOne();

//     if(!result){
//         return res.json({
//             ok:false,
//             message: 'No customers found'
//         })
//     }
//     const {owner, serviceCount} = result
//     return res.json({
//         ok:true,
//         message:'Customer with the most services found',
//         customerOwner: owner ,
//         serviceCount
//     })

// } catch (error) {
//     return res.json({
//         ok:false,
//         STATUS_CODES:500,
//         message: `error = ${error.message}`,
//     })
    
//}






//}
static servicesList = async(req:Request, res:Response)=>{
    const repoCarWash = AppDataSource.getRepository(CarWash)
    try {
        const maxResult = await repoCarWash
                .createQueryBuilder('carWash')
                //aqui hace una seleccion sobre nuestra tabla principal que es carWash y selecciona solo el valor de la tabla que se desea en este seria el carId lo que hace que su valor de la relacion que sea obtener  es el owner
                .select(['carWash.carId', 'MAX(car.owner) AS owner', 'COUNT(carWash.id) AS serviceCount'])
                //innerJoin este metodo indica que va hacer una union entre las tablas de fornma interna
                .innerJoin('carWash.car', 'car')
                //en .groupBy especifica la columna de la cual estamos agrupando en este ejmplo seria la columna de carId de la tabla carWash
                .groupBy('carWash.carId')
                //.orderBy se hace uso para ordenar los resultados de la consulta SQL y el termino'DESC' se refiere de manera descendente  
                .orderBy('serviceCount', 'DESC')
                // es el limite que proporciona para ver los resultados ejemplo si le colocamos 5 
                .limit(1)

                .getRawOne()

                const minResult = await repoCarWash
                .createQueryBuilder('carWash')
                .select(['carWash.carId', 'MIN(car.owner) AS owner', 'COUNT(carWash.id) AS serviceCount'])
                .innerJoin('carWash.car', 'car')
                .groupBy('carWash.carId')
                .orderBy('serviceCount', 'ASC') // Ordenar en orden ascendente para obtener el mínimo
                .limit(2)
                .getRawMany()

                if (!maxResult || !minResult || minResult.length === 0) {
                    return res.json({
                        ok: false,
                        message: 'No customers found',
                    });
                }

                const{owner:MaxOwner, serviceCount:maxServiceCount} = maxResult
                const minData = minResult.map((minResult)=>({
                    owner: minResult.owner,
                    serviceCount: minResult.serviceCount
                }))
                return res.json({
                    ok: true,
                    message: 'Customer with the most and least services found',
                    maxCustomerOwner: MaxOwner,
                    maxServiceCount,
                    minCustomerData: minData
                });
    } catch (error) {
        return res.json({
            ok:false,
            STATUS_CODE:500,
            message: `  = ${error.message}`
        })
        
    }

}


}






export default CarwashController
