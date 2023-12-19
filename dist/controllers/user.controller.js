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
const User_1 = require("../models/User");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
class UserController {
}
_a = UserController;
UserController.listUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rol = req.query.rol || "";
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const skip = (page - 1) * limit;
        const user = yield userRepository.find({
            where: {
                state: true,
                name: (0, typeorm_1.Like)(`%${name}`),
                rol: {
                    type: (0, typeorm_1.Like)(`%${rol}%`)
                }
            },
            relations: { rol: true },
            skip, take: limit,
        });
        return user.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF USERS",
                user,
                page,
                limit,
                totalClients: user.length
            })
            : res.json({ ok: false, msg: "DATA NOT FOUND", user });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Error => ${error}`,
        });
    }
});
UserController.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, rolId } = req.body;
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const repoRol = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    let existingRol;
    try {
        const userExist = yield userRepository.findOne({ where: { email } });
        if (userExist) {
            return res.json({ ok: false, message: `Email '${email}' already exists` });
        }
        if (rolId) {
            existingRol = yield repoRol.findOne({ where: { id: rolId } });
            if (!existingRol) {
                return res.json({
                    ok: false,
                    msg: `ROL WITH ID '${rolId}' DON'T EXIST`,
                });
            }
        }
        else {
            if ((existingRol === null || existingRol === void 0 ? void 0 : existingRol.rol) && rolId) {
                return res.json({
                    ok: false,
                    msg: 'Cannot assign rol to a regular user'
                });
            }
        }
        const user = new User_1.User();
        user.name = name;
        user.email = email;
        user.password = password;
        user.rol = existingRol;
        user.hashPassword();
        yield userRepository.save(user);
        return res.json({
            ok: true,
            msg: "Users was create",
            user,
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Error => ${error}`,
        });
    }
});
UserController.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const repoRol = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    const { rolId, name, email, password } = req.body;
    let user;
    try {
        user = yield userRepository.findOne({
            where: { id, state: true },
        });
        if (!user) {
            throw new Error("USER DON'T EXIST IN THE DATABASE");
        }
        const existingUser = yield userRepository.findOne({
            where: { email, id: (0, typeorm_2.Not)(id) },
        });
        if (existingUser) {
            return res.json({
                ok: false,
                msg: `Email with ID '${email}' already exist`,
            });
        }
        const existingRol = yield repoRol.findOne({ where: { id: rolId } });
        if (!existingRol) {
            return res.json({
                ok: false,
                msg: `ROL WITH ID '${rolId}' DON'T EXIST`,
            });
        }
        user.rol = existingRol;
        user.name = name;
        user.email = email;
        user.password = password;
        yield userRepository.save(user);
        return res.json({
            ok: true,
            msg: "USER WAS UPDATE",
            user: user,
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `Error => ${error}`,
        });
    }
});
UserController.byIdUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const user = yield userRepository.findOne({
            where: { id, state: true },
        });
        return user
            ? res.json({ ok: true, user, msg: "SUCCESSFULLY" })
            : res.json({ ok: false, msg: "THE ID DON'T EXIST" });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR => ${error}`,
        });
    }
});
UserController.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const user = yield userRepository.findOne({
            where: { id, state: true },
        });
        if (!user) {
            throw new Error("User don't exist in data base");
        }
        user.state = false;
        yield userRepository.save(user);
        return res.json({
            ok: true,
            msg: "USER WAS DELETE",
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR => ${error}`,
        });
    }
});
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map