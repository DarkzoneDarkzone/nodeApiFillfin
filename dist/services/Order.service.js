"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const dbconnect_1 = require("../util/dbconnect");
let sql;
class OrderService extends dbconnect_1.DBconnect {
    constructor() {
        super();
    }
}
exports.OrderService = OrderService;
