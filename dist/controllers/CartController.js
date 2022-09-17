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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const ordersCart_1 = require("./../models/ordersCart");
const product_1 = require("./../models/product");
const View_service_1 = require("./../services/View.service");
const express_validator_1 = require("express-validator");
class CartController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnAddProductToCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = req.authMember;
            try {
                const prod = yield product_1.Product.findOne({ where: { product_code: req.params.code } });
                const cart = yield ordersCart_1.OrdersCart.findOne({ where: { productId: prod.id, memberId: member.member_id } });
                if (!cart) {
                    const cartCreate = yield ordersCart_1.OrdersCart.create({
                        productId: prod.id,
                        memberId: member.member_id
                    });
                }
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'product was add to cart.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnDeleteProductFromCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = req.authMember;
            try {
                const prod = yield product_1.Product.findOne({ where: { product_code: req.params.code } });
                const cart = yield ordersCart_1.OrdersCart.destroy({ where: { productId: prod.id, memberId: member.member_id } });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'product was deleted.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnGetProductInCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const member = req.authMember;
            const finding = yield this.query_product_incart(member.member_id);
            const filtered = finding.map((data) => {
                return {
                    productCode: data.product_code,
                    productName: (data.premium == 'yes') ? data.name_premium : data.name_member,
                    productContent: (data.premium == 'yes') ? data.content_premium : data.content_member,
                    productPrice: (data.premium == 'yes') ? data.price_premium : data.price_standard,
                    productImg: data.path_img,
                    status: data.status
                };
            });
            let totalPrice = 0;
            filtered.forEach((data) => {
                totalPrice += data.productPrice;
            });
            let netprice = totalPrice;
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                cart: filtered,
                totalprice: totalPrice,
                netprice: netprice
            });
        });
        this.OnCheckProductInCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const member = req.authMember;
            const finding = yield this.query_product_incart(member.member_id);
            const missingProduct = [];
            try {
                for (var finding_1 = __asyncValues(finding), finding_1_1; finding_1_1 = yield finding_1.next(), !finding_1_1.done;) {
                    const data = finding_1_1.value;
                    const prod = yield product_1.Product.findOne({ where: { product_code: data.product_code } });
                    if (prod.status != 'active') {
                        yield ordersCart_1.OrdersCart.destroy({ where: { productId: prod.id, memberId: member.member_id } });
                        const res_data = {
                            product_code: data.product_code,
                            name_product: (data.status_premium == 'yes') ? data.name_premium : data.name_member,
                            content_product: (data.status_premium == 'yes') ? data.content_premium : data.content_member,
                            price: (data.status_premium == 'yes') ? data.price_premium : data.price_standard,
                            product_img: data.path_img,
                        };
                        missingProduct.push(res_data);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (finding_1_1 && !finding_1_1.done && (_a = finding_1.return)) yield _a.call(finding_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (missingProduct.length != 0) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'product has been sold.',
                    product: missingProduct
                });
            }
            else {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'product has ready to sell.'
                });
            }
        });
    }
}
exports.CartController = CartController;
