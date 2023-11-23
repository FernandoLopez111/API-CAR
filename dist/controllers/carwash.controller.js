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
    const repoClient = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const service = yield repoClient.find({
            where: {
                state: true,
                type: (0, typeorm_1.Like)(`%${type}%`),
            },
        });
        return service.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF SERVICES",
                service,
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", service });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR ==> ${error}`,
        });
    }
});
CarwashController.createCarwash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, type, price, amount, subtotal, total } = req.body;
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    const repoCarWash = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const newUser = yield repoClient.findOne({
            where: {
                id: clientId,
            },
        });
        const carwash = new CarWash_1.CarWash();
        carwash.client = clientId;
        carwash.type = type;
        carwash.price = price;
        carwash.amount = amount;
        carwash.subTotal = subtotal;
        carwash.total = total;
        let SubTotal = price * amount;
        carwash.subTotal = SubTotal;
        if (newUser.points >= 10) {
            newUser.points = newUser.points + carwash.amount;
            carwash.total = parseFloat((carwash.subTotal - carwash.subTotal * 0.1).toFixed(2));
            newUser.points = newUser.points - newUser.points;
            yield repoCarWash.save(carwash);
            repoClient.save(newUser);
            return res.json({
                ok: true,
                message: "POINTS ARE 10 THE DISCOUNT IS THE 10%",
            });
        }
        else if (newUser.points >= 20) {
            newUser.points = newUser.points + carwash.amount;
            carwash.total = carwash.subTotal - carwash.subTotal * 0.2;
            newUser.points = newUser.points - newUser.points;
            yield repoCarWash.save(carwash);
            repoClient.save(newUser);
            return res.json({
                ok: true,
                message: "POINTS ARE 20 THE DISCOUNT IS THE 20%",
            });
        }
        newUser.points = newUser.points - newUser.points;
        yield repoCarWash.save(carwash);
        repoClient.save(carwash);
        return res.json({ ok: true, message: "CARWASH WAS CREATE" });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR THAT CLIENT DONT EXIST = ${error.message}`,
        });
    }
});
CarwashController.updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoService = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    const { type, price } = req.body;
    try {
        const service = yield repoService.findOne({
            where: { id, state: true },
        });
        if (!service) {
            throw new Error("SERVICE DONT NOT EXIST IN THE DATABASE");
        }
        service.type = type;
        service.price = price;
        (yield repoService.save(service))
            ? res.json({ ok: true, service, msg: "SERVICE WAS UPDATED" })
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
    const repoService = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const service = yield repoService.findOne({
            where: { id, state: true },
        });
        return service
            ? res.json({ ok: true, service, msg: "SUCCESSFULLY" })
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
    const repoService = data_source_1.AppDataSource.getRepository(CarWash_1.CarWash);
    try {
        const service = yield repoService.findOne({
            where: { id, state: true },
        });
        if (!service) {
            throw new Error("SERVICE DONT EXIST IN THE DATABSE");
        }
        service.state = false;
        yield repoService.save(service);
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