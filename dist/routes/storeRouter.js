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
exports.storeRouter = void 0;
const OrderController_1 = require("./../controllers/OrderController");
const ProductController_1 = require("./../controllers/ProductController");
const StoreController_1 = require("./../controllers/StoreController");
const PostController_1 = require("./../controllers/PostController");
const AuthStore_1 = require("./../middleware/AuthStore");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multerUpload = __importStar(require("../util/multerUpload"));
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const storeController = new StoreController_1.StoreController();
const postController = new PostController_1.PostController();
const productController = new ProductController_1.ProductController();
const orderController = new OrderController_1.OrderController();
router.get('/api/store/getDataAll', AuthStore_1.AuthenticateStore, storeController.OnGetDataAll);
router.post('/api/store/signin', [
    (0, express_validator_1.check)('username').isString().notEmpty(),
    (0, express_validator_1.check)('password').isString().notEmpty()
], storeController.OnSingin);
router.post('/api/store/register', upload.single('image'), [
    (0, express_validator_1.check)('name').isString(),
    (0, express_validator_1.check)('username').isString(),
    (0, express_validator_1.check)('password').isString(),
    (0, express_validator_1.check)('age').isString(),
    (0, express_validator_1.check)('gender').isString(),
], storeController.OnRegister);
router.post('/api/store/updateProfile', AuthStore_1.AuthenticateStore, upload.single('image'), [
    (0, express_validator_1.check)('storeCode').isString(),
    (0, express_validator_1.check)('name').isString(),
    (0, express_validator_1.check)('age').isString(),
    (0, express_validator_1.check)('weight').isString(),
    (0, express_validator_1.check)('height').isString(),
    (0, express_validator_1.check)('bwh').isString(),
], storeController.OnUpdateProfile);
router.post('/api/store/product/create', AuthStore_1.AuthenticateStore, upload.fields([{ name: 'standard', maxCount: 2 }, { name: 'premium', maxCount: 2 }]), [
    (0, express_validator_1.check)('name_member').isString(),
    (0, express_validator_1.check)('content_member').isString(),
    (0, express_validator_1.check)('name_premium').isString(),
    (0, express_validator_1.check)('content_premium').isString(),
    (0, express_validator_1.check)('price_standard').isNumeric(),
    (0, express_validator_1.check)('price_premium').isNumeric(),
    (0, express_validator_1.check)('clip').isString(),
], productController.OnCreateProduct);
router.post('/api/store/productPre/create', AuthStore_1.AuthenticateStore, upload.fields([{ name: 'premium', maxCount: 2 }]), [
    (0, express_validator_1.check)('name_premium').isString(),
    (0, express_validator_1.check)('content_premium').isString(),
    (0, express_validator_1.check)('price_premium').isNumeric(),
    (0, express_validator_1.check)('clip').isString(),
], productController.OnCreateProductPre);
router.post('/api/store/post/create', AuthStore_1.AuthenticateStore, upload.array('image'), [
    (0, express_validator_1.check)('caption').notEmpty().isString()
], postController.OnCreatePostStore);
router.get('/api/store/post/delete/:code', AuthStore_1.AuthenticateStore, postController.OnDeletePost);
router.get('/api/store/product/delete/:code', AuthStore_1.AuthenticateStore, productController.OnDeleteProduct);
router.post('/api/store/updateConcept', AuthStore_1.AuthenticateStore, [
    (0, express_validator_1.check)('concept').isString()
], storeController.OnUpdateConcept);
router.get('/api/store/orders/get', AuthStore_1.AuthenticateStore, orderController.OnGetOrderStore);
exports.storeRouter = router;
