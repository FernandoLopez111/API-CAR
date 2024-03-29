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
const Model_1 = require("../models/Model");
const typeorm_1 = require("typeorm");
class ModelController {
}
_a = ModelController;
//metodo de obtener todos
ModelController.listModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name || "";
    const repoModel = data_source_1.AppDataSource.getRepository(Model_1.Model);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    console.log(req.body);
    try {
        const [models, total] = yield repoModel.findAndCount({
            where: { state: true, typemodel: (0, typeorm_1.Like)(`%${name}%`) },
            order: { typemodel: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        if (models.length > 0) {
            let totalPage = Number(total) / limit;
            if (totalPage % 1 !== 0) {
                totalPage = Math.trunc(totalPage) + 1;
            }
            let nextPage = page >= totalPage ? page : Number(page) + 1;
            let prevPage = page <= 1 ? page : page - 1;
            return res.json({
                ok: true,
                models,
                total,
                totalPage,
                currentPage: Number(page),
                nextPage,
                prevPage,
            });
        }
    }
    catch (error) {
        ok: false;
        StatusCode: 500;
        message: `error = ${error.message}`;
    }
});
//metodo de crear
ModelController.createModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { typemodel } = req.body;
    const repoModel = data_source_1.AppDataSource.getRepository(Model_1.Model);
    try {
        const model = new Model_1.Model();
        model.typemodel = typemodel;
        yield repoModel.save(model);
        return res.json({
            ok: true,
            message: "model was create",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==>  ${error}`,
        });
    }
});
//modificar
ModelController.updateModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { typemodel } = req.body;
    const repoModel = data_source_1.AppDataSource.getRepository(Model_1.Model);
    let models;
    try {
        models = yield repoModel.findOne({
            where: { id, state: true },
        });
        if (!models) {
            throw new Error("MODEL DONT EXIST IN DATABASE");
        }
        models.typemodel = typemodel;
        yield repoModel.save(models);
        return res.json({
            ok: true,
            message: "Models was Update",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==> ${error}`,
        });
    }
});
//metodo de busqueda por id
ModelController.byIdModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoModel = data_source_1.AppDataSource.getRepository(Model_1.Model);
    try {
        const model = yield repoModel.findOne({
            where: { id, state: true },
        });
        return model
            ? res.json({
                ok: true,
                model,
                message: "SUCCESS",
            })
            : res.json({
                ok: false,
                message: "THE ID DONT EXIST",
            });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ===>  ${error}`,
        });
    }
});
//deshabilitar o eliminacion logica
ModelController.deleteModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoModel = data_source_1.AppDataSource.getRepository(Model_1.Model);
    try {
        const model = yield repoModel.findOne({
            where: { id, state: true },
        });
        if (!model) {
            throw new Error("Model dont exist in database");
        }
        model.state = false;
        yield repoModel.save(model);
        return res.json({
            ok: true,
            message: "Model was delete",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR  ===> ${error}`,
        });
    }
});
ModelController.listQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { typemodel } = req.query;
    const repoModel = data_source_1.AppDataSource.getRepository(Model_1.Model);
    try {
        const model = yield repoModel
            .createQueryBuilder("model")
            .where("model.typemodel = :typemodel", {
            typemodel: typemodel,
            state: true,
        })
            .getOne();
        return model
            ? res.json({
                ok: true,
                message: "TypeModel is ",
                model,
            })
            : res.json({
                ok: false,
                message: "Data not found",
                model,
            });
    }
    catch (error) {
        return res.json({
            ok: false,
            message: `ERROR ==> ${error}`,
        });
    }
});
exports.default = ModelController;
//# sourceMappingURL=model.controller.js.map