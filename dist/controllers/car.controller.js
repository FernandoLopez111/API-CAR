"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const Car_1 = require("../models/Car");
const typeorm_1 = require("typeorm");
const Model_1 = require("../models/Model");
const Brand_1 = require("../models/Brand");
class CarsController {
}
_a = CarsController;
CarsController.listCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const color = req.query.color || "";
    const brand = req.query.brand || "";
    const model = req.query.model || "";
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    try {
        const car = yield repoCar.find({
            where: {
                state: true,
                color: (0, typeorm_1.Like)(`%${color}%`),
                brand: { type: (0, typeorm_1.Like)(`%${brand}%`) },
                model: { typemodel: (0, typeorm_1.Like)(`%${model}%`) },
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
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==> ${error}`,
        });
    }
});
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
CarsController.createCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandId, modelId, color, serialnumber } = req.body;
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    const repoModel = data_source_1.AppDataSource.getRepository(Model_1.Model);
    const repoBrand = data_source_1.AppDataSource.getRepository(Brand_1.Brand);
    try {
        if (!modelId || !brandId) {
            return res.json({
                ok: false,
                message: "modelId and brandId is required in the request body",
            });
        }
        const exisitingModel = yield repoModel.findOne({
            where: { id: modelId },
        });
        const existingBrand = yield repoBrand.findOne({ where: { id: brandId } });
        if (!exisitingModel || !existingBrand) {
            return res.json({
                ok: false,
                message: `Model and Brand ${modelId} ${brandId} does not exist`,
            });
        }
        const car = new Car_1.Car();
        car.brand = brandId;
        car.model = modelId;
        car.color = color;
        car.serialnumber = serialnumber;
        yield repoCar.save(car);
        return res.json({
            ok: true,
            STATUS_CODES: 200,
            message: "Car was created",
            // brandType:existingBrand.type,
            // modeltype:exisitingModel.typemodel
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            STATUS_CODES: 500,
            message: `ERROR  ===> ${error}`,
        });
    }
});
// modificar carro
CarsController.updateCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { modelId, brandId, color, serialnumber } = req.body;
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    let car;
    try {
        car = yield repoCar.findOne({ where: { id, state: true } });
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
        yield repoCar.save(car);
        return res.json({
            ok: true,
            STATUS_CODE: 200,
            message: `Car was update`,
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            STATUS_CODES: 500,
            message: `ERROR ==> ${error}`,
        });
    }
});
// buscar carro por id
CarsController.byIdCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const id = parseInt(req.params.id);
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    try {
        const car = yield repoCar.findOne({
            where: { id, state: true },
            relations: ["brand", "model"],
        });
        return car
            ? res.json({
                ok: true,
                car: {
                    brand: (_b = car.brand) === null || _b === void 0 ? void 0 : _b.type,
                    model: (_c = car.model) === null || _c === void 0 ? void 0 : _c.typemodel,
                    color: car.color,
                    serialnumber: car.serialnumber,
                },
                message: "SUCCES",
            })
            : res.json({
                ok: false,
                message: "the Id not exist",
            });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR  ==> ${error}`,
        });
    }
});
// deshabilitar carro
CarsController.deleteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    try {
        const car = yield repoCar.findOne({
            where: { id, state: true },
        });
        if (!car) {
            throw new Error("CAR DONT EXIST IN DATABASE");
        }
        car.state = false;
        yield repoCar.save(car);
        return res.json({ ok: true, msg: "CAR WAS DELETE" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR==> ${error}`,
        });
    }
});
exports.default = CarsController;
//# sourceMappingURL=car.controller.js.map