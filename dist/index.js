"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server/server"));
const data_source_1 = require("./data-source");
dotenv_1.default.config();
const server = new server_1.default();
server.listen();
data_source_1.AppDataSource.initialize().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    if (connection) {
        console.log(`==> Connection with database successfully<==`);
    }
})).catch((error) => console.log(error + 'Connection a database failed') + error);
//# sourceMappingURL=index.js.map