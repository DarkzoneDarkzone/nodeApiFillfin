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
exports.AdsController = void 0;
const ads_1 = require("./../models/ads");
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
const View_service_1 = require("../services/View.service");
class AdsController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnGetAds = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield this.queryAdsShow(req.params.page);
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'ads was not found.'
                });
            }
            const filtered = {
                ads_id: finding.id,
                position: finding.position,
                title: finding.title,
                content: finding.content,
                h1: finding.h1,
                h2: finding.h2,
                image: finding.imgPath,
            };
            return res.status(200).json({
                status: true,
                message: 'ok',
                descriptin: 'get ads success.',
                ads: filtered
            });
        });
        this.OnChangeDisplayAds = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield ads_1.Ads.findOne({ where: { position: req.body.position } });
                if (!finding) {
                    return res.status(400).json({
                        status: false,
                        message: 'error',
                        description: 'position was not found.'
                    });
                }
                finding.display = req.body.display;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'ads was updated.'
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
        this.OnUpdateAds = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const ads = yield ads_1.Ads.findOne({ where: { id: req.body.id } });
            if (!ads) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'ads was not found.'
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
                    ads.img_path = image;
                }
                ads.position = req.body.position;
                ads.save();
                return res.status(201).json({
                    sttaus: true,
                    message: 'ok',
                    description: 'ads was updated.'
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
        this.OnCreateAds = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield ads_1.Ads.findAll({ where: { position: req.body.position } });
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
                    yield ads_1.Ads.create({
                        position: req.body.position,
                        isMen: '',
                        title: '',
                        content: '',
                        h1: '',
                        h2: '',
                        display: 1,
                        priority: finding.length,
                        img_path: image
                    });
                }
                else {
                    return res.status(400).json({
                        sttaus: false,
                        message: 'error',
                        description: "ads wasn't create."
                    });
                }
                return res.status(201).json({
                    sttaus: true,
                    message: 'ok',
                    description: 'ads was updated.'
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
        this.OnDeleteAds = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield ads_1.Ads.findOne({ where: { id: req.params.id } });
                finding.destroy();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'ads was deleted.'
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
exports.AdsController = AdsController;
