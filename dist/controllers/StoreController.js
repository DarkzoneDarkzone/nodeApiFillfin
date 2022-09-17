"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.StoreController = void 0;
const tokenLog_1 = require("./../models/tokenLog");
const log_1 = require("./../models/log");
const View_service_1 = require("./../services/View.service");
const review_1 = require("./../models/review");
const viewProduct_1 = require("./../models/viewProduct");
const members_1 = require("./../models/members");
const database_1 = require("./../util/database");
const store_1 = require("./../models/store");
const Config = __importStar(require("../util/config"));
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const jwt = __importStar(require("jsonwebtoken"));
class StoreController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield store_1.Store.findOne({ where: { username: req.body.username } });
            const finding_member = yield members_1.Members.findOne({ where: { username: req.body.username } });
            if (finding || finding_member) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'username already used.'
                });
            }
            /* generate access_token for user */
            const access_token = jwt.sign({
                username: req.body.username,
                gender: req.body.gender,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '10m' });
            /* generate refresh_token when register and no expire */
            const refresh_token = jwt.sign({
                username: req.body.username,
                gender: req.body.gender,
                at: new Date().getTime(),
                token: access_token
            }, `${Config.secretKey}`);
            const store_str = req.body.username + req.body.gender + Math.random().toString().substr(2, 8) + (0, moment_1.default)().unix();
            const store_code = yield bcrypt_1.default.hash(store_str, 10);
            const store_member_code = yield bcrypt_1.default.hash(store_code, 10);
            const hashPass = yield bcrypt_1.default.hash(req.body.password, 10);
            const t = yield database_1.sequelize.transaction();
            try {
                let profile_img = "";
                if (req.file) {
                    let upload = "/uploads" + req.file.destination.split("uploads").pop();
                    let dest = req.file.destination;
                    var ext = path_1.default.extname(req.file.originalname);
                    let originalname = path_1.default.basename(req.file.originalname, ext);
                    for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                        originalname = originalname.split('(')[0];
                        originalname += '(' + i + ')';
                    }
                    const image = yield sharp(req.file.path)
                        .resize(500, 500)
                        .withMetadata()
                        .jpeg({ quality: 95 })
                        .toFile(path_1.default.resolve(req.file.destination, originalname + ext))
                        .then((data) => {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        return upload + originalname + ext;
                    });
                    profile_img = image;
                }
                const result = yield store_1.Store.create({
                    store_code: store_code.replace(/\W/g, ""),
                    access_token: access_token,
                    refresh_token: refresh_token,
                    name: req.body.name,
                    username: req.body.username,
                    password: hashPass,
                    age: req.body.age,
                    profile_img: profile_img,
                    profile_video: '',
                    concept: '',
                    weight: '',
                    height: '',
                    bwh: '',
                    gender: req.body.gender,
                    status: 'inactive'
                }, { transaction: t });
                const store_member = yield members_1.Members.create({
                    member_code: store_member_code.replace(/\W/g, ""),
                    access_token: '',
                    refresh_token: refresh_token,
                    username: req.body.username,
                    password: req.body.password,
                    gender: req.body.gender,
                    isStore: 'yes',
                    statusMember: 'active'
                }, { transaction: t });
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
        this.OnSingin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array
                });
            }
            const finding = yield store_1.Store.findOne({ where: { username: req.body.username } });
            if (!finding) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'user was not found.'
                });
            }
            // if(finding.status !== 'active'){
            //     return res.status(400).json({
            //         status: false,
            //         message: 'error',
            //         description: 'wait admin to verify.'
            //     })
            // }
            const isPasswordCorrect = yield bcrypt_1.default.compare(req.body.password, finding.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'password was incorrect.'
                });
            }
            try {
                /* generate access_token for user */
                const access_token = jwt.sign({
                    store_id: finding.id,
                    section: 'store',
                    store_code: finding.store_code,
                    username: finding.username,
                    gender: finding.gender,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '10m' });
                const refresh_token = jwt.sign({
                    username: finding.username,
                    gender: finding.gender,
                    section: 'store',
                    at: new Date().getTime(),
                    token: access_token
                }, `${Config.secretKey}`);
                finding.access_token = access_token;
                finding.refresh_token = refresh_token;
                finding.save();
                const ip = req.ip.split(':')[3];
                const userAgent = req.headers['user-agent'];
                const logging = yield log_1.Log.create({
                    user_code: finding.store_code,
                    refresh_token: refresh_token,
                    details: userAgent,
                    ip_address: ip,
                    section: 'store',
                    status: 'active',
                });
                const tokenLogging = yield tokenLog_1.TokenLog.create({
                    refresh_token: refresh_token,
                    reset_token: '',
                    section: 'store',
                    active: true,
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'login success.',
                    data: {
                        access_token: access_token,
                        refresh_token: finding.refresh_token,
                        storeName: finding.name,
                        storeCode: finding.store_code,
                        gender: finding.gender
                    }
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
        this.OnUpdateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store is not found.'
                });
            }
            try {
                if (req.file) {
                    let upload = "/uploads" + req.file.destination.split("uploads").pop();
                    let dest = req.file.destination;
                    var ext = path_1.default.extname(req.file.originalname);
                    let originalname = path_1.default.basename(req.file.originalname, ext);
                    for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                        originalname = originalname.split('(')[0];
                        originalname += '(' + i + ')';
                    }
                    const image = yield sharp(req.file.path)
                        .resize(500, 500)
                        .withMetadata()
                        .jpeg({ quality: 95 })
                        .toFile(path_1.default.resolve(req.file.destination, originalname + ext))
                        .then((data) => {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        return upload + originalname + ext;
                    });
                    finding.profile_img = image;
                }
                finding.name = req.body.name,
                    finding.age = req.body.age,
                    finding.weight = req.body.weight,
                    finding.height = req.body.height,
                    finding.bwh = req.body.bwh,
                    finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'update data success.'
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
        this.OnGetDataAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const storeToken = req.authStore;
            const store = yield store_1.Store.findOne({
                where: { store_code: storeToken.store_code },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'access_token', 'store_code', 'refresh_token', 'username', 'password']
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
                    'status', 'sex', 'clip', 'store_id', 'path_img', 'package_id', 'buy_limit', 'show_gift', 'price_sell', 'createdAt',
                    [database_1.sequelize.fn('GROUP_CONCAT', database_1.sequelize.col('path_img')), 'product_img']
                ],
                group: ['store_id', 'id'],
                order: [
                    ['createdAt', 'DESC']
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
        this.OnUpdateConcept = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const store = req.authStore;
            try {
                const finding = yield store_1.Store.findOne({ where: { store_code: store.store_code } });
                finding.concept = req.body.concept;
                finding.save();
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
        this.OnGetStoreAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield store_1.Store.findAll({ where: { gender: req.query.gender } });
            const filter_data = finding.map((data) => {
                return {
                    storeCode: data.store_code,
                    name: data.name,
                    username: data.username,
                    password: data.password,
                    profileImg: data.profileImg,
                    profileVideo: data.profileVideo,
                    concept: data.concept,
                    age: data.age,
                    weight: data.weight,
                    height: data.height,
                    bwd: data.bwd,
                };
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get store success.',
                store: finding
            });
        });
        this.OnChangeStatusStore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield store_1.Store.update({
                status: req.body.status
            }, {
                where: { store_code: req.body.storeCode }
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'update store success.'
            });
        });
    }
}
exports.StoreController = StoreController;
