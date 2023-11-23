"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carwash_controller_1 = __importDefault(require("../controllers/carwash.controller"));
const tokenvalido_1 = require("../jwt/tokenvalido");
const router = (0, express_1.Router)();
const service = carwash_controller_1.default;
router.get("/", tokenvalido_1.ValidateToken, service.listCarwash);
router.post("/", tokenvalido_1.ValidateToken, service.createCarwash);
router.get("/:id", tokenvalido_1.ValidateToken, service.byIdService);
router.put("/:id", tokenvalido_1.ValidateToken, service.updateService);
router.delete("/:id", tokenvalido_1.ValidateToken, service.deleteService);
exports.default = router;
//# sourceMappingURL=carwash.routes.js.map