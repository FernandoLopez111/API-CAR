import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Car } from "../models/Car";
import { DataSource } from "typeorm";


class CarsController {
    //metodo de obtener todos
static listCars = async(req: Request, res: Response)=>{
        const repoCars = AppDataSource.getRepository(Car);
        try {
            const car = await repoCars.find({
                where:{state:true},
            });
            return car.length>0
            ? res.json({
                ok: true,
                msg: "LIST OF CARS",
                car
            })
            : res.json({ok:false, msg:"DATA NOT FOUND", car});
        } catch (error) {
            return res.json({
                ok:false,
                msg: `ERROR ==> ${error}`,
            });
        }
    };
//crear carro
static createCar = async(req:Request, res:Response)=>{
    const{owner,brand} = req.body;
    const repoCar = AppDataSource.getRepository(Car);
    try {
        const car = new Car();
        car.owner = owner;
        car.brand = brand;
        await repoCar.save(car);
        return res.json({
            ok: true,
            msg:"CAR WAS CREATE",
        })
    } catch (error) {
        return res.json({
            ok:false,
            msg:`ERROR==> ${error}`
        });
    }

};
// modificar carro
static updateCar = async(req:Request, res:Response)=>{
    const id = parseInt(req.params.id);
    const {owner, brand } = req.body;
    const repoCar = AppDataSource.getRepository(Car);
    let cars: Car;
    try {
        cars = await repoCar.findOne({
            where:{id,state:true}
        });
        if(!cars){
            throw new Error("CAR DONT EXIST IN DATABASE");
        }
        cars.owner = owner;
        cars.brand = brand;
        await repoCar.save(cars);
        return res.json({
            ok:true,
            msg:"CAR WAS UPDATE"
        });  
    } catch (error) {
       return res.json({
        ok:false,
        msg:`ERROR==> ${error}`
       });
    }
};
// buscar carro por id
static byIdCar = async(req:Request, res:Response)=>{
    const id = parseInt(req.params.id)
    const repoCar = AppDataSource.getRepository(Car);
    try {
        const car = await repoCar.findOne({
            where:{id,state:true},
        });
        return car
        ? res.json({ok:true, car, msg:"SUCCESS"})
        :res.json({ok:false, msg:"THE ID DONT EXIST"})
    } catch (error) {
        return res.json({
            ok:false,
            msg: `ERROR==> ${error}`,
        });
        
    }
};
// deshabilitar carro
static deleteCar = async(req:Request, res:Response)=>{
    const id = parseInt(req.params.id)
    const repoCar = AppDataSource.getRepository(Car);

    try {
        const car = await repoCar.findOne({
            where:{id,state:true},
        })
        if (!car) {
            throw new Error("CAR DONT EXIST IN DATABASE")
        }
        car.state = false;
        await repoCar.save(car)
        return res.json({ok:true, msg:"CAR WAS DELETE"})
    } catch (error) {
        return res.json({
            ok:false,
            msg:`ERROR==> ${error}`
        });
        
    }
};
static listQuery = async(req: Request, res: Response)=>{
    const {owner,brand} = req.query;
    const repoCar =AppDataSource.getRepository(Car);
   try {
    const car = await repoCar.createQueryBuilder("car")
    .where("car.owner = :owner OR car.brand = :brand ", {owner: owner, brand: brand, state:true})
    .getOne()
    return car
    ? res.json({
        ok: true,
        msg: "OWNER OR BRAND IS",
        car
    })
    : res.json({ok:false, msg:"DATA NOT FOUND", car});
} catch (error) {
    return res.json({
        ok:false,
        msg: `ERROR ==> ${error}`,
    });
}
};
}

export default CarsController