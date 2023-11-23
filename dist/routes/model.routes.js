"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const model_controller_1 = __importDefault(require("../controllers/model.controller"));
const tokenvalido_1 = require("../jwt/tokenvalido");
const router = (0, express_1.Router)();
const model = model_controller_1.default;
router.get('/', tokenvalido_1.ValidateToken, model.listModel);
router.post('/', tokenvalido_1.ValidateToken, model.createModel);
router.get('/:id', tokenvalido_1.ValidateToken, model.byIdModel);
router.put('/:id', tokenvalido_1.ValidateToken, model.updateModel);
router.delete('/:id', tokenvalido_1.ValidateToken, model.deleteModel);
exports.default = router;
//# sourceMappingURL=model.routes.js.map