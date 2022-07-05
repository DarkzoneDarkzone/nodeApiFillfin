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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankController = void 0;
const bankProvider_1 = require("./../models/bankProvider");
const bankAccount_1 = require("./../models/bankAccount");
require("moment/locale/th");
const express_validator_1 = require("express-validator");
const sharp = require('sharp');
const Bank_service_1 = require("../services/Bank.service");
class BankController extends Bank_service_1.BankService {
    constructor() {
        super(...arguments);
        this.OnGetBankAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield bankAccount_1.BankAccount.findAll();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: finding
            });
        });
        this.OnCreateBankAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding_bank = yield bankAccount_1.BankAccount.findOne({ where: { bank_number: req.body.bank_number } });
            if (!finding_bank) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'data is not found.'
                });
            }
            try {
                yield bankAccount_1.BankAccount.create({
                    name: req.body.name,
                    bank_account: req.body.bank_account,
                    branch: req.body.branch,
                    bank_provider_id: req.body.bank_provider_id,
                });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was created.'
                });
            }
            catch (_a) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    dscription: 'something went wrong.'
                });
            }
        });
        this.OnUpdateBankAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield bankAccount_1.BankAccount.findOne({ where: { id: req.body.id } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'data is not found.'
                });
            }
            try {
                finding.name = req.body.name;
                finding.bank_account = req.body.bank_account;
                finding.branch = req.body.branch;
                finding.bank_provider_id = req.body.bank_provider_id;
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'data was updated..'
                });
            }
            catch (_b) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    dscription: 'something went wrong.'
                });
            }
        });
        this.OnGetBankProvider = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield bankProvider_1.BankProvider.findAll();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: finding
            });
        });
        this.OnGetBankAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield this.queryBankAccountAll();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                data: finding
            });
        });
    }
}
exports.BankController = BankController;
