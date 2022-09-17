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
exports.PackageController = void 0;
const database_1 = require("./../util/database");
const members_1 = require("./../models/members");
const Package_service_1 = require("./../services/Package.service");
const packagePayment_1 = require("./../models/packagePayment");
const package_1 = require("./../models/package");
const packageOrder_1 = require("../models/packageOrder");
const moment_1 = __importDefault(require("moment"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
class PackageController extends Package_service_1.PackageService {
    constructor() {
        super(...arguments);
        this.OnGetPackageAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield package_1.Package.findAll();
            let arr_package = [];
            finding.forEach((data) => {
                const newArr = {
                    pack_id: data.pack_id,
                    package_id: data.package_id,
                    name: data.name,
                    image: data.image,
                    content: data.content,
                    price: data.price,
                    grossProfit: data.gross_profit,
                    day: data.day,
                    gender: data.gender,
                };
                arr_package.push(newArr);
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: arr_package
            });
        });
        this.OnGetPackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
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
            const finding = yield package_1.Package.findOne({ where: { package_id: req.body.packageId, gender: member.gender } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'package was not found.'
                });
            }
            const data_response = {
                packageId: finding.package_id,
                packageName: finding.name,
                day: finding.day,
                packageImage: finding.image,
                price: finding.price,
                username: member.username,
                password: member.password
            };
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get package success.',
                package: data_response
            });
        });
        this.OnCheckPackageMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = yield members_1.Members.findOne({ where: { member_code: req.params.code } });
            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            const member_package = yield this.view_member_package(member.id, member.gender);
            if (member_package) {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'get data success.',
                    package: member_package
                });
            }
            else {
                return res.status(200).json({
                    status: false,
                    message: 'error',
                    description: "don't have package."
                });
            }
        });
        this.OnCreatePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
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
            const package_select = yield package_1.Package.findOne({ where: { package_id: req.body.packageId } });
            if (!package_select) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'package was not found.'
                });
            }
            const begin = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            const expire = (0, moment_1.default)(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss');
            const t = yield database_1.sequelize.transaction();
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
                const pack_order = yield packageOrder_1.PackageOrder.create({
                    package_id: req.body.packageId,
                    begin: begin,
                    expire: expire,
                    status_expire: "no",
                    status_confirm: "pending",
                    status_payment: "pending",
                    member_id: member.id,
                    gender: member.gender
                }, { transaction: t });
                const pack_payment = yield packagePayment_1.PackagePayment.create({
                    package_order_id: pack_order.pack_order_id,
                    slip: slip,
                    status_confirm: 'pending',
                    user_confirm: 0,
                    bank_ref: req.body.bankRef
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
        this.OnRenewalPackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const authMember = req.authMember;
            const member = yield members_1.Members.findOne({ where: { id: authMember.member_id } });
            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            const member_package = yield this.view_member_package(member.id, member.gender);
            if (member_package.isStore == "yes") {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'you are store cannot renewal.'
                });
            }
            const package_select = yield package_1.Package.findOne({ where: { package_id: member_package.package_id } });
            const begin = member_package.begin;
            const expire = (0, moment_1.default)(member_package.expire).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss');
            const t = yield database_1.sequelize.transaction();
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
                const pack_order = yield packageOrder_1.PackageOrder.create({
                    package_id: member_package.package_id,
                    begin: begin,
                    expire: expire,
                    status_expire: "no",
                    status_confirm: "pending",
                    status_payment: "pending",
                    member_id: member.id,
                    gender: member.gender
                }, { transaction: t });
                const pack_payment = yield packagePayment_1.PackagePayment.create({
                    package_order_id: pack_order.pack_order_id,
                    slip: slip,
                    status_confirm: 'pending',
                    user_confirm: 0,
                    bank_ref: req.body.bankRef
                }, { transaction: t });
                yield t.commit();
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'order package was created.'
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
        this.OnConfirmPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const admin = req.authAdmin;
            const payment = yield packagePayment_1.PackagePayment.findOne({ where: { package_order_id: req.params.paymentId } });
            if (!payment) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'data was not found.'
                });
            }
            const order = yield packageOrder_1.PackageOrder.findOne({ where: { pack_order_id: req.params.paymentId } });
            if (!order) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'data was not found.'
                });
            }
            const package_select = yield package_1.Package.findOne({ where: { package_id: order.package_id } });
            const begin = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            let expire = (0, moment_1.default)(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss');
            try {
                const last_package = yield packageOrder_1.PackageOrder.findOne({ where: { member_id: order.member_id, status_expire: 'no', status_confirm: 'confirm', status_payment: 'confirm' } });
                if (last_package) {
                    expire = (0, moment_1.default)(last_package.expire).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss');
                    last_package.status_expire = 'yes';
                    last_package.save();
                }
                payment.status_confirm = "confirm";
                payment.user_confirm = admin.user_id;
                payment.save();
                order.begin = last_package ? last_package.begin : begin;
                order.expire = expire;
                order.status_expire = "no";
                order.status_confirm = "confirm";
                order.status_payment = "confirm";
                order.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'confirm payment success.'
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: false,
                    message: ' error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnGetMemberPackageOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield this.query_package_order();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                order: finding
            });
        });
        this.OnUpdatePackage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const package_result = yield package_1.Package.findOne({ where: { pack_id: req.body.packageId } });
            if (!package_result) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'package was not found.'
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
                    package_result.image = image;
                }
                package_result.day = req.body.day;
                package_result.content = req.body.content;
                package_result.price = req.body.price;
                package_result.gross_profit = req.body.grossProfit;
                package_result.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'package was updated.'
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
        this.OnCheckStatusPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const member = yield members_1.Members.findOne({ where: { member_code: req.params.member_code } });
            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            const payment = yield packageOrder_1.PackageOrder.findOne({ where: { member_id: member.id, status_expire: 'no' } });
            let statusPay;
            if (payment) {
                statusPay = payment.status_payment;
            }
            const member_package = yield this.view_member_package(member.id, member.gender);
            if (member_package) {
                if (member_package.isStore == "yes") {
                    statusPay = "success";
                }
            }
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get status success.',
                statusPay: statusPay
            });
        });
    }
}
exports.PackageController = PackageController;
