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
class UserController {
}
_a = UserController;
UserController.listUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rol = req.query.rol || "";
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const user = yield userRepository.find({
            where: { state: true, rol: { type: (0, typeorm_1.Like)(`%${rol}%`) } },
            relations: { rol: true },
        });
        return user.length > 0
            ? res.json({
                ok: true,
                msg: "LIST OF USERS",
                user,
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
            const user = new User_1.User();
            user.name = name;
            user.email = email;
            user.password = password;
            user.rol = rolId;
            user.hashPassword();
            yield userRepository.save(user);
            return res.json({
                ok: true,
                msg: "Users was create",
                user,
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
UserController.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const repoRol = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    const { rolId, name, email, password } = req.body;
    try {
        const user = yield userRepository.findOneOrFail({
            where: { id, state: true },
        });
        if (!user) {
            throw new Error("USER DONT EXIST IN THE DATABASE");
        }
        const existingRol = yield repoRol.findOne({ where: { id: rolId } });
        if (!existingRol) {
            return res.json({
                ok: false,
                msg: `ROL WITH ID '${rolId}' DONT EXIST`,
            });
        }
        user.rol = rolId;
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
            : res.json({ ok: false, msg: "THE ID DONT EXIST" });
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
            throw new Error("User dont exist in data base");
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