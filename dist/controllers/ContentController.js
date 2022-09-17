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
exports.ContentController = void 0;
const banner_1 = require("./../models/banner");
const store_1 = require("./../models/store");
const website_1 = require("./../models/website");
const express_validator_1 = require("express-validator");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const View_service_1 = require("../services/View.service");
const ads_1 = require("../models/ads");
class ContentController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnGetContent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const type = req.params.type;
            const finding = yield website_1.Website.findOne({ where: { type: type, display: 'yes' } });
            let response = {};
            if (finding) {
                response = {
                    title: finding.title,
                    content: finding.content,
                    h1: finding.h1,
                    h2: finding.h2,
                    videoLink: finding.video_link,
                    imageLink: finding.image_link,
                    isFile: finding.isFile,
                };
            }
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                content: response
            });
        });
        this.OnGetContentAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const content = yield website_1.Website.findAll();
            const banner = yield banner_1.Banner.findAll();
            const ads = yield ads_1.Ads.findAll();
            const positionAds = yield this.queryPositionAll();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get content success.',
                content: content,
                banner: banner,
                ads: ads,
                adsPosition: positionAds
            });
        });
        this.OnChangeStatusContent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield website_1.Website.update({
                display: req.body.display
            }, {
                where: { id: req.body.id }
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'update content success.'
            });
        });
        this.OnUploadVideoStore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const store = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
            if (!store) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'store was not found.'
                });
            }
            try {
                if (req.file) {
                    let dest = req.file.destination.split("uploads");
                    var ext = path_1.default.extname(req.file.originalname);
                    let originalname = path_1.default.basename(req.file.originalname, ext);
                    const newfolder = `${dest[0]}video${dest[1]}`;
                    if (!fs_1.default.existsSync(newfolder)) {
                        fs_1.default.mkdirSync(newfolder, { recursive: true });
                    }
                    for (let i = 1; fs_1.default.existsSync(newfolder + originalname + ext); i++) {
                        originalname = originalname.split('(')[0];
                        originalname += '(' + i + ')';
                    }
                    const path_upload = "/video" + dest[1] + originalname + ext;
                    fs_1.default.copyFile(req.file.path, dest[0] + path_upload, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    fs_1.default.unlink(req.file.path, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    store.profile_video = path_upload;
                    store.save();
                    return res.status(201).json({
                        sttaus: true,
                        message: 'ok',
                        description: 'video was uploaded.'
                    });
                }
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'file was not found.'
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
        this.OnUpdateContent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const website = yield website_1.Website.findOne({ where: { id: req.body.id } });
            if (!website) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'content was not found.'
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
                    website.image_link = image;
                }
                website.type = req.body.type;
                website.title = req.body.title;
                website.content = req.body.content;
                website.h1 = req.body.h1;
                website.h2 = req.body.h2;
                website.save();
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'content was updated.'
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
        this.OnChangeVideoContent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const website = yield website_1.Website.findOne({ where: { id: req.body.id } });
            if (!website) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'content was not found.'
                });
            }
            try {
                if (req.body.isFile === "true") {
                    if (req.file) {
                        let dest = req.file.destination.split("uploads");
                        var ext = path_1.default.extname(req.file.originalname);
                        let originalname = path_1.default.basename(req.file.originalname, ext);
                        const newfolder = `${dest[0]}video${dest[1]}`;
                        if (!fs_1.default.existsSync(newfolder)) {
                            fs_1.default.mkdirSync(newfolder, { recursive: true });
                        }
                        for (let i = 1; fs_1.default.existsSync(newfolder + originalname + ext); i++) {
                            originalname = originalname.split('(')[0];
                            originalname += '(' + i + ')';
                        }
                        const path_upload = "video" + dest[1] + originalname + ext;
                        fs_1.default.copyFile(req.file.path, dest[0] + path_upload, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                        website.video_link = path_upload;
                        website.isFile = req.body.isFile;
                        website.save();
                    }
                }
                else {
                    website.video_link = req.body.pathUrl;
                    website.isFile = req.body.isFile;
                    website.save();
                }
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'video content was updated.'
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
        this.OnUpdateBanner = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const banner = yield banner_1.Banner.findOne({ where: { id: req.body.id } });
            if (!banner) {
                return res.status(404).json({
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
                    banner.img_path = image;
                }
                banner.position = req.body.position;
                banner.title = req.body.title;
                banner.content = req.body.content;
                // banner.h1 = req.body.h1
                // banner.h2 = req.body.h2
                banner.save();
                return res.status(201).json({
                    sttaus: true,
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
                    ads.img_path = image;
                    ads.save();
                }
                else {
                    return res.status(400).json({
                        sttaus: false,
                        message: 'error',
                        description: "ads wasn't updated."
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
                    yield ads_1.Ads.create({
                        position: req.body.position,
                        isMen: req.body.isMen,
                        title: '',
                        content: '',
                        h1: '',
                        h2: '',
                        display: 1,
                        priority: 5,
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
    }
}
exports.ContentController = ContentController;
