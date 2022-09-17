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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const settings_1 = require("./../models/settings");
const review_1 = require("./../models/review");
const ordersCart_1 = require("./../models/ordersCart");
const product_1 = require("./../models/product");
const ordersProduct_1 = require("./../models/ordersProduct");
const ordersPayment_1 = require("./../models/ordersPayment");
const ordersAddress_1 = require("./../models/ordersAddress");
const View_service_1 = require("./../services/View.service");
const orders_1 = require("./../models/orders");
const database_1 = require("./../util/database");
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
class OrderController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnCreateOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = req.authMember;
            const t = yield database_1.sequelize.transaction();
            const packages = yield this.view_member_package(member.member_id, member.gender);
            const order_number = "OD-" + (0, moment_1.default)().unix() + Math.floor((Math.random() * 100) + 1).toString().padStart(3, "0");
            const order_product = yield this.query_product_incart(member.member_id);
            const gp_recommend = yield settings_1.Settings.findOne({ where: { setting_name: 'gross_profit' } });
            let missingProduct = [];
            let orderProduct = [];
            let arrProductId = [];
            let totalPrice = 0;
            let netPrice = 0;
            try {
                for (var order_product_1 = __asyncValues(order_product), order_product_1_1; order_product_1_1 = yield order_product_1.next(), !order_product_1_1.done;) {
                    const data = order_product_1_1.value;
                    const prod = yield product_1.Product.findOne({ where: { product_code: data.product_code } });
                    if (prod.status !== 'active') {
                        yield ordersCart_1.OrdersCart.destroy({ where: { productId: prod.id, memberId: member.member_id } });
                        const res_data = {
                            name_product: (data.premium === 'yes') ? data.name_premium : data.name_member,
                        };
                        missingProduct.push(res_data);
                    }
                    else {
                        const order_data = {
                            order_number: order_number,
                            product_id: prod.id,
                            product_name: (data.premium === 'yes') ? data.name_premium : data.name_member,
                            status: 'pending',
                            product_content: (data.premium === 'yes') ? data.content_premium : data.content_member,
                            gross_profit: (data.recommend === 'yes') ? parseInt(gp_recommend.setting_value) : parseInt(packages.gross_profit),
                            price: (data.premium === 'yes') ? data.price_premium : data.price_standard
                        };
                        totalPrice += order_data.price;
                        netPrice += order_data.price * (1 - order_data.gross_profit / 100);
                        arrProductId.push(prod.id);
                        orderProduct.push(order_data);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (order_product_1_1 && !order_product_1_1.done && (_a = order_product_1.return)) yield _a.call(order_product_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (missingProduct.length !== 0) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'product has been sold.',
                    data: missingProduct
                });
            }
            if (orderProduct.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'not found product in cart.',
                });
            }
            try {
                let slip = '';
                if (req.file) {
                    /** for slip destination */
                    const destSlip = req.file.destination.split("uploads")[0] + "/slip" + req.file.destination.split("uploads")[1];
                    if (!fs_1.default.existsSync(`${destSlip}`)) {
                        fs_1.default.mkdirSync(destSlip, { recursive: true });
                    }
                    /** for slip destination */
                    let upload = "/slip" + req.file.destination.split("uploads").pop();
                    var ext = path_1.default.extname(req.file.originalname);
                    let originalname = path_1.default.basename(req.file.originalname, ext);
                    for (let i = 1; fs_1.default.existsSync(destSlip + originalname + ext); i++) {
                        originalname = originalname.split('(')[0];
                        originalname += '(' + i + ')';
                    }
                    const image = yield sharp(req.file.path)
                        .resize(500, 500)
                        .withMetadata()
                        .jpeg({ quality: 95 })
                        .toFile(path_1.default.resolve(destSlip, originalname + ext))
                        .then((data) => {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        return upload + originalname + ext;
                    });
                    slip = image;
                }
                const order_pro = yield ordersProduct_1.OrdersProduct.bulkCreate(orderProduct);
                const update_product = yield product_1.Product.update({ status: 'sold' }, { where: { id: { [sequelize_1.Op.in]: arrProductId } } }, { transaction: t });
                const ord_delete = yield ordersCart_1.OrdersCart.destroy({ where: { memberId: member.member_id } }, { transaction: t });
                const order = yield orders_1.Orders.create({
                    order_number: order_number,
                    payment_status: 'pending',
                    status: 'pending',
                    totalprice: totalPrice,
                    netprice: netPrice,
                    member_id: member.member_id,
                    message: '',
                    isRead: false,
                    isReview: false,
                }, { transaction: t });
                const order_address = yield ordersAddress_1.OrdersAddress.create({
                    order_number: order_number,
                    name: req.body.name,
                    address: req.body.address,
                    phone: req.body.phone,
                    district: req.body.district,
                    subdistrict: req.body.subdistrict,
                    province: req.body.province,
                    code: req.body.code,
                    note: req.body.note,
                }, { transaction: t });
                const order_payment = yield ordersPayment_1.OrdersPayment.create({
                    order_number: order_number,
                    bank_id: parseInt(req.body.bank_ref),
                    slip: slip,
                    status_confirm: 'pending',
                    name: '',
                    total_pay: 0,
                    date_pay: new Date(), //req.body.date_pay,
                }, { transaction: t });
                yield t.commit();
                return res.status(201).json({
                    status: false,
                    message: 'error',
                    description: 'create order success.'
                });
            }
            catch (error) {
                yield t.rollback();
                return res.status(500).json({
                    status: true,
                    message: 'ok',
                    description: 'something went wrong.',
                    error: error
                });
            }
        });
        this.OnGetOrderMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const member = req.authMember;
            const order = yield this.query_member_order(member.member_id);
            const order_response = order.map((data) => {
                const arr_product = [];
                let product_id = data.product_id.split(',');
                if (product_id.length > 0) {
                    let product_name = data.product_name.split(',');
                    let product_content = data.product_content.split(',');
                    let price = data.price.split(',');
                    let product_status = data.product_status.split(',');
                    let store_id = data.store_id.split(',');
                    let product_image = data.product_image.split(',');
                    for (let i = 0; i < product_id.length; i++) {
                        const dd = {
                            product_id: product_id[i],
                            product_name: product_name[i],
                            product_content: product_content[i],
                            price: price[i],
                            product_status: product_status[i],
                            store_id: store_id[i],
                            product_image: product_image[i],
                        };
                        arr_product.push(dd);
                    }
                }
                return {
                    orderNumber: data.order_number,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    totalPrice: data.totalprice,
                    netprice: data.netprice,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    district: data.district,
                    subdistrict: data.subdistrict,
                    province: data.province,
                    code: data.code,
                    note: data.note,
                    isReview: data.isReview,
                    product: arr_product
                };
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                order: order_response
            });
        });
        this.OnGetOrderStore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const store = req.authStore;
            const orderss = yield this.query_store_order(store.store_id);
            const order_response = orderss.map((data) => {
                const arr_product = [];
                let product_id = data.product_id.split(',');
                if (product_id.length > 0) {
                    let product_name = data.product_name.split(',');
                    let product_content = data.product_content.split(',');
                    let price = data.price.split(',');
                    let product_status = data.product_status.split(',');
                    let product_image = data.product_image.split(',');
                    for (let i = 0; i < product_id.length; i++) {
                        const dd = {
                            product_id: product_id[i],
                            product_name: product_name[i],
                            product_content: product_content[i],
                            price: price[i],
                            product_status: product_status[i],
                            product_image: product_image[i],
                        };
                        arr_product.push(dd);
                    }
                }
                return {
                    orderNumber: data.order_number,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    totalPrice: data.totalprice,
                    netprice: data.netprice,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    district: data.district,
                    subdistrict: data.subdistrict,
                    province: data.province,
                    code: data.code,
                    note: data.note,
                    product: arr_product
                };
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                order: order_response
            });
        });
        this.OnGetOrderAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const store = req.authAdmin;
            const order = yield this.query_admin_order();
            const order_response = order.map((data) => {
                const arr_product = [];
                let product_id = data.product_id.split(',');
                if (product_id.length > 0) {
                    let product_name = data.product_name.split(',');
                    let product_content = data.product_content.split(',');
                    let price = data.price.split(',');
                    let product_status = data.product_status.split(',');
                    let product_image = data.product_image.split(',');
                    let recommend = data.recommend.split(',');
                    let preOrder = data.preOrder.split(',');
                    for (let i = 0; i < product_id.length; i++) {
                        const dd = {
                            product_id: product_id[i],
                            product_name: product_name[i],
                            product_content: product_content[i],
                            price: price[i],
                            product_status: product_status[i],
                            product_image: product_image[i],
                            recommend: recommend[i],
                            preOrder: preOrder[i]
                        };
                        arr_product.push(dd);
                    }
                }
                return {
                    orderNumber: data.order_number,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    totalPrice: data.totalprice,
                    netprice: data.netprice,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    district: data.district,
                    subdistrict: data.subdistrict,
                    province: data.province,
                    code: data.code,
                    note: data.note,
                    slip: data.slip,
                    isRead: data.isRead ? true : false,
                    product: arr_product
                };
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                order: order_response
            });
        });
        this.OnReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = req.authMember;
            const order = yield this.query_order_one(req.body.orderNumber, req.body.productId);
            if (!order) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'order was not found.'
                });
            }
            if (order.status_product != 'success') {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'product has delivery.'
                });
            }
            const t = yield database_1.sequelize.transaction();
            try {
                const review = yield review_1.Review.create({
                    member_id: member.member_id,
                    message: req.body.message,
                    product_id: order.product_id,
                    star: req.body.star,
                    display: 'yes',
                    store_id: order.store_id
                }, { transaction: t });
                const order_prod = yield ordersProduct_1.OrdersProduct.update({
                    status: 'accepted'
                }, {
                    where: {
                        order_number: order.order_number,
                        product_id: req.body.productId
                    }
                }, { transaction: t });
                const orders = yield orders_1.Orders.update({
                    status: 'success',
                    isReview: true
                }, {
                    where: {
                        order_number: order.order_number,
                    }
                }, { transaction: t });
                yield t.commit();
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'order has been review.'
                });
            }
            catch (error) {
                yield t.rollback();
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnUpdatePaymentStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield orders_1.Orders.findOne({ where: { order_number: req.body.orderNumber } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'order was not found.'
                });
            }
            try {
                finding.payment_status = req.body.status;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'payment status was updated.'
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
        this.OnUpdateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield orders_1.Orders.findOne({ where: { order_number: req.body.orderNumber } });
                if (!finding) {
                    return res.status(404).json({
                        status: false,
                        message: 'error',
                        description: 'order was not found.'
                    });
                }
                finding.status = req.body.status;
                finding.message = req.body.message;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'order status was updated.'
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
        this.OnUpdateProductStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield ordersProduct_1.OrdersProduct.findOne({ where: { order_number: req.body.orderNumber, product_id: req.body.productId } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'product was not found.'
                });
            }
            try {
                finding.status = req.body.status;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'product status was updated.'
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
        this.OnUpdateGPInOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const productForSet = yield ordersProduct_1.OrdersProduct.findOne({ where: { order_number: req.body.orderNumber, product_id: req.body.productId } });
            const productAllInOrder = yield ordersProduct_1.OrdersProduct.findAll({ where: { order_number: req.body.orderNumber } });
            const orders = yield orders_1.Orders.findOne({ where: { order_number: req.body.orderNumber } });
            if (!productForSet || !orders) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'order was not found.'
                });
            }
            try {
                let totalPrice = 0;
                let netPrice = 0;
                productAllInOrder.forEach((data) => {
                    totalPrice += data.price;
                    netPrice += data.price * (1 - data.gross_profit / 100);
                });
                productForSet.gross_profit = parseInt(req.body.gp);
                productForSet.save();
                orders.totalprice = totalPrice;
                orders.netprice = netPrice;
                orders.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'order GP was updated.'
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
        this.OnReadOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield orders_1.Orders.findOne({ where: { order_number: req.params.number } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'order was not found.'
                });
            }
            finding.isRead = true;
            finding.save();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'order was readed.'
            });
        });
    }
}
exports.OrderController = OrderController;
