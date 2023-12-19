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
const CarWash_1 = require("../models/CarWash");
const data_source_1 = require("../data-source");
const Client_1 = require("../models/Client");
const typeorm_1 = require("typeorm");
class CarwashController {
}
_a = CarwashController;
CarwashController.listCarwash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.query.type || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const repoCarwash = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const skip = (page - 1) * limit;
        const carwash = yield repoCarwash.find({
            where: {
                state: true,
                type: (0, typeorm_1.Like)(`%${type}%`),
            },
            skip, take: limit,
            relations: { client: true }
        });
        return carwash.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF SERVICES",
                carwash,
                page,
                limit,
                totalCarWash: carwash.length
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", carwash });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR ==> ${error}`,
        });
    }
});
CarwashController.createCarwash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, type, price, amount } = req.body;
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    const repoCarWash = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const newUser = yield repoClient.findOne({
            where: { id: clientId },
        });
        if (!newUser) {
            return res.json({
                ok: false,
                message: "Client not found",
            });
        }
        const carwash = new CarWash_1.CarWash();
        carwash.type = type;
        carwash.price = price;
        carwash.amount = amount;
        carwash.client = clientId;
        carwash.subTotal = price * amount;
        console.log(carwash);
        let discount = 0.1;
        if (newUser.points >= 20) {
            discount = 0.2;
        }
        carwash.subTotal = price * amount;
        carwash.total = carwash.subTotal - carwash.subTotal * discount;
        newUser.points += amount;
        newUser.points -= 20;
        if (newUser.points < 0) {
            newUser.points = 0;
        }
        else {
            carwash.subTotal = price * amount;
            carwash.total = carwash.subTotal;
        }
        newUser.points += amount;
        yield repoCarWash.save(carwash);
        yield repoClient.save(newUser);
        return res.json({
            ok: true,
            message: "CARWASH CREATE",
            carwash,
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR= ${error.message}`,
        });
    }
});
CarwashController.updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoService = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    const { type, price, amount, clientId } = req.body;
    try {
        const carwash = yield repoService.findOne({
            where: { id, state: true },
        });
        if (!carwash) {
            throw new Error("SERVICE DONT NOT EXIST IN THE DATABASE");
        }
        const newUser = yield repoClient.findOne({
            where: { id: clientId },
        });
        if (!newUser) {
            return res.json({
                ok: false,
                msg: `CLIENT WITH ID '${clientId}' DOESN'T EXIST`,
            });
        }
        carwash.type = type;
        carwash.price = price;
        carwash.amount = amount;
        carwash.client = clientId;
        let discount = 0.1;
        if (newUser.points >= 20) {
            discount = 0.2;
        }
        carwash.subTotal = price * amount;
        carwash.total = carwash.subTotal - carwash.subTotal * discount;
        newUser.points += amount;
        newUser.points -= 20;
        if (newUser.points < 0) {
            newUser.points = 0;
        }
        else {
            carwash.subTotal = price * amount;
            carwash.total = carwash.subTotal;
        }
        newUser.points += amount;
        console.log(carwash);
        (yield repoService.save(carwash))
            ? res.json({ ok: true, carwash, msg: "SERVICE WAS UPDATED" })
            : res.json({ ok: false, msg: "THE ID DONT EXIST" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Server error => ${error}`,
        });
    }
});
CarwashController.byIdService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoCarWash = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const carwash = yield repoCarWash.findOne({
            where: { id, state: true },
        });
        return carwash
            ? res.json({ ok: true, carwash, msg: "SUCCESSFULLY" })
            : res.json({ ok: false, msg: "THE ID DOESN'T EXIST" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Server error => ${error}`,
        });
    }
});
CarwashController.deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoCarWash = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const carwash = yield repoCarWash.findOne({
            where: { id, state: true },
        });
        if (!carwash) {
            throw new Error("SERVICE DONT EXIST IN THE DATABSE");
        }
        carwash.state = false;
        yield repoCarWash.save(carwash);
        return res.json({ ok: true, msg: "SERVICE WAS DELETE" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Server error => ${error}`,
        });
    }
});
exports.default = CarwashController;
//# sourceMappingURL=carwash.controller.js.map