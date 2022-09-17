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
const tokenLog_1 = require("./../models/tokenLog");
const packageOrder_1 = require("./../models/packageOrder");
const database_1 = require("./../util/database");
const View_service_1 = require("./../services/View.service");
const members_1 = require("./../models/members");
const jwt = __importStar(require("jsonwebtoken"));
const Config = __importStar(require("../util/config"));
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const log_1 = require("../models/log");
class MembersController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnGetAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /* finding data */
            const finding = yield members_1.Members.findAll({ order: [['createdAt', 'DESC']] });
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
            /** check user  */
            const finding = yield members_1.Members.findOne({ where: { username: req.body.username } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            if (finding.statusMember !== 'active') {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'member was not active.'
                });
            }
            /** check password */
            if (!(req.body.password == finding.password)) {
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'password was not correct.'
                });
            }
            const package_sel = yield packageOrder_1.PackageOrder.findOne({ where: { member_id: finding.id, status_confirm: 'pending', status_payment: 'pending' } });
            const current_package = yield this.view_member_package(finding.id, finding.gender);
            try {
                /* generate new access_token */
                const access_token = jwt.sign({
                    member_id: finding.id,
                    section: 'member',
                    username: finding.username,
                    gender: finding.gender,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '30m' });
                const refresh_token = jwt.sign({
                    username: finding.username,
                    gender: finding.gender,
                    section: 'member',
                    at: new Date().getTime(),
                    token: access_token
                }, `${Config.secretKey}`);
                finding.access_token = access_token;
                finding.refresh_token = refresh_token;
                finding.save();
                const userAgent = req.headers['user-agent'];
                const logging = yield log_1.Log.create({
                    user_code: finding.member_code,
                    refresh_token: refresh_token,
                    details: userAgent,
                    ip_address: req.ip,
                    section: 'member',
                    status: 'active',
                });
                const tokenLogging = yield tokenLog_1.TokenLog.create({
                    refresh_token: refresh_token,
                    reset_token: "",
                    section: 'member',
                    active: true,
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'password is checked.',
                    data: {
                        access_token: finding.access_token,
                        refresh_token: finding.refresh_token,
                        member_code: finding.member_code,
                        gender: finding.gender,
                        userName: finding.username,
                        packageId: (package_sel) ? package_sel.package_id : null,
                        dateExpire: current_package ? current_package.expire : null
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
            }, `${Config.secretKey}`, { expiresIn: '10m' });
            /* generate refresh_token when register and no expire */
            const refresh_token = jwt.sign({
                username: req.body.username,
                gender: req.body.gender,
                at: new Date().getTime(),
                token: access_token
            }, `${Config.secretKey}`);
            /** generate member_code */
            const str_member_code = `${req.body.username}.${req.body.password}${(0, moment_1.default)().format('YYYYMMDDHHmmss')}`;
            let member_code = yield bcrypt_1.default.hash(str_member_code, 10);
            const t = yield database_1.sequelize.transaction();
            try {
                /** create member */
                const user = yield members_1.Members.create({
                    member_code: member_code.replace(/\W/g, ""),
                    access_token: access_token,
                    refresh_token: refresh_token,
                    username: req.body.username,
                    gender: req.body.gender,
                    password: req.body.password,
                    isStore: 'no',
                    statusMember: 'active'
                }, { transaction: t });
                yield t.commit();
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.',
                    memberCode: user.member_code
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
        this.OnUpdate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            /* finding username multiple */
            const finding = yield members_1.Members.findOne({ where: { username: req.body.username } });
            if (finding) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'username has been used.'
                });
            }
            try {
                finding.username = req.body.username,
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
        this.OnGetAccessToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield members_1.Members.findOne({ where: { refresh_token: req.body.token } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member is not found.'
                });
            }
            const token = yield tokenLog_1.TokenLog.findOne({ where: { refresh_token: finding.refresh_token } });
            if (!token.active) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'token has been revoked.'
                });
            }
            try {
                /* generate new access_token */
                const access_token = jwt.sign({
                    member_id: finding.id,
                    section: (finding.isStore == "yes") ? 'store' : 'member',
                    username: finding.username,
                    gender: finding.gender,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '30m' });
                finding.access_token = access_token;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'generated new access token.',
                    token: access_token
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
            try {
                const accessToken = yield jwt.verify(access_token, `${Config.secretKey}`);
                if ((0, moment_1.default)().unix() > accessToken.exp) {
                    return res.status(401).json({
                        status: false,
                        message: 'error',
                        description: 'token was expired.'
                    });
                }
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
        });
        this.OnChangeStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    messageL: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = yield members_1.Members.findOne({ where: { member_code: req.body.memberCode } });
            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            try {
                member.statusMember = req.body.status;
                member.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'status was changed.'
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
        this.OnDeleteMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield members_1.Members.findOne({ where: { member_code: req.params.code } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            try {
                finding.destroy();
                return res.status(200).json({
                    status: false,
                    message: 'ok',
                    description: 'member was deleted.'
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
exports.MembersController = MembersController;
