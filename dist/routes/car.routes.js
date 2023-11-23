"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const car_controller_1 = __importDefault(require("../controllers/car.controller"));
const tokenvalido_1 = require("../jwt/tokenvalido");
const router = (0, express_1.Router)();
const car = car_controller_1.default;
router.get('/', tokenvalido_1.ValidateToken, car.listCars);
router.post('/', tokenvalido_1.ValidateToken, car.createCar);
router.get('/:id', tokenvalido_1.ValidateToken, car.byIdCar);
router.put('/:id', tokenvalido_1.ValidateToken, car.updateCar);
router.delete('/:id', tokenvalido_1.ValidateToken, car.deleteCar);
exports.default = router;
//# sourceMappingURL=car.routes.js.map