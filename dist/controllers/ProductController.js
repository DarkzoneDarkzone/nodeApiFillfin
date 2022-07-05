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
exports.ProductController = void 0;
const product_1 = require("./../models/product");
const review_1 = require("./../models/review");
const store_1 = require("./../models/store");
require("moment/locale/th");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const View_service_1 = require("../services/View.service");
class ProductController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnGetStoreAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const member = req.authMember;
            const gender = req.params.gender;
            let package_member = "PACKAGE_MEMBER";
            let member_package;
            if (member) {
                member_package = yield this.view_member_package(member.member_id, gender);
                if (member_package) {
                    package_member = member_package.package_id;
                }
            }
            const product_store = yield this.view_product_all_store(gender);
            const product_recom = yield this.view_product_recommend(package_member, gender);
            let arr_store = [];
            let arr_product = [];
            product_store.forEach((data) => {
                let name_product;
                let content_product;
                let price;
                if (package_member == "PACKAGE_MEMBER") {
                    name_product = data.name_member;
                    content_product = data.content_member;
                    price = data.price_standard;
                }
                else {
                    name_product = data.name_premium;
                    content_product = data.content_premium;
                    price = data.price_premium;
                }
                const arr_data = {
                    product_code: data.product_code,
                    name_product: name_product,
                    content_product: content_product,
                    price: price,
                    sex: data.sex,
                    store_id: data.store_id,
                    store_code: data.store_code,
                    store_name: data.store_name,
                    store_profile: data.store_profile,
                    store_concept: data.store_concept,
                    product_img: data.product_img,
                };
                arr_store.push(arr_data);
            });
            product_recom.forEach((data) => {
                let name_product;
                let content_product;
                let price;
                if (package_member == "PACKAGE_MEMBER") {
                    name_product = data.name_member;
                    content_product = data.content_member;
                    price = data.price_standard;
                }
                else {
                    name_product = data.name_premium;
                    content_product = data.content_premium;
                    price = data.price_premium;
                }
                const arr_data = {
                    product_code: data.product_code,
                    name_product: name_product,
                    content_product: content_product,
                    price: price,
                    sex: data.sex,
                    store_id: data.store_id,
                    store_name: data.store_name,
                    store_profile: data.store_profile,
                    store_concept: data.store_concept,
                    store_detail_limit: data.store_detail_limit,
                    product_img: data.product_img,
                };
                arr_product.push(arr_data);
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: {
                    store_all: arr_store,
                    product_recom: arr_product,
                    standard: (package_member == "PACKAGE_MEMBER") ? true : false
                }
            });
        });
        this.OnGetProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const member = req.authMember;
            const gender = req.params.gender;
            const store_code = req.params.store_code;
            const store = yield store_1.Store.findOne({ where: { store_code: store_code } });
            const review = yield review_1.Review.findAll({ where: { store_id: store.id } });
            const store_post = yield this.view_store_post(store.id);
            let package_member = "PACKAGE_MEMBER";
            let member_package;
            if (member) {
                member_package = yield this.view_member_package(member.member_id, gender);
                if (member_package) {
                    package_member = member_package.package_id;
                }
            }
            const product = yield this.view_product(package_member, gender, store.id);
            const preorder = yield this.view_product_preorder(package_member, gender, store.id);
            let arr_product = [];
            product.forEach((data) => {
                let name_product;
                let content_product;
                let price;
                if (package_member == "PACKAGE_MEMBER") {
                    name_product = data.name_member;
                    content_product = data.content_member;
                    price = data.price_standard;
                }
                else if (package_member == "PACKAGE_PREMIUM" || package_member == "PACKAGE_EXCLUSIVE") {
                    name_product = data.name_premium;
                    content_product = data.content_premium;
                    price = data.price_premium;
                }
                const arr_data = {
                    product_code: data.product_code,
                    name_product: name_product,
                    content_product: content_product,
                    price: price,
                    recommend: data.recommend,
                    sex: data.sex,
                    clip: data.clip,
                    store_id: data.store_id,
                    store_name: data.store_name,
                    store_profile: data.store_profile,
                    store_concept: data.store_concept,
                    buy_limit: data.buy_limit,
                    show_gift: data.show_gift,
                    store_detail_limit: data.store_detail_limit,
                    product_img: data.product_img,
                };
                arr_product.push(arr_data);
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: {
                    store_detail: store,
                    all_product: arr_product,
                    preorder: preorder,
                    store_post: store_post,
                    review: review
                }
            });
        });
        this.OnCreateProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const store = req.authStore;
            const product_str = store.store_id + Math.random().toString().substr(2, 10) + (0, moment_1.default)().unix();
            const product_code = yield bcrypt_1.default.hash(product_str, 10);
            try {
                const result = yield product_1.Product.create({
                    product_code: product_code,
                    name_member: req.body.name_member,
                    content_member: req.body.content_member,
                    name_premium: req.body.name_premium,
                    content_premium: req.body.content_premium,
                    price_standard: req.body.price_standard,
                    price_premium: req.body.price_premium,
                    recommend: "no",
                    pre_order: "no",
                    status: 'active',
                    sex: store.sex,
                    clip: req.body.clip,
                    store_id: store.store_id
                });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.'
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
    }
}
exports.ProductController = ProductController;
