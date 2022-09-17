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
exports.memberRouter = void 0;
const CartController_1 = require("./../controllers/CartController");
const BankController_1 = require("./../controllers/BankController");
const ProductController_1 = require("./../controllers/ProductController");
const AuthMemberAndGuest_1 = require("./../middleware/AuthMemberAndGuest");
const PackageController_1 = require("./../controllers/PackageController");
const OrderController_1 = require("./../controllers/OrderController");
const AuthMember_1 = require("./../middleware/AuthMember");
const MembersController_1 = require("../controllers/MembersController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multerUpload = __importStar(require("../util/multerUpload"));
const ChatController_1 = require("../controllers/ChatController");
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const membersController = new MembersController_1.MembersController();
const orderController = new OrderController_1.OrderController();
const packageController = new PackageController_1.PackageController();
const productController = new ProductController_1.ProductController();
const bankController = new BankController_1.BankController();
const cartController = new CartController_1.CartController();
const chatController = new ChatController_1.ChatController();
/** for authenticate */
router.post('/api/member/signin', [(0, express_validator_1.check)('username').notEmpty().isString(), (0, express_validator_1.check)('password').notEmpty().isString(),], membersController.OnSignin);
router.post('/api/member/update', AuthMember_1.AuthenticateMember, [
    (0, express_validator_1.check)('username').isString().notEmpty()
], membersController.OnUpdate);
router.post('/api/member/register', [
    (0, express_validator_1.check)('username').notEmpty().isString(),
    (0, express_validator_1.check)('password').notEmpty().isString(),
    (0, express_validator_1.check)('gender').notEmpty().isString(),
], membersController.OnCreate);
router.post('/api/member/checkToken', [
    (0, express_validator_1.check)('token').isString()
], membersController.OnCheckAccessToken);
router.post('/api/member/getToken', [
    (0, express_validator_1.check)('token').isString()
], membersController.OnGetAccessToken);
/** for package */
router.get('/api/package/get', packageController.OnGetPackageAll);
router.get('/api/package/statusPayment/:member_code', packageController.OnCheckStatusPayment);
router.post('/api/package/getSelect', [
    (0, express_validator_1.check)('memberCode').isString().notEmpty(),
    (0, express_validator_1.check)('packageId').notEmpty(),
], packageController.OnGetPackage);
router.get('/api/package/checkPackage/:code', packageController.OnCheckPackageMember);
router.post('/api/package/createPayment', upload.single('slip'), [
    (0, express_validator_1.check)('memberCode').notEmpty().isString(),
    (0, express_validator_1.check)('bankRef').notEmpty(),
    (0, express_validator_1.check)('packageId').notEmpty(),
], packageController.OnCreatePayment);
router.post('/api/package/renewal', upload.single('slip'), AuthMember_1.AuthenticateMember, [
    (0, express_validator_1.check)('bankRef').notEmpty(),
], packageController.OnRenewalPackage);
/** for show product */
router.get('/api/product/:code', AuthMemberAndGuest_1.AuthenticateMemberAndGuest, productController.OnGetProductByCode);
router.get('/api/product/:gender/store/:store_code', AuthMemberAndGuest_1.AuthenticateMemberAndGuest, productController.OnGetProduct);
router.get('/api/product/:gender/allStore', AuthMemberAndGuest_1.AuthenticateMemberAndGuest, productController.OnGetStoreAll);
/** for order product */
router.get('/api/member/cart/add/:code', AuthMember_1.AuthenticateMember, cartController.OnAddProductToCart);
router.get('/api/member/cart/delete/:code', AuthMember_1.AuthenticateMember, cartController.OnDeleteProductFromCart);
router.get('/api/member/cart/get', AuthMember_1.AuthenticateMember, cartController.OnGetProductInCart);
router.get('/api/member/cart/checkProduct', AuthMember_1.AuthenticateMember, cartController.OnCheckProductInCart);
router.post('/api/member/createOrder', upload.single('image'), [
    (0, express_validator_1.check)('name').notEmpty().isString(),
    (0, express_validator_1.check)('address').notEmpty().isString(),
    (0, express_validator_1.check)('phone').notEmpty().isString(),
    (0, express_validator_1.check)('district').notEmpty().isString(),
    (0, express_validator_1.check)('subdistrict').notEmpty().isString(),
    (0, express_validator_1.check)('province').notEmpty().isString(),
    (0, express_validator_1.check)('code').notEmpty().isString(),
    (0, express_validator_1.check)('note').notEmpty().isString(),
    (0, express_validator_1.check)('bank_ref').notEmpty().isNumeric()
], AuthMember_1.AuthenticateMember, orderController.OnCreateOrder);
router.post('/api/member/order/review', AuthMember_1.AuthenticateMember, [
    (0, express_validator_1.check)('message').isString().notEmpty(),
    (0, express_validator_1.check)('orderNumber').isString().notEmpty(),
    (0, express_validator_1.check)('productId').isNumeric().notEmpty(),
    (0, express_validator_1.check)('star').isNumeric().notEmpty()
], orderController.OnReview);
router.get('/api/member/getOrder', AuthMember_1.AuthenticateMember, orderController.OnGetOrderMember);
router.get('/api/bank/get', bankController.OnGetBankAll);
/** for chat */
router.post('/api/member/chatToAdmin', [
    (0, express_validator_1.check)('message').isString()
], AuthMember_1.AuthenticateMember, chatController.OnSendMessageToAdmin);
router.get('/api/member/getOldChat', AuthMember_1.AuthenticateMember, chatController.OnGetOldChatMember);
router.get('/api/member/readChat', AuthMember_1.AuthenticateMember, chatController.OnReadMessageMember);
exports.memberRouter = router;
