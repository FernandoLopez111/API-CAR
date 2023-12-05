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
const Rol_1 = require("../models/Rol");
const typeorm_1 = require("typeorm");
const roleRepository = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
class RoleController {
}
_a = RoleController;
//metodo de listar
RoleController.listRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoRoles = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    console.log(req.query);
    try {
        const skip = (page - 1) * limit;
        const rol = yield repoRoles.find({
            where: {
                state: true,
                type: (0, typeorm_1.Like)(`%${name}`)
            },
            skip,
            take: limit,
        });
        return rol.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF ROLES",
                rol,
                page,
                limit,
                totalRoles: rol.length
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", rol });
    }
    catch (e) {
        return res.json({
            ok: false,
            msg: `ERROR => ${e}`,
        });
    }
});
//metodo de crear
RoleController.createRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    try {
        const rol = new Rol_1.Rol();
        rol.type = type;
        yield roleRepository.save(rol);
        return res.json({
            ok: true,
            msg: "ROL WAS CREATE",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR => ${error}`,
        });
    }
});
RoleController.modifyRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { type } = req.body;
    const repoRoles = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    let role;
    try {
        role = yield repoRoles.findOne({
            where: { id, state: true },
        });
        if (!type) {
            throw new Error("Rol not found");
        }
        role.type = type;
        yield roleRepository.save(role);
        return res.json({ ok: true, msg: "Rol updated" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR SERVER => ${error}`,
        });
    }
});
/// obtener por id Rol
RoleController.getId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const repoRol = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    try {
        const getid = yield repoRol.findOne({
            where: { id, state: true },
        });
        return getid
            ? res.json({ id, ok: true, getid, msg: "Succesfully" })
            : res.json({ ok: false, msg: "The Id doesn't exist" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR SERVER => ${error}`,
        });
    }
});
// DELETE ROL
RoleController.deleteRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const reposRol = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    try {
        const deleterol = yield reposRol.findOne({
            where: { id, state: true },
        });
        if (!deleterol) {
            throw new Error("not found Rol");
        }
        deleterol.state = false;
        yield reposRol.save(deleterol);
        return res.json({ ok: true, msg: "ROL WAS DELETE" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR SERVER => ${error}`,
        });
    }
});
exports.default = RoleController;
//# sourceMappingURL=rol.controller.js.map