"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const car_controller_1 = __importDefault(require("../controllers/car.controller"));
const router = (0, express_1.Router)();
const car = car_controller_1.default;
router.get('/', car.listQuery);
router.post('/', car.createCar);
router.get('/:id', car.byIdCar);
router.put('/:id', car.updateCar);
router.delete('/:id', car.deleteCar);
exports.default = router;
//# sourceMappingURL=car.routes.js.map