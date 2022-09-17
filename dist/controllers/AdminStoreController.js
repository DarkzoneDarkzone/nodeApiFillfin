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
exports.AdminStoreController = void 0;
const postImage_1 = require("./../models/postImage");
const post_1 = require("./../models/post");
const productImage_1 = require("./../models/productImage");
const product_1 = require("./../models/product");
const View_service_1 = require("./../services/View.service");
const review_1 = require("./../models/review");
const viewProduct_1 = require("./../models/viewProduct");
const database_1 = require("./../util/database");
const sequelize_1 = require("sequelize");
const store_1 = require("./../models/store");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
class AdminStoreController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnCreateProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const store_profile = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
            if (!store_profile) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store was not found.'
                });
            }
            const product_str = store_profile.id + Math.random().toString().substr(2, 10) + (0, moment_1.default)().unix();
            const product_code = yield bcrypt_1.default.hash(product_str, 10);
            const prod_most_prior = yield product_1.Product.findOne({
                where: { store_id: store_profile.id, pre_order: 'no', status: 'active' },
                order: [
                    ['priority', 'DESC']
                ]
            });
            const t = yield database_1.sequelize.transaction();
            try {
                const product_result = yield product_1.Product.create({
                    product_code: product_code.replace(/\W/g, ""),
                    name_member: req.body.name_member,
                    content_member: req.body.content_member,
                    name_premium: req.body.name_premium,
                    content_premium: req.body.content_premium,
                    price_standard: parseInt(req.body.price_standard),
                    price_premium: parseInt(req.body.price_premium),
                    recommend: "no",
                    pre_order: "no",
                    status: 'active',
                    sex: store_profile.gender,
                    clip: req.body.clip,
                    store_id: store_profile.id,
                    priority: (prod_most_prior) ? prod_most_prior.priority + 1 : 0
                }, { transaction: t });
                let productImage = [];
                let count = 0;
                if (req.files.standard) {
                    for (const file of req.files.standard) {
                        let upload = "/uploads" + file.destination.split("uploads").pop();
                        let dest = file.destination;
                        var ext = path_1.default.extname(file.originalname);
                        let originalname = path_1.default.basename(file.originalname, ext);
                        for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                            originalname = originalname.split('(')[0];
                            originalname += '(' + i + ')';
                        }
                        const image = yield sharp(file.path)
                            .resize(500, 500)
                            .withMetadata()
                            .jpeg({ quality: 95 })
                            .toFile(path_1.default.resolve(file.destination, originalname + ext))
                            .then((data) => {
                            fs_1.default.unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return upload + originalname + ext;
                        });
                        const arr = {
                            product_id: product_result.id,
                            path_img: image,
                            hover: (count == 1) ? "yes" : "no",
                            display: "yes",
                            premium: "no",
                            member_type: ''
                        };
                        count++;
                        productImage.push(arr);
                    }
                }
                if (req.files.premium) {
                    for (const file of req.files.premium) {
                        let upload = "/uploads" + file.destination.split("uploads").pop();
                        let dest = file.destination;
                        var ext = path_1.default.extname(file.originalname);
                        let originalname = path_1.default.basename(file.originalname, ext);
                        for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                            originalname = originalname.split('(')[0];
                            originalname += '(' + i + ')';
                        }
                        const image = yield sharp(file.path)
                            .resize(500, 500)
                            .withMetadata()
                            .jpeg({ quality: 95 })
                            .toFile(path_1.default.resolve(file.destination, originalname + ext))
                            .then((data) => {
                            fs_1.default.unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return upload + originalname + ext;
                        });
                        const arr = {
                            product_id: product_result.id,
                            path_img: image,
                            hover: "no",
                            display: "yes",
                            premium: "yes",
                            member_type: ''
                        };
                        count++;
                        productImage.push(arr);
                    }
                }
                const product_image = yield productImage_1.ProductImage.bulkCreate(productImage, { transaction: t });
                yield t.commit();
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.'
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
        this.OnCreateProductPre = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const store_profile = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
            if (!store_profile) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store was not found.'
                });
            }
            const product_str = store_profile.id + Math.random().toString().substr(2, 10) + (0, moment_1.default)().unix();
            const product_code = yield bcrypt_1.default.hash(product_str, 10);
            const prod_most_prior = yield product_1.Product.findOne({
                where: { store_id: store_profile.id, pre_order: 'yes', status: 'active' },
                order: [
                    ['priority', 'DESC']
                ]
            });
            const t = yield database_1.sequelize.transaction();
            try {
                const product_result = yield product_1.Product.create({
                    product_code: product_code.replace(/\W/g, ""),
                    name_member: '',
                    content_member: '',
                    name_premium: req.body.name_premium,
                    content_premium: req.body.content_premium,
                    price_standard: parseInt(req.body.price_premium),
                    price_premium: parseInt(req.body.price_premium),
                    recommend: "no",
                    pre_order: "yes",
                    status: 'active',
                    sex: store_profile.gender,
                    clip: req.body.clip,
                    store_id: store_profile.id,
                    priority: (prod_most_prior) ? prod_most_prior.priority + 1 : 0
                }, { transaction: t });
                let productImage = [];
                if (req.files.premium) {
                    for (const file of req.files.premium) {
                        let upload = "/uploads" + file.destination.split("uploads").pop();
                        let dest = file.destination;
                        var ext = path_1.default.extname(file.originalname);
                        let originalname = path_1.default.basename(file.originalname, ext);
                        for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                            originalname = originalname.split('(')[0];
                            originalname += '(' + i + ')';
                        }
                        const image = yield sharp(file.path)
                            .resize(500, 500)
                            .withMetadata()
                            .jpeg({ quality: 95 })
                            .toFile(path_1.default.resolve(file.destination, originalname + ext))
                            .then((data) => {
                            fs_1.default.unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return upload + originalname + ext;
                        });
                        const arr = {
                            product_id: product_result.id,
                            path_img: image,
                            hover: "no",
                            display: "yes",
                            premium: "yes",
                            member_type: ''
                        };
                        productImage.push(arr);
                    }
                }
                const product_image = yield productImage_1.ProductImage.bulkCreate(productImage, { transaction: t });
                yield t.commit();
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.'
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
        this.OnCreatePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const store = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
            if (!store) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store was not found.'
                });
            }
            const all_post = yield post_1.Post.findAll({ where: { store_id: store.id, status: 'active' } });
            if (all_post.length > 10) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'your post has limited.'
                });
            }
            const t = yield database_1.sequelize.transaction();
            try {
                const str_post_code = `${store.code}${(0, moment_1.default)().format('YYYYMMDDHHmmss')}`;
                let post_code = yield bcrypt_1.default.hash(str_post_code, 10);
                const post = yield post_1.Post.create({
                    post_code: post_code.replace(/\W/g, ""),
                    store_id: store.id,
                    display: "yes",
                    caption: req.body.caption,
                    status: "active"
                }, { transaction: t });
                let postImage = [];
                if (req.files) {
                    let count = 0;
                    for (const file of req.files) {
                        let upload = "/uploads" + file.destination.split("uploads").pop();
                        let dest = file.destination;
                        var ext = path_1.default.extname(file.originalname);
                        let originalname = path_1.default.basename(file.originalname, ext);
                        for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                            originalname = originalname.split('(')[0];
                            originalname += '(' + i + ')';
                        }
                        const image = yield sharp(file.path)
                            .resize(500, 500)
                            .withMetadata()
                            .jpeg({ quality: 95 })
                            .toFile(path_1.default.resolve(file.destination, originalname + ext))
                            .then((data) => {
                            fs_1.default.unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return upload + originalname + ext;
                        });
                        const arr = {
                            post_id: post.id,
                            path_image: image,
                            priority: count++
                        };
                        postImage.push(arr);
                    }
                }
                const post_image = yield postImage_1.PostImage.bulkCreate(postImage, { transaction: t });
                yield t.commit();
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.'
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
        this.OnUpdateConcept = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const store = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
            if (!store) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store was not found.'
                });
            }
            try {
                store.concept = req.body.concept;
                store.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'concept was updated.'
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
        this.OnSetProductRecommend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const product = yield product_1.Product.findOne({ where: { product_code: req.body.productCode } });
            try {
                product.recommend = req.body.recommend;
                product.save();
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
        this.OnSetProductPriority = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const product = yield product_1.Product.findOne({ where: { product_code: req.body.productCode } });
            try {
                const updateAds = yield product_1.Product.update({
                    priority: database_1.sequelize.literal('priority + 1'),
                }, {
                    where: {
                        store_id: product.store_id,
                        pre_order: product.pre_order,
                        priority: { [sequelize_1.Op.gte]: req.body.priority },
                        status: 'active'
                    }
                });
                product.priority = req.body.priority;
                product.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'product was updated.'
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
        this.OnGetStoreDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const adminToken = req.adminToken;
            const store = yield store_1.Store.findOne({
                where: { store_code: req.params.code },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'access_token', 'refresh_token']
                },
            });
            if (!store) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store was not found.'
                });
            }
            const product = yield viewProduct_1.ViewProduct.findAll({
                where: {
                    package_id: "PACKAGE_EXCLUSIVE",
                    store_id: store.id,
                    status: 'active'
                },
                attributes: ['product_code', 'name_member', 'content_member', 'name_premium', 'content_premium', 'price_standard', 'price_premium', 'recommend', 'pre_order',
                    'status', 'sex', 'clip', 'store_id', 'path_img', 'package_id', 'buy_limit', 'show_gift', 'price_sell', 'createdAt', 'priority',
                    [database_1.sequelize.fn('GROUP_CONCAT', database_1.sequelize.col('path_img')), 'product_img']
                ],
                group: ['store_id', 'id'],
                order: [
                    ['priority', 'ASC']
                ]
            });
            const review = yield review_1.Review.findAll({
                where: { store_id: store.id },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            const store_post = yield this.query_store_post(store.id);
            let arr_product = [];
            let arr_product_pre = [];
            product.forEach((data) => {
                const arr_data = {
                    product_code: data.product_code,
                    name: data.name_premium,
                    content_product: data.content_premium,
                    price: data.price_premium,
                    recommend: data.recommend,
                    sex: data.sex,
                    clip: data.clip,
                    show_gift: data.show_gift,
                    preOrder: data.pre_order,
                    product_img: data.product_img,
                    priority: data.priority
                };
                if (data.pre_order == "no") {
                    arr_product.push(arr_data);
                }
                else {
                    arr_product_pre.push(arr_data);
                }
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: {
                    store_detail: store,
                    all_product: arr_product,
                    pre_order: arr_product_pre,
                    store_post: store_post,
                    review: review
                }
            });
        });
    }
}
exports.AdminStoreController = AdminStoreController;
