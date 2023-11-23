"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenvalido_1 = require("./../jwt/tokenvalido");
const express_1 = require("express");
const brand_controller_1 = __importDefault(require("../controllers/brand.controller"));
const router = (0, express_1.Router)();
const brand = brand_controller_1.default;
router.get('/', tokenvalido_1.ValidateToken, brand.listBrand);
router.post('/', tokenvalido_1.ValidateToken, brand.createBrand);
router.get('/:id', tokenvalido_1.ValidateToken, brand.byIdBrand);
router.put('/:id', tokenvalido_1.ValidateToken, brand.updateBrand);
router.delete('/:id', tokenvalido_1.ValidateToken, brand.deleteBrand);
exports.default = router;
//# sourceMappingURL=brand.routes.js.map