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
            sql = `SELECT * FROM 
                    (SELECT package_order.*, 
                            package_payment.slip, 
                            package_payment.status_confirm as payment_confirm, 
                            package_payment.user_confirm, 
                            package_payment.bank_ref 
                    FROM package_order 
                    LEFT JOIN package_payment 
                        ON (package_order.pack_order_id = package_payment.package_order_id)
                    ) as pack
                    WHERE pack.member_id = ? AND pack.status_confirm = "pending" 
                AND (status_payment = "notpay" || status_payment = "pending") AND pack.gender = ?
                ORDER BY pack.createdAt DESC`;
            return this.findOne(sql, [member_id, gender]);
        });
        this.view_member_package = (mem_id, gender) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT * FROM view_member_package WHERE mem_id = ? AND member_gender = ?`;
            return this.findOne(sql, [mem_id, gender]);
        });
        this.query_package_order = () => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT * FROM 
            (SELECT pack.*, members.username
            FROM (SELECT package_order.pack_order_id as paymentId,
                    package.pack_id,
                    package.package_id,
                    package.name,
                    package.day,
                    package.image,
                    package.content,
                    package.price,
                    package.gender,
                    package.gross_profit,
                    package.premium,
                    package.priority,
                    package.display,
                    package_order.begin, 
                    package_order.expire, 
                    package_order.status_expire, 
                    package_order.status_confirm, 
                    package_order.status_payment, 
                    package_order.member_id,
                    package_order.createdAt,
                    package_order.updatedAt,
                    package_payment.slip, 
                    package_payment.status_confirm as paymentStatus,
                    package_payment.user_confirm,
                    package_payment.bank_ref
                FROM package_order
                JOIN package ON (package_order.package_id = package.package_id)
                JOIN package_payment ON (package_order.pack_order_id = package_payment.package_order_id)
                ) AS pack
                INNER JOIN members ON (pack.member_id = members.id AND pack.gender = members.gender)
            ) as orders ORDER BY orders.createdAt DESC`;
            return this.findAll(sql, []);
        });
    }
}
exports.PackageService = PackageService;
