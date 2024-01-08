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
const Client_1 = require("../models/Client");
const typeorm_1 = require("typeorm");
class ClientsController {
}
_a = ClientsController;
ClientsController.listClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name || "";
    const serialNumber = req.query.serialNumber || "";
    const phone = req.query.phone || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const repoCar = data_source_1.AppDataSource.getRepository(Client_1.Client);
    try {
        const skip = (page - 1) * limit;
        const client = yield repoCar.find({
            where: {
                state: true,
                name: (0, typeorm_1.Like)(`%${name}%`),
                car: { color: (0, typeorm_1.Like)(`%${serialNumber}%`) },
                phone: (0, typeorm_1.Like)(`%${phone}%`)
            },
            skip, take: limit,
            relations: { car: true },
        });
        return client.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF CLIENTS",
                client,
                page,
                limit,
                totalClients: client.length
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", client });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR ==> ${error}`,
        });
    }
});
ClientsController.createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId, name, phone } = req.body;
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    let existingCar;
    try {
        if (carId) {
            existingCar = yield repoCar.findOne({ where: { id: carId } });
            if (!existingCar) {
                return res.json({
                    ok: false,
                    msg: `CAR WITH ID '${carId}' DON'T NOT EXIST`,
                });
            }
            const client = new Client_1.Client();
            client.car = carId;
            client.name = name;
            client.phone = phone;
            yield repoClient.save(client);
            return res.json({
                ok: true,
                msg: "CLIENT WAS CREATE",
                client,
            });
        }
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Error => ${error}`,
        });
    }
});
ClientsController.updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    const repoCar = data_source_1.AppDataSource.getRepository(Car_1.Car);
    const { carId, name, phone } = req.body;
    let client;
    try {
        client = yield repoClient.findOne({
            where: { id, state: true },
        });
        if (!client) {
            throw new Error("CLIENT DON'T NOT EXIST IN THE DATABASE");
        }
        const existingCar = yield repoCar.findOne({
            where: { id: carId }
        });
        if (!existingCar) {
            return res.json({
                ok: false,
                msg: `CAR WITH ID '${carId}' DOESN'T EXIST`,
            });
        }
        client.car = existingCar;
        client.name = name;
        client.phone = phone;
        yield repoClient.save(client);
        // ? res.json({ ok: true, 
        //   client, msg: "CLIENT WAS UPDATED" })
        // : res.json({ ok: false, msg: "THE ID DON'T EXIST" });
        return res.json({
            ok: true,
            msg: "client was update",
            client: client,
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Server error => ${error}`,
        });
    }
});
ClientsController.byIdClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    try {
        const client = yield repoClient.findOne({
            where: { id, state: true },
        });
        return client
            ? res.json({ ok: true, client, msg: "SUCCESSFULLY" })
            : res.json({ ok: false, msg: "THE ID DOESN'T EXIST" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Server error => ${error}`,
        });
    }
});
ClientsController.deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    try {
        const client = yield repoClient.findOne({
            where: { id, state: true },
        });
        if (!client) {
            throw new Error("CLIENT DONT EXIST IN THE DATABSE");
        }
        client.state = false;
        yield repoClient.save(client);
        return res.json({ ok: true, msg: "CLIENT WAS DELETE" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Server error => ${error}`,
        });
    }
});
ClientsController.getCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const carId = Number(req.params.id) || 0;
    const repoClient = data_source_1.AppDataSource.getRepository(Client_1.Client);
    try {
        const client = yield repoClient.find({
            where: {
                state: true,
                car: { id: carId },
            },
            relations: { car: true },
        });
        return client.length > 0
            ? res.json({ ok: true, client })
            : res.json({ ok: false, msg: "THE IDCAR DONT EXIST" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Server error => ${error}`,
        });
    }
});
exports.default = ClientsController;
//# sourceMappingURL=client.controller.js.map