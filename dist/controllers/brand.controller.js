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
const Brand_1 = require("../models/Brand");
const typeorm_1 = require("typeorm");
class BrandController {
}
_a = BrandController;
BrandController.listBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoBrand = data_source_1.AppDataSource.getRepository(Brand_1.Brand);
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const skip = (page - 1) * limit;
        const brand = yield repoBrand.find({
            where: { state: true, type: (0, typeorm_1.Like)(`${name}`), },
            skip, take: limit,
        });
        return brand.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF BRANDS",
                brand,
                page,
                limit,
                totalBrands: brand.length
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", brand });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR ==> ${error}`,
        });
    }
});
//CREAT BRAND
BrandController.createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    const repoBrand = data_source_1.AppDataSource.getRepository(Brand_1.Brand);
    try {
        const brand = new Brand_1.Brand();
        brand.type = type;
        yield repoBrand.save(brand);
        return res.json({
            ok: true,
            message: "BRAND WAS CREATE ",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==> ${error}`,
        });
    }
});
//update brand
BrandController.updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { type } = req.body;
    const repoBrand = data_source_1.AppDataSource.getRepository(Brand_1.Brand);
    let brands;
    try {
        brands = yield repoBrand.findOne({
            where: { id, state: true },
        });
        if (!brands) {
            throw new Error("Brand dont exist in database");
        }
        brands.type = type;
        yield repoBrand.save(brands);
        return res.json({
            ok: true,
            message: "Brand was update",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==> ${error}`,
        });
    }
});
///buscar por id
BrandController.byIdBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoBrand = data_source_1.AppDataSource.getRepository(Brand_1.Brand);
    try {
        const brand = yield repoBrand.findOne({
            where: { id, state: true },
        });
        return brand
            ? res.json({ ok: true, brand, message: "SUCCESS" })
            : res.json({ ok: false, message: "THE ID DONT EXIST" });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==> ${error}`,
        });
    }
});
//EliminarBrand de forma logica
BrandController.deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoBrand = data_source_1.AppDataSource.getRepository(Brand_1.Brand);
    try {
        const brand = yield repoBrand.findOne({
            where: { id, state: true },
        });
        if (!brand) {
            throw new Error("BRAND DONT EXIST IN DATABASE");
        }
        brand.state = false;
        yield repoBrand.save(brand);
        return res.json({ ok: true, message: "BRAND WAS DELETE" });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==> ${error}`,
        });
    }
});
BrandController.listQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.query;
    const repoBrand = data_source_1.AppDataSource.getRepository(Brand_1.Brand);
    try {
        const brand = yield repoBrand
            .createQueryBuilder("brand")
            .where("brand.type = :type", { type: type, state: true })
            .getOne();
        return brand
            ? res.json({
                ok: true,
                message: "Type is ",
                brand,
            })
            : res.json({
                ok: false,
                message: "DATA NOT FOUND",
                brand,
            });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ===> ${error}`,
        });
    }
});
exports.default = BrandController;
//# sourceMappingURL=brand.controller.js.map