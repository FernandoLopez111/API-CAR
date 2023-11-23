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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const data_source_1 = require("../data-source");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../jwt/jwt");
class AuthController {
}
_a = AuthController;
AuthController.Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const { email, password } = req.body;
    try {
        const user = yield authRepo.findOne({
            where: { email, state: true },
        });
        if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
            return res.json({
                ok: false,
                msg: "EMAIL OR PASSWORD INCORRECT ",
            });
        }
        const token = yield (0, jwt_1.tokenAuth)(user);
        return res.json({
            ok: true,
            msg: "Welcome my friend",
            token
        });
    }
    catch (error) {
        return res.json({
            ok: false,
            msg: `ERROR ==> ${error}`,
        });
    }
});
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map