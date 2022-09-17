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
exports.ReportService = void 0;
const dbconnect_1 = require("../util/dbconnect");
let sql;
class ReportService extends dbconnect_1.DBconnect {
    constructor() {
        super();
        this.queryReportStore = (start, end) => __awaiter(this, void 0, void 0, function* () {
            sql = ` SELECT  store.name as storeName, 
                        store.gender, 
                        reportShop.* 
                FROM store 
                LEFT JOIN (
                            SELECT 
                                view_member_package.name as packageLevel,
                                view_member_package.username,
                                orderss.*
                            FROM view_member_package
                            JOIN (
                                SELECT 	
                                        orders_products.*,
                                        orders.totalprice,
                                        orders.netprice,
                                        orders.member_id,
                                        orders.createdAt
                                FROM orders 
                                JOIN (
                                    SELECT orders_product.order_number, 
                                            orders_product.product_id, 
                                            orders_product.product_name, 
                                            orders_product.price,
                                            products.store_id
                                    FROM orders_product JOIN 
                                    (
                                        SELECT product.id, 
                                                store.id as store_id, 
                                                store.name as store_name 
                                        FROM product 
                                        JOIN store ON (product.store_id = store.id)
                                    ) as products ON (orders_product.product_id = products.id)
                                ) as orders_products
                                ON (orders.order_number = orders_products.order_number)
                            ) as orderss ON (view_member_package.mem_id = orderss.member_id)
                ) as reportShop
                ON (store.id = reportShop.store_id)
                where (reportShop.createdAt > ? AND reportShop.createdAt < ?) OR (reportShop.createdAt IS NULL)`;
            return this.findAll(sql, [start, end]);
        });
        this.queryReportCustomer = (start, end) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT  memberCurrent.*, 
                        orders.priceTotal, 
                        packageOrder.totalPackage
                FROM (
                    SELECT member.id,
                        member.username,
                        view_member_package.name as packageLevel,
                        view_member_package.begin as packageBegin,
                        member.createdAt as registerDate,
                        member.note
                    FROM (
                        SELECT * FROM members 
                        WHERE members.isStore = "no"
                    ) as member 
                    LEFT JOIN view_member_package 
                    ON (member.id = view_member_package.mem_id)
                ) as memberCurrent 
                LEFT JOIN (
                        SELECT orders.*, 
                                SUM(orders.netprice) as priceTotal 
                        FROM orders 
                        WHERE (orders.status = "success" AND orders.payment_status = "confirm")
                        GROUP BY orders.member_id
                ) as orders
                ON (memberCurrent.id = orders.member_id)
                LEFT JOIN (
                        SELECT package_order.member_id, 
                                COUNT(package_order.member_id) as totalPackage 
                        FROM package_order 
                        WHERE (package_order.status_confirm = "confirm" AND package_order.status_payment = "confirm") 
                        GROUP BY (package_order.member_id)
                ) as packageOrder
                ON (memberCurrent.id = packageOrder.member_id)
                where (memberCurrent.registerDate > ? AND memberCurrent.registerDate < ?)`;
            return this.findAll(sql, [start, end]);
        });
        this.queryReportOrder = (start, end) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT orders.order_number, 
                    orders_address.name,
                    orders_address.address,
                    orders_address.district,
                    orders_address.subdistrict,
                    orders_address.province,
                    orders_address.code,
                    orders_address.phone,
                    orders.totalprice, 
                    orders.netprice,
                    orders_payment.slip,
                    orders_address.note,
                    orders.payment_status, 
                    orders.status,
                    orders.createdAt
                FROM orders 
                JOIN orders_address 
                ON (orders.order_number = orders_address.order_number)
                JOIN orders_payment 
                ON (orders.order_number = orders_payment.order_number AND orders_payment.status_confirm = "confirm")
                WHERE (orders.createdAt > ? AND orders.createdAt < ?)`;
            return this.findAll(sql, [start, end]);
        });
        this.queryMemberPackage = () => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT *, 
                    COUNT(view_member_package.mem_id) as totalMember
                FROM view_member_package 
                WHERE isStore = "no" 
                GROUP BY package_id`;
            return this.findAll(sql, []);
        });
        this.queryStoreOrder = () => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT perStore.*, 
                        store.name 
                FROM store 
                JOIN (SELECT allPro.store_id,
                        allPro.status,
                        SUM(allPro.price) as totalPrice, 
                        COUNT(allPro.store_id) as totalProductSold
                    FROM (
                        SELECT orders_product.*, 
                            product.store_id 
                        FROM product 
                        JOIN orders_product 
                        ON (product.id = orders_product.product_id)
                    ) as allPro 
                GROUP BY allPro.store_id) as perStore 
                ON (store.id = perStore.store_id)`;
            return this.findAll(sql, []);
        });
        this.queryNewMember = () => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT package_order.* 
                FROM members 
                JOIN package_order ON (members.id = package_order.member_id) 
                WHERE package_order.status_confirm != "confirm" 
                    OR package_order.status_payment != "confirm" 
                GROUP BY package_order.member_id`;
            return this.findAll(sql, []);
        });
    }
}
exports.ReportService = ReportService;
