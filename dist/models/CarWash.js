"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarWash = void 0;
const typeorm_1 = require("typeorm");
const Car_1 = require("./Car");
let CarWash = class CarWash {
};
exports.CarWash = CarWash;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CarWash.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Car_1.Car),
    __metadata("design:type", Car_1.Car)
], CarWash.prototype, "car", void 0);
__decorate([
    (0, typeorm_1.RelationId)((carwash) => carwash.car),
    __metadata("design:type", Number)
], CarWash.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarWash.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CarWash.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CarWash.prototype, "state", void 0);
exports.CarWash = CarWash = __decorate([
    (0, typeorm_1.Entity)()
], CarWash);
//# sourceMappingURL=CarWash.js.map