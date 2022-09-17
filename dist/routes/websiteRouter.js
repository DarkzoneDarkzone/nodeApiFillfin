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
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteRouter = void 0;
const ContentController_1 = require("./../controllers/ContentController");
const BannerController_1 = require("./../controllers/BannerController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AdsController_1 = require("../controllers/AdsController");
const multerUpload = __importStar(require("../util/multerUpload"));
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const adsController = new AdsController_1.AdsController();
const bannerController = new BannerController_1.BannerController();
const contentController = new ContentController_1.ContentController();
router.get('/api/website/getSlide/:page', adsController.OnGetAds);
router.post('/api/website/getBanner', [
    (0, express_validator_1.check)('page').isString().notEmpty(),
    (0, express_validator_1.check)('gender').isString().notEmpty()
], bannerController.OnGetBanner);
router.get('/api/website/content/:type', contentController.OnGetContent);
exports.websiteRouter = router;
