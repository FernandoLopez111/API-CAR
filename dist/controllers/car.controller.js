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
// const carRepository = AppDataSource.getRepository(Car)
class CarsController {
}
_a = CarsController;
//metodo de obtener todos
CarsController.listCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoCars = data_source_1.AppDataSource.getRepository(Car_1.Car);
    try {
        const car = yield repoCars.find({
            where: { state: true },
        });
        return car.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF CARS",
                car
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", car });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR ==> ${error}`,
        });
    }
});
//crear carro
CarsController.createCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner, brand } = req.body;
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    try {
        const car = new Car_1.Car();
        car.owner = owner;
        car.brand = brand;
        yield repoCar.save(car);
        return res.json({
            ok: true,
            msg: "CAR WAS CREATE",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR==> ${error}`
        });
    }
});
// modificar carro
CarsController.updateCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { owner, brand } = req.body;
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    let cars;
    try {
        cars = yield repoCar.findOne({
            where: { id, state: true }
        });
        if (!cars) {
            throw new Error("CAR DONT EXIST IN DATABASE");
        }
        cars.owner = owner;
        cars.brand = brand;
        yield repoCar.save(cars);
        return res.json({
            ok: true,
            msg: "CAR WAS UPDATE"
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR==> ${error}`
        });
    }
});
// buscar carro por id
CarsController.byIdCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    try {
        const car = yield repoCar.findOne({
            where: { id, state: true },
        });
        return car
            ? res.json({ ok: true, car, msg: "SUCCESS" })
            : res.json({ ok: false, msg: "THE ID DONT EXIST" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR==> ${error}`,
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
            msg: `ERROR==> ${error}`
        });
    }
});
CarsController.listQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner, brand } = req.query;
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    try {
        const car = yield repoCar.createQueryBuilder("car")
            .where("car.owner = :owner OR car.brand = :brand ", { owner: owner, brand: brand, state: true })
            .getOne();
        return car
            ? res.json({
                ok: true,
                msg: "OWNER OR BRAND IS",
                car
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", car });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR ==> ${error}`,
        });
    }
});
exports.default = CarsController;
//# sourceMappingURL=car.controller.js.map