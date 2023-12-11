"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = __importDefault(require("../controllers/client.controller"));
const tokenvalido_1 = require("../jwt/tokenvalido");
const router = (0, express_1.Router)();
const client = client_controller_1.default;
router.get("/", tokenvalido_1.ValidateToken, client.listClient);
router.get("/car/:id", tokenvalido_1.ValidateToken, client.getCar);
router.post("/", client.createClient);
router.get("/:id", tokenvalido_1.ValidateToken, client.byIdClient);
router.put("/:id", tokenvalido_1.ValidateToken, client.updateClient);
router.delete("/:id", tokenvalido_1.ValidateToken, client.deleteClient);
exports.default = router;
//# sourceMappingURL=client.routes.js.map