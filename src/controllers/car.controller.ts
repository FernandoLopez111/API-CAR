import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Car } from "../models/Car";
import { Like } from "typeorm";
import { Model } from "../models/Model";
import { Brand } from "../models/Brand";

class CarsController {
  static listCars = async (req: Request, res: Response) => {
    const name = req.query.name || "";
    const brand = req.query.brand || "";
    const model = req.query.model || "";

    const repoCar = AppDataSource.getRepository(Car);
    try {
      const car = await repoCar.find({
        where: {
          state: true,
          name: Like(`%${name}%`),
          brand: { type: Like(`%${brand}%`) },
          model: { typemodel: Like(`%${model}%`) },
        },
        relations: { brand: true, model: true },
      });
      return car.length > 0
        ? res.json({
            ok: true,
            msg: "LIST OF CARS",
            car,
          })
        : res.json({ ok: false, msg: "DATA NOT FOUND", car });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  //metodo de obtener todos
  //  static listCars = async(req: Request, res: Response)=>{
  //    const color = req.query.color || ""
  //     const serialnumber = req.query.serialnumber || ""
  //         const repoCars = AppDataSource.getRepository(Car);
  //         try {
  //             const car = await repoCars.find({
  //                 where:{state:true,
  //                 color: Like(`%${color}%`),
  //                 serialnumber: Like(`%${serialnumber}%`)
  //                 },
  //             });
  //             return car.length>0
  //             ? res.json({
  //                 ok: true,
  //                 msg: "LIST OF CARS",
  //                 car
  //             })
  //             : res.json({ok:false, msg:"DATA NOT FOUND", car});
  //         } catch (error) {
  //             return res.json({
  //                 ok:false,
  //                 msg: `ERROR ==> ${error}`,
  //             });
  //         }

  //     }

  //crear carro
  static createCar = async (req: Request, res: Response) => {
    const { brandId, modelId, name, serialnumber } = req.body;
    const repoCar = AppDataSource.getRepository(Car);
    const repoModel = AppDataSource.getRepository(Model);
    const repoBrand = AppDataSource.getRepository(Brand);

    try {
      if (!modelId || !brandId) {
        return res.json({
          ok: false,
          message: "modelId and brandId is required in the request body",
        });
      }

      const exisitingModel = await repoModel.findOne({
        where: { id: modelId },
      });
      const existingBrand = await repoBrand.findOne({ where: { id: brandId } });
      if (!exisitingModel || !existingBrand) {
        return res.json({
          ok: false,
          message: `Model and Brand ${modelId} ${brandId} does not exist`,
        });
      }

      const car = new Car();
      car.brand = brandId;
      car.model = modelId;
      car.name = name;
      car.serialnumber = serialnumber;
      await repoCar.save(car);
      return res.json({
        ok: true,
        STATUS_CODES: 200,
        message: "Car was created",
        // brandType:existingBrand.type,
        // modeltype:exisitingModel.typemodel
      });
    } catch (error) {
      return res.json({
        ok: false,
        STATUS_CODES: 500,
        message: `ERROR  ===> ${error}`,
      });
    }
  };

  // modificar carro
  static updateCar = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { modelId, brandId, name, serialnumber } = req.body;
    const repoCar = AppDataSource.getRepository(Car);
    let car: Car;

    try {
      car = await repoCar.findOne({ where: { id, state: true } });
      if (!car) {
        throw new Error("Car dont exist in database");
      }

      if (modelId || brandId) {
        car.model = modelId;
        car.brand = brandId;
      }

      car.model = modelId;
      car.brand = brandId;
      car.name = name;
      car.serialnumber = serialnumber;
      await repoCar.save(car);
      return res.json({
        ok: true,
        STATUS_CODE: 200,
        message: `Car was update`,
      });
    } catch (error) {
      return res.json({
        ok: false,
        STATUS_CODES: 500,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  // buscar carro por id
  static byIdCar = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoCar = AppDataSource.getRepository(Car);
    try {
      const car = await repoCar.findOne({
        where: { id, state: true },
        relations: ["brand", "model"],
      });
      return car
        ? res.json({
            ok: true,
            car: {
              brand: car.brand?.type,
              model: car.model?.typemodel,
              color: car.name,
              serialnumber: car.serialnumber,
            },
            message: "SUCCES",
          })
        : res.json({
            ok: false,
            message: "the Id not exist",
          });
    } catch (error) {
      return res.json({
        ok: false,
        message: `ERROR  ==> ${error}`,
      });
    }
  };

  // deshabilitar carro
  static deleteCar = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoCar = AppDataSource.getRepository(Car);

    try {
      const car = await repoCar.findOne({
        where: { id, state: true },
      });
      if (!car) {
        throw new Error("CAR DONT EXIST IN DATABASE");
      }
      car.state = false;
      await repoCar.save(car);
      return res.json({ ok: true, msg: "CAR WAS DELETE" });
    } catch (error) {
      return res.json({
        ok: false,
        msg: `ERROR==> ${error}`,
      });
    }
  };

  // static listQuery = async(req: Request, res: Response)=>{
  //     const {modelId, brandId, color,serialnumber} = req.query;
  //     const repoCar =AppDataSource.getRepository(Car);
  //    try {
  //     const car = await repoCar.createQueryBuilder("car")
  //     .where("car.typemodel like :typemodel OR car.type like :type OR car.color like :color OR car.serialnumber like:serialnumber", {modelId: `%${modelId}%`, brandId: `%${brandId}%`, color: `%${color}%`,serialnumber: `%${serialnumber}%`})
  //     .getOne()
  //     return car
  //     ? res.json({
  //         ok: true,
  //         msg: "modelId, brandId, color, serialnumber is  ",
  //         car
  //     })
  //     : res.json({ok:false, msg:"DATA NOT FOUND", car});
  // } catch (error) {
  //     return res.json({
  //         ok:false,
  //         msg: `ERROR ==> ${error}`,
  //     });
  // }
  // }
}

export default CarsController;
