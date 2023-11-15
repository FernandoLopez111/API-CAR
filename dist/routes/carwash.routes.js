"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carwash_controller_1 = __importDefault(require("../controllers/carwash.controller"));
const router = (0, express_1.Router)();
const carwash = carwash_controller_1.default;
router.get('/serviceList', carwash.servicesList);
router.get('/', carwash.listCarWashs);
router.patch('/', carwash.lisQuery);
router.post('/', carwash.createCarwash);
router.get('/:id', carwash.byIdCarWash);
router.put('/:id', carwash.updateCarwash);
router.delete('/:id', carwash.deleteCarWash);
exports.default = router;
//# sourceMappingURL=carwash.routes.js.map