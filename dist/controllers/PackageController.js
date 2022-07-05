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
const members_1 = require("./../models/members");
const Package_service_1 = require("./../services/Package.service");
const packagePayment_1 = require("./../models/packagePayment");
const package_1 = require("./../models/package");
const packageOrder_1 = require("../models/packageOrder");
require("moment/locale/th");
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
                    package_id: data.package_id,
                    name: data.name,
                    image: data.image,
                    content: data.content,
                    price: data.price,
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
        this.OnCreatePackageOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const package_order = yield package_1.Package.findOne({ where: { package_id: req.body.package_id } });
            const begin = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            const expire = (0, moment_1.default)(begin).add('days', package_order.day).format('YYYY-MM-DD HH:mm:ss');
            try {
                yield packageOrder_1.PackageOrder.create({
                    package_id: req.body.package_id,
                    begin: begin,
                    expire: expire,
                    status_expire: "no",
                    status_confirm: "pending",
                    status_payment: "pending",
                    member_id: req.body.member_id,
                    gender: req.body.gender
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
        this.OnCreatePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const package_order = yield packageOrder_1.PackageOrder.findOne({
                where: {
                    member_id: req.body.member_id,
                    status_confirm: 'pending',
                    status_payment: 'pending',
                    gender: req.body.gender
                }
            });
            try {
                let slip = '';
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
                    slip = image;
                }
                yield packagePayment_1.PackagePayment.create({
                    package_order_id: package_order.package_order_id,
                    slip: slip,
                    status_confirm: 'pending',
                    user_confirm: 0,
                    bank_ref: req.body.bank_id
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
        this.OnGetPackageOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const member = yield members_1.Members.findOne({ where: { member_code: req.params.member_code } });
            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: "member was not found."
                });
            }
            const finding = yield this.queryPackageOrderLast(member.id, member.gender);
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: "package was not found."
                });
            }
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: finding
            });
        });
        this.OnConfirmPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const admin
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const payment = yield packagePayment_1.PackagePayment.findOne({ where: { package_order_id: req.params.payment_id } });
            const order = yield packageOrder_1.PackageOrder.findOne({ where: { package_order_id: req.params.payment_id } });
            const package_select = yield package_1.Package.findOne({ where: { package_id: order.package_id } });
            const begin = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            const expire = (0, moment_1.default)(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss');
            try {
                payment.status_confirm = "confirm";
                // payment.user_confirm = ** admin id **
                payment.save();
                order.begin = begin;
                order.expire = expire;
                order.status_expire = "no";
                order.status_confrim = "confirm";
                order.status_payment = "confirm";
                order.save;
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'confirm payment success.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: ' error',
                    description: 'something went wrong.'
                });
            }
        });
    }
}
exports.PackageController = PackageController;
