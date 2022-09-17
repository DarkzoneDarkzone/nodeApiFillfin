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
exports.BannerController = void 0;
const banner_1 = require("./../models/banner");
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
class BannerController {
    constructor() {
        this.OnGetBanner = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield banner_1.Banner.findOne({ where: {
                    position: req.body.page,
                    isMen: (req.body.gender == "men") ? true : false,
                    display: true
                } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'banner was not found.'
                });
            }
            const filtered = {
                title: finding.title,
                content: finding.content,
                image: finding.img_path
            };
            return res.status(200).json({
                status: true,
                message: 'ok',
                descriptin: 'get banner success.',
                banner: filtered
            });
        });
        this.OnUpdateBanner = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'erorr',
                    errorMessage: errors.array()
                });
            }
            const finding = yield banner_1.Banner.findOne({ where: { id: req.body.id } });
            if (!finding) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'banner was not found.'
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
                    finding.img_path = image;
                }
                finding.title = req.body.title;
                finding.content = req.body.content;
                finding.display = req.body.display;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'banner was updated.'
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
        this.OnChangeDisplayBanner = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            try {
                const finding = yield banner_1.Banner.findOne({ where: { id: req.body.id } });
                if (!finding) {
                    return res.status(400).json({
                        status: false,
                        message: 'error',
                        description: 'banner was not found.'
                    });
                }
                finding.display = req.body.display;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'adbanners was updated.'
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
exports.BannerController = BannerController;
