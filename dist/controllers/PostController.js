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
exports.PostController = void 0;
const database_1 = require("./../util/database");
const postImage_1 = require("./../models/postImage");
const store_1 = require("./../models/store");
const post_1 = require("./../models/post");
const View_service_1 = require("./../services/View.service");
const moment_1 = __importDefault(require("moment"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class PostController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnCreatePostAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const store = yield store_1.Store.findOne({ where: { store_code: req.body.storeCode } });
            const all_post = yield post_1.Post.findAll({ where: { store_id: store.id, status: 'active' } });
            if (all_post.length >= 10) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'your post has limited.'
                });
            }
            const t = yield database_1.sequelize.transaction();
            try {
                const str_post_code = `${store.code}${(0, moment_1.default)().format('YYYYMMDDHHmmss')}`;
                let post_code = yield bcrypt_1.default.hash(str_post_code, 10);
                const post = yield post_1.Post.create({
                    post_code: post_code.replace(/\W/g, ""),
                    store_id: store.id,
                    display: "yes",
                    caption: req.body.caption,
                    status: "active"
                }, { transaction: t });
                let postImage = [];
                if (req.files) {
                    let count = 0;
                    for (const file of req.files) {
                        let upload = "/uploads" + file.destination.split("uploads").pop();
                        let dest = file.destination;
                        var ext = path_1.default.extname(file.originalname);
                        let originalname = path_1.default.basename(file.originalname, ext);
                        for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                            originalname = originalname.split('(')[0];
                            originalname += '(' + i + ')';
                        }
                        const image = yield sharp(file.path)
                            .resize(500, 500)
                            .withMetadata()
                            .jpeg({ quality: 95 })
                            .toFile(path_1.default.resolve(file.destination, originalname + ext))
                            .then((data) => {
                            fs_1.default.unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return upload + originalname + ext;
                        });
                        const arr = {
                            post_id: post.id,
                            path_image: image,
                            priority: count++
                        };
                        postImage.push(arr);
                    }
                    const post_image = yield postImage_1.PostImage.bulkCreate(postImage, { transaction: t });
                }
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
        this.OnCreatePostStore = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const authStore = req.authStore;
            const store = yield store_1.Store.findOne({ where: { store_code: authStore.store_code } });
            const all_post = yield post_1.Post.findAll({ where: { store_id: store.id, status: 'active' } });
            if (all_post.length >= 10) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'your post has limited.'
                });
            }
            const t = yield database_1.sequelize.transaction();
            try {
                const str_post_code = `${store.code}${(0, moment_1.default)().format('YYYYMMDDHHmmss')}`;
                let post_code = yield bcrypt_1.default.hash(str_post_code, 10);
                const post = yield post_1.Post.create({
                    post_code: post_code.replace(/\W/g, ""),
                    store_id: store.id,
                    display: "yes",
                    caption: req.body.caption,
                    status: "active"
                }, { transaction: t });
                let postImage = [];
                if (req.files) {
                    let count = 0;
                    for (const file of req.files) {
                        let upload = "/uploads" + file.destination.split("uploads").pop();
                        let dest = file.destination;
                        var ext = path_1.default.extname(file.originalname);
                        let originalname = path_1.default.basename(file.originalname, ext);
                        for (let i = 1; fs_1.default.existsSync(dest + originalname + ext); i++) {
                            originalname = originalname.split('(')[0];
                            originalname += '(' + i + ')';
                        }
                        const image = yield sharp(file.path)
                            .resize(500, 500)
                            .withMetadata()
                            .jpeg({ quality: 95 })
                            .toFile(path_1.default.resolve(file.destination, originalname + ext))
                            .then((data) => {
                            fs_1.default.unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            return upload + originalname + ext;
                        });
                        const arr = {
                            post_id: post.id,
                            path_image: image,
                            priority: count++
                        };
                        postImage.push(arr);
                    }
                    const post_image = yield postImage_1.PostImage.bulkCreate(postImage, { transaction: t });
                }
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
        this.OnDeletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const post = yield post_1.Post.findOne({ where: { post_code: req.params.code, status: 'active' } });
            if (!post) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'post was not found.'
                });
            }
            try {
                post.destroy();
                const post_image = postImage_1.PostImage.destroy({ where: { post_id: post.id } });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'post was deleted.'
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
exports.PostController = PostController;
