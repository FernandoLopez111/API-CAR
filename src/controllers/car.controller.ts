import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Car } from "../models/Car";
import { Like } from "typeorm";
import { Model } from "../models/Model";
import { Brand } from "../models/Brand";

class CarsController {
  static listCars = async (req: Request, res: Response) => {
    const color = req.query.color || "";
    const brand = req.query.brand || "";
    const model = req.query.model || "";
    const serialNumber = req.query.serialNumber || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const repoCar = AppDataSource.getRepository(Car);

    console.log(req.query)
    try {
      const [cars, total] = await repoCar.findAndCount({
        where: {
          state: true,
          color: Like(`%${color}%`),
          serialnumber: Like(`%${serialNumber}%`),
          brand: {
            type: Like(`%${brand}%`)
          },
          model: {
            typemodel: Like(`%${model}%`)
          }
        },
        order: {serialnumber: "DESC"},
        relations: { brand: true, model: true },
        skip: (page - 1 ) * limit,
        take: limit,
      });

      if(cars.length > 0){
        let totalPage: number = Number(total) / limit;
        if(totalPage % 1 !== 0){
          totalPage = Math.trunc(totalPage) + 1;
        }

        let nextPage: number = page >= totalPage ? page : Number(page) + 1;
        let prevPage: number = page <= 1 ? page : page - 1;

        return res.json({
          ok: true,
          msg: "List of cars",
          cars,
          total,
          totalPage,
          currentPage: Number(page),
          nextPage,
          prevPage,
        });
      }} catch (error) {
      return res.json({
        ok: false,
        message: `ERROR ==> ${error}`,
      });
    }
  };

  //crear carro
  static createCar = async (req: Request, res: Response) => {
    const { brandId, modelId, color, serialnumber } = req.body;
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
      car.color = color;
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
    const { modelId, brandId, color, serialnumber } = req.body;
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
      car.color = color;
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
              color: car.color,
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
