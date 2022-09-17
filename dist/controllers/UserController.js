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
exports.UserController = void 0;
const tokenLog_1 = require("./../models/tokenLog");
const log_1 = require("./../models/log");
const Config = __importStar(require("../util/config"));
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
const express_validator_1 = require("express-validator");
const jwt = __importStar(require("jsonwebtoken"));
const users_1 = require("../models/users");
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = require("../models/settings");
const hbs = require('nodemailer-express-handlebars');
class UserController {
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
            /** finding user */
            const finding = yield users_1.User.findOne({ where: { username: req.body.username } });
            if (finding) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'username has already used.'
                });
            }
            /* generate access_token for user */
            const access_token = jwt.sign({
                username: req.body.username,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '10m' });
            /* generate refresh_token when register and no expire */
            const refresh_token = jwt.sign({
                username: req.body.username,
                at: new Date().getTime(),
                token: access_token
            }, `${Config.secretKey}`);
            /** generate user_code */
            const users_str = req.body.username + Math.random().toString().substr(2, 8) + (0, moment_1.default)().unix();
            const users_code = yield bcrypt_1.default.hash(users_str, 10);
            /** hash password */
            const hashPass = yield bcrypt_1.default.hash(req.body.password, 10);
            try {
                let profile_img = '';
                /** upload image */
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
                /** create user */
                const users = yield users_1.User.create({
                    users_code: users_code.replace(/\W/g, ""),
                    access_token: access_token,
                    refresh_token: refresh_token,
                    username: req.body.username,
                    password: hashPass,
                    email: req.body.email,
                    profile_img: profile_img,
                    permission: 3,
                    status_confirm: 'pending',
                    display_name: req.body.name,
                    status: 'pending'
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
        this.OnGetAdminAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield users_1.User.findAll();
            const filtered = finding.map((data) => {
                return {
                    adminId: data.id,
                    adminCode: data.users_code,
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    permission: data.permission,
                    statusConfirm: data.status_confirm,
                    displayName: data.display_name,
                    profileImg: data.profile_img,
                    status: data.status,
                    createTime: data.createdAt
                };
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get user success.',
                admin: filtered
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
            /** find user */
            const finding = yield users_1.User.findOne({ where: { username: req.body.username } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'username was not found.'
                });
            }
            if (finding.status !== 'active') {
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'please contract admin to approve.'
                });
            }
            try {
                /** check password is correct */
                const isPasswordCorrect = yield bcrypt_1.default.compare(req.body.password, finding.password);
                if (!isPasswordCorrect) {
                    return res.status(401).json({
                        status: false,
                        message: 'error',
                        description: 'password was incorrect.'
                    });
                }
                /* generate access_token for user */
                const access_token = jwt.sign({
                    user_id: finding.id,
                    section: 'admin',
                    usercode: finding.users_code,
                    username: req.body.username,
                    psermission: finding.permission,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '10m' });
                /* generate refresh_token when register and no expire */
                const refresh_token = jwt.sign({
                    username: finding.username,
                    gender: finding.gender,
                    section: 'admin',
                    at: new Date().getTime(),
                    token: access_token
                }, `${Config.secretKey}`);
                /** update access_token and refresh_token */
                finding.access_token = access_token;
                finding.refresh_token = refresh_token;
                finding.save();
                // const ip = req.ip.split(':')[3]
                const userAgent = req.headers['user-agent'];
                const logging = yield log_1.Log.create({
                    user_code: finding.users_code,
                    refresh_token: refresh_token,
                    details: userAgent,
                    ip_address: req.ip,
                    section: 'admin',
                    status: 'active',
                });
                const tokenLogging = yield tokenLog_1.TokenLog.create({
                    refresh_token: refresh_token,
                    reset_token: '',
                    section: 'admin',
                    active: true,
                });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'password has checked.',
                    access_token: access_token,
                    refresh_token: refresh_token,
                    profileImg: finding.profile_img,
                    adminName: finding.display_name
                });
            }
            catch (error) {
                console.log(error);
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
                    errorMessage: errors.array()
                });
            }
            /** finding user */
            const finding = yield users_1.User.findOne({ where: { users_code: req.body.adminCode } });
            if (!finding) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'admin was not found.'
                });
            }
            try {
                /** upload image */
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
                /** update data user */
                finding.email = req.body.email;
                finding.permission = req.body.permission;
                finding.status_confirm = req.body.statusConfirm;
                finding.display_name = req.body.name;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'data was updated.'
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
        this.OnDelete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'erorr',
                    errorMessage: errors.array()
                });
            }
            /** find user account */
            const user = yield users_1.User.findOne({ where: { users_code: req.params.code } });
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'user was not found.'
                });
            }
            try {
                /** delete user account */
                user.destroy();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'data was deleted.'
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
            const finding = yield users_1.User.findOne({ where: { refresh_token: req.body.token } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'user was not found.'
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
                    user_id: finding.id,
                    section: 'admin',
                    usercode: finding.users_code,
                    username: finding.username,
                    at: new Date().getTime()
                }, `${Config.secretKey}`, { expiresIn: '10m' });
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
        this.OnChangeStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    messageL: 'error',
                    errorMessage: errors.array()
                });
            }
            const admin = yield users_1.User.findOne({ where: { users_code: req.body.adminCode } });
            if (!admin) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'admin was not found.'
                });
            }
            try {
                admin.status = req.body.status;
                admin.save();
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
        this.OnConfirmRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    messageL: 'error',
                    errorMessage: errors.array()
                });
            }
            const admin = yield users_1.User.findOne({ where: { users_code: req.body.adminCode } });
            if (!admin) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'admin was not found.'
                });
            }
            try {
                admin.status_confirm = "confirm";
                admin.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'confirm was changed.'
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
        this.OnResetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const mailSenderUser = yield settings_1.Settings.findOne({ where: { setting_name: 'email_user' } });
            const mailSenderPwd = yield settings_1.Settings.findOne({ where: { setting_name: 'email_password' } });
            var transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: mailSenderUser.setting_value,
                    pass: mailSenderPwd.setting_value
                }
            });
            // point to the template folder
            const handlebarOptions = {
                viewEngine: {
                    partialsDir: path_1.default.resolve('./dist/views/'),
                    defaultLayout: false,
                },
                viewPath: path_1.default.resolve('./dist/views/'),
            };
            // use a template file with nodemailer
            transporter.use('compile', hbs(handlebarOptions));
            const users_reset = Math.random().toString().substr(2, 8) + (0, moment_1.default)().unix();
            try {
                const finding = yield users_1.User.findOne({ where: { username: req.body.username } });
                if (!finding) {
                    return res.status(404).json({
                        status: false,
                        message: 'error',
                        description: 'admin was not found.'
                    });
                }
                const tokenLogging = yield tokenLog_1.TokenLog.create({
                    refresh_token: '',
                    reset_token: finding.users_code,
                    section: 'resetpassword',
                    active: true,
                });
                var mailOptions = {
                    from: '"Wynnsoft Support" <foo@example.com>',
                    to: req.body.email,
                    subject: "Reset password",
                    template: 'email',
                    context: {
                        name: finding.username,
                        company: 'Fillfiin',
                        linkUrl: `https://backoffice.fillfin.com/forgetPassword?token=${finding.users_code}`
                    }
                };
                // trigger the sending of the E-mail
                transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'sending mail success.'
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnCheckResetToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield tokenLog_1.TokenLog.findOne({ where: { reset_token: req.params.token, section: 'resetpassword' } });
                if (!finding) {
                    return res.status(400).json({
                        status: false,
                        message: 'error',
                        description: 'can not reset password.'
                    });
                }
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'reset token has correct.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong..'
                });
            }
        });
        this.OnUpdateNewPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield users_1.User.findOne({ where: { users_code: req.body.token } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'admin was not found.'
                });
            }
            try {
                const hashPass = yield bcrypt_1.default.hash(req.body.newPassword, 10);
                finding.password = hashPass;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'password has changed.'
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
exports.UserController = UserController;
