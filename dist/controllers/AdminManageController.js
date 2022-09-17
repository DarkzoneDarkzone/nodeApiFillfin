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
exports.AdminManageController = void 0;
const tokenLog_1 = require("./../models/tokenLog");
const settings_1 = require("./../models/settings");
const store_1 = require("./../models/store");
const members_1 = require("./../models/members");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sharp = require('sharp');
const express_validator_1 = require("express-validator");
const users_1 = require("../models/users");
const log_1 = require("../models/log");
class AdminManageController {
    constructor() {
        this.OnChangePasswordMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield members_1.Members.findOne({ where: { member_code: req.body.memberCode } });
                finding.password = req.body.newPassword;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'passsword was changed.'
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
        this.OnChangePasswordStore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
                finding.password = yield bcrypt_1.default.hash(req.body.newPassword, 10);
                finding.save();
                const findingMember = yield members_1.Members.findOne({ where: { username: finding.username } });
                findingMember.password = req.body.newPassword;
                findingMember.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'passsword was changed.'
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
        this.OnChangePasswordAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield users_1.User.findOne({ where: { users_code: req.body.adminCode } });
                // if(finding.permission !== 1){
                //     return res.status(405).json({
                //         status: false,
                //         message: 'error',
                //         description: "Don't have permission"
                //     })
                // }
                finding.password = yield bcrypt_1.default.hash(req.body.newPassword, 10);
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'passsword was changed.'
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
        this.OnSetGrossProfit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield settings_1.Settings.findOne({ where: { setting_name: 'gross_profit' } });
                finding.setting_value = req.body.gp;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'set gp success.'
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
        this.OnGetLogSignin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield log_1.Log.findAll();
            const filtered = finding.map((data) => {
                return {
                    adminCode: data.user_code,
                    ipAddress: data.ip_address,
                    section: data.section,
                    details: data.details,
                    status: data.status,
                    dateSignin: data.createdAt
                };
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                log: filtered
            });
        });
        this.OnChangeStatusLog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield log_1.Log.findOne({ where: { user_code: req.body.adminCode } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'admin was not found.'
                });
            }
            try {
                if (req.body.status === 'banned') {
                    const token = yield tokenLog_1.TokenLog.findOne({ where: { refresh_token: finding.refresh_token } });
                    if (token) {
                        token.active = false;
                        token.save();
                    }
                }
                finding.status = req.body.status;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'admin status was changed.'
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
        this.OnGetDataSettings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield settings_1.Settings.findAll();
            const filtered = finding.map((data) => {
                return {
                    settingName: data.setting_name,
                    settingValue: data.setting_value,
                    display: data.display
                };
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                setting: filtered
            });
        });
        this.OnUpdateSettings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield settings_1.Settings.findOne({ where: { setting_name: req.body.settingName } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
            try {
                finding.setting_value = req.body.settingValue;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'update value success.'
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
exports.AdminManageController = AdminManageController;
