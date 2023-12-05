"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const tokenvalido_1 = require("../jwt/tokenvalido");
const router = (0, express_1.Router)();
const user = user_controller_1.default;
router.get("/", tokenvalido_1.ValidateToken, user.listUser);
//router.get("/rol/:id", user.getRol);
router.post("/", user.createUser);
router.get("/:id", user.byIdUser);
router.put("/:id", user.updateUser);
router.delete("/:id", tokenvalido_1.ValidateToken, user.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map