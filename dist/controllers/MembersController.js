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
exports.MembersController = void 0;
const View_service_1 = require("./../services/View.service");
const packageOrder_1 = require("./../models/packageOrder");
const package_1 = require("./../models/package");
const members_1 = require("./../models/members");
const jwt = __importStar(require("jsonwebtoken"));
const Config = __importStar(require("../util/config"));
require("moment/locale/th");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
class MembersController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnGetAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /* finding data */
            const finding = yield members_1.Members.findAll();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: finding
            });
        });
        this.OnGetById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /* finding old data */
            const finding = yield members_1.Members.findOne({ where: { member_code: req.params.member_code } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member is not found.'
                });
            }
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: finding
            });
        });
        this.OnSignin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield members_1.Members.findOne({ where: { username: req.body.username } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            if (!(req.body.password == finding.password)) {
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'password was not correct.'
                });
            }
            try {
                /* generate new access_token */
                const access_token = jwt.sign({
                    member_id: finding.id,
                    username: finding.username,
                    gender: finding.gender,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '1d' });
                finding.access_token = access_token;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'password is checked.',
                    data: {
                        access_token: finding.access_token,
                        refresh_token: finding.refresh_token,
                        member_code: finding.member_code
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
        this.OnCreate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /* validate data before */
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            /* finding email multiple */
            const finding = yield members_1.Members.findOne({ where: { username: req.body.username } });
            if (finding) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'username has been used.'
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
            const str_member_code = `${req.body.username}.${req.body.password}${(0, moment_1.default)().format('YYYYMMDDHHmmss')}`;
            const member_code = yield bcrypt_1.default.hash(str_member_code, 10);
            const package_select = yield package_1.Package.findOne({ where: { package_id: req.body.package_id } });
            try {
                /* end upload image */
                const user = yield members_1.Members.create({
                    member_code: member_code,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    username: req.body.username,
                    gender: req.body.gender,
                    password: req.body.password,
                    isStore: 'no'
                });
                const begin = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
                // const expire = moment(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss')
                yield packageOrder_1.PackageOrder.create({
                    package_id: req.body.package_id,
                    begin: begin,
                    expire: begin,
                    status_expire: "no",
                    status_confirm: "pending",
                    status_payment: "pending",
                    member_id: user.id,
                    gender: user.gender
                });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.',
                    data: user.member_code
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
        this.OnGetAccessToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /* finding old data */
            const finding = yield members_1.Members.findOne({ where: { refresh_token: req.params.token } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member is not found.'
                });
            }
            try {
                /* generate new access_token */
                const access_token = jwt.sign({
                    username: finding.username,
                    gender: req.params.gender,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '1d' });
                finding.access_token = access_token;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'generated new access_token.',
                    data: access_token
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'Something went wrong.'
                });
            }
        });
        this.OnCheckAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const access_token = req.body.token;
            if (!access_token) {
                return res.status(401).json({
                    message: 'Not Authenticated.'
                });
            }
            /* receive bearer token from header */
            let decodedToken;
            /* if having token */
            if (access_token != '') {
                try {
                    /* verify token for get data and check expire token */
                    decodedToken = yield jwt.verify(access_token, `${Config.secretKey}`);
                    /* if token was expired */
                    if ((0, moment_1.default)().unix() > decodedToken.exp) {
                        return res.status(401).json({
                            status: false,
                            message: 'error',
                            description: 'token was expired.'
                        });
                    }
                    /* data keep for use when update data in database */
                    req.authToken = access_token;
                    return res.status(200).json({
                        status: true,
                        message: 'token is correct.'
                    });
                }
                catch (error) {
                    return res.status(401).json({
                        status: false,
                        message: 'error',
                        description: "authentication failed, token was expired!"
                    });
                }
            }
        });
    }
}
exports.MembersController = MembersController;
