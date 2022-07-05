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
exports.productRouter = void 0;
const AuthStore_1 = require("./../middleware/AuthStore");
const ProductController_1 = require("./../controllers/ProductController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multerUpload = __importStar(require("../util/multerUpload"));
const AuthMemberAndGuest_1 = require("../middleware/AuthMemberAndGuest");
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
router.get('/api/product/:gender/store/:store_code', AuthMemberAndGuest_1.AuthenticateMemberAndGuest, productController.OnGetProduct);
router.get('/api/product/:gender/allStore', AuthMemberAndGuest_1.AuthenticateMemberAndGuest, productController.OnGetStoreAll);
router.post('/api/product/create', upload.array('image'), [
    (0, express_validator_1.check)('name_member').isString(),
    (0, express_validator_1.check)('content_member').isString(),
    (0, express_validator_1.check)('name_premium').isString(),
    (0, express_validator_1.check)('content_premium').isString(),
    (0, express_validator_1.check)('price_standard').isNumeric(),
    (0, express_validator_1.check)('price_premium').isNumeric(),
    (0, express_validator_1.check)('clip').isString(),
], AuthStore_1.AuthenticateStore, productController.OnCreateProduct);
exports.productRouter = router;
