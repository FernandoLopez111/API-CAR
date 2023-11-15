"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = require("express");
const car_routes_1 = __importDefault(require("./car.routes"));
const carwash_routes_1 = __importDefault(require("./carwash.routes"));
dotenv_1.default.config();
const URL = process.env.URL || 'api/v1';
const routes = (0, express_1.Router)();
//rutas
routes.use(`${URL}/car`, car_routes_1.default);
routes.use(`${URL}/carwash`, carwash_routes_1.default);
exports.default = routes;
//# sourceMappingURL=index.routes.js.map