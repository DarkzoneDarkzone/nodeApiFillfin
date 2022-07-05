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
exports.ViewService = void 0;
const dbconnect_1 = require("../util/dbconnect");
let sql;
class ViewService extends dbconnect_1.DBconnect {
    constructor() {
        super();
        this.view_member_package = (mem_id, gender) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT * FROM view_member_package WHERE mem_id = ? AND gender = ?`;
            return this.findOne(sql, [mem_id, gender]);
        });
        this.view_product_all_store = (gender) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT * FROM view_product_all_store WHERE sex = ? ORDER BY RAND()`;
            return this.findAll(sql, [gender]);
        });
        this.view_product = (package_id, sex, store_id) => __awaiter(this, void 0, void 0, function* () {
            sql = ` SELECT  view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "no"
                GROUP BY view_product.store_id, view_product.id ORDER BY RAND()`;
            return this.findAll(sql, [package_id, sex, store_id]);
        });
        this.view_product_recommend = (package_id, sex) => __awaiter(this, void 0, void 0, function* () {
            sql = ` SELECT  view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND recommend = "yes" AND pre_order = "no"
                GROUP BY view_product.store_id, view_product.id ORDER BY RAND()`;
            return this.findAll(sql, [package_id, sex]);
        });
        this.view_product_preorder = (package_id, sex, store_id) => __awaiter(this, void 0, void 0, function* () {
            sql = ` SELECT  view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "yes"
                GROUP BY view_product.store_id, view_product.id ORDER BY RAND()`;
            return this.findAll(sql, [package_id, sex, store_id]);
        });
        this.view_store_post = (store_id) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT * FROM view_store_post WHERE store_id = ?`;
            return this.findAll(sql, [store_id]);
        });
    }
}
exports.ViewService = ViewService;
