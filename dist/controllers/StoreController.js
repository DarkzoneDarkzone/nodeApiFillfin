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
const store_1 = require("./../models/store");
const Config = __importStar(require("../util/config"));
require("moment/locale/th");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const jwt = __importStar(require("jsonwebtoken"));
class StoreController {
    constructor() {
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
            if (!finding) {
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
            }, `${Config.secretKey}`, { expiresIn: '1d' });
            /* generate refresh_token when register and no expire */
            const refresh_token = jwt.sign({
                username: req.body.username,
                gender: req.body.gender,
                at: new Date().getTime(),
                token: access_token
            }, `${Config.secretKey}`);
            const store_str = req.body.username + req.body.gender + Math.random().toString().substr(2, 8) + (0, moment_1.default)().unix();
            const store_code = yield bcrypt_1.default.hash(store_str, 10);
            const hashPass = yield bcrypt_1.default.hash(req.body.password, 10);
            try {
                let profile_img = "";
                if (req.file) {
                    let upload = "uploads" + req.file.destination.split("uploads").pop();
                    let dest = req.file.destination;
                    var ext = path_1.default.extname(req.file.originalname);
                    let originalname = path_1.default.basename(req.file.originalname, ext);
                    for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                        originalname = originalname.split('(')[0];
                        originalname += '(' + i + ')';
                    }
                    const image = yield sharp(req.file.path)
                        .resize(200, 200)
                        .withMetadata()
                        .jpeg({ quality: 95 })
                        .toFile(path_1.default.resolve(req.file.destination, originalname + ext))
                        .then((data) => {
                        fs_1.default.unlink(req.file.path, (err) => {
                            console.log(err);
                        });
                        return upload + originalname + ext;
                    });
                    let profile_img = image;
                }
                const result = yield store_1.Store.create({
                    store_code: store_code,
                    name: req.body.name,
                    username: req.body.username,
                    password: hashPass,
                    age: req.body.age,
                    profile_img: profile_img
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
            if (!(req.body.password == finding.password)) {
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'password was incorrect.'
                });
            }
            try {
                /* generate access_token for user */
                const access_token = jwt.sign({
                    store_code: finding.store_code,
                    username: finding.username,
                    gender: finding.gender,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '1d' });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'login success.',
                    data: {
                        access_token: access_token
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
            const finding = yield store_1.Store.findOne({ where: { store_code: req.params.store_code } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store is not found.'
                });
            }
            try {
                if (req.file) {
                    let upload = "uploads" + req.file.destination.split("uploads").pop();
                    let dest = req.file.destination;
                    var ext = path_1.default.extname(req.file.originalname);
                    let originalname = path_1.default.basename(req.file.originalname, ext);
                    for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                        originalname = originalname.split('(')[0];
                        originalname += '(' + i + ')';
                    }
                    const image = yield sharp(req.file.path)
                        .resize(200, 200)
                        .withMetadata()
                        .jpeg({ quality: 95 })
                        .toFile(path_1.default.resolve(req.file.destination, originalname + ext))
                        .then((data) => {
                        fs_1.default.unlink(req.file.path, (err) => {
                            console.log(err);
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
    }
}
exports.StoreController = StoreController;
