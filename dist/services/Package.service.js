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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const dbconnect_1 = require("../util/dbconnect");
let sql;
class PackageService extends dbconnect_1.DBconnect {
    constructor() {
        super();
        this.queryPackageOrderLast = (member_id, gender) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT 
                    pack.order_id,
                    pack.name, 
                    pack.day, 
                    pack.content, 
                    pack.price, 
                    pack.gender, 
                    pack.status_expire, 
                    pack.status_confirm, 
                    pack.status_payment, 
                    pack.status_payment, 
                    members.username as member_username, 
                    members.password as member_password
                FROM (SELECT 
                        package.*, 
                        package_order.pack_order_id as order_id, 
                        package_order.status_expire, 
                        package_order.status_confirm, 
                        package_order.status_payment, 
                    package_order.member_id FROM package_order 
                    JOIN package ON package_order.package_id = package.package_id
                ) AS pack
                JOIN members ON (pack.member_id = members.id) 
                where member_id = ? AND status_confirm = "pending" 
                AND status_payment = "pending" AND pack.gender = ?
                ORDER BY pack.createdAt DESC`;
            return this.findOne(sql, [member_id, gender]);
        });
    }
}
exports.PackageService = PackageService;
