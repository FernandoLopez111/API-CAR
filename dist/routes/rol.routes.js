"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controller_1 = __importDefault(require("../controllers/rol.controller"));
const tokenvalido_1 = require("../jwt/tokenvalido");
const router = (0, express_1.Router)();
const rol = rol_controller_1.default;
router.get("/", tokenvalido_1.ValidateToken, rol.listRoles);
router.post("/", tokenvalido_1.ValidateToken, rol.createRol);
router.put("/:id", tokenvalido_1.ValidateToken, rol.modifyRol);
router.get("/:id", tokenvalido_1.ValidateToken, rol.getId);
router.delete("/:id", tokenvalido_1.ValidateToken, rol.deleteRol);
// router.get("/", rol.listRoles);
// router.post("/", rol.createRol);
// router.put("/:id", rol.modifyRol);
// router.get("/:id", rol.getId);
// router.delete("/:id", rol.deleteRol);
exports.default = router;
//# sourceMappingURL=rol.routes.js.map