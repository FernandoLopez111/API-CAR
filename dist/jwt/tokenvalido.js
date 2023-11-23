"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ValidateToken = (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
        token = token.slice(7);
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "INVALID TOKEN",
                });
            }
            else {
                next();
            }
        });
    }
    else {
        res.json({
            success: false,
            msg: "ACCESS DENIED! UNATHORIZED",
        });
    }
};
exports.ValidateToken = ValidateToken;
//# sourceMappingURL=tokenvalido.js.map