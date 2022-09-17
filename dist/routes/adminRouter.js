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
exports.adminRouter = void 0;
const BannerController_1 = require("./../controllers/BannerController");
const AdsController_1 = require("./../controllers/AdsController");
const ContentController_1 = require("./../controllers/ContentController");
const ReportController_1 = require("./../controllers/ReportController");
const ProductController_1 = require("./../controllers/ProductController");
const PostController_1 = require("./../controllers/PostController");
const AdminStoreController_1 = require("./../controllers/AdminStoreController");
const StoreController_1 = require("./../controllers/StoreController");
const PackageController_1 = require("./../controllers/PackageController");
const AuthAdmin_1 = require("./../middleware/AuthAdmin");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const UserController_1 = require("../controllers/UserController");
const BankController_1 = require("../controllers/BankController");
const MembersController_1 = require("../controllers/MembersController");
const OrderController_1 = require("../controllers/OrderController");
const ReviewController_1 = require("../controllers/ReviewController");
const AdminManageController_1 = require("../controllers/AdminManageController");
const ChatController_1 = require("../controllers/ChatController");
const multerUpload = __importStar(require("../util/multerUpload"));
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
const storeController = new StoreController_1.StoreController();
const bankController = new BankController_1.BankController();
const membersController = new MembersController_1.MembersController();
const orderController = new OrderController_1.OrderController();
const packageController = new PackageController_1.PackageController();
const reviewController = new ReviewController_1.ReviewController();
const adminStoreController = new AdminStoreController_1.AdminStoreController();
const postController = new PostController_1.PostController();
const productController = new ProductController_1.ProductController();
const reportController = new ReportController_1.ReportController();
const adminManageController = new AdminManageController_1.AdminManageController();
const chatController = new ChatController_1.ChatController();
const contentController = new ContentController_1.ContentController();
const adsController = new AdsController_1.AdsController();
const bannerController = new BannerController_1.BannerController();
/** for authenticate */
router.get('/api/admin/get', AuthAdmin_1.AuthenticateAdmin, userController.OnGetAdminAll);
router.post('/api/admin/register', upload.single('image'), [
    (0, express_validator_1.check)('username').isString(),
    (0, express_validator_1.check)('password').isString(),
    (0, express_validator_1.check)('email').isString(),
    (0, express_validator_1.check)('name').isString(),
], userController.OnRegister);
router.post('/api/admin/signin', [
    (0, express_validator_1.check)('username').isString(),
    (0, express_validator_1.check)('password').isString()
], userController.OnSignin);
router.post('/api/admin/changePassword', [
    (0, express_validator_1.check)('adminCode').isString(),
    (0, express_validator_1.check)('newPassword').isString()
], AuthAdmin_1.AuthenticateAdmin, adminManageController.OnChangePasswordAdmin);
router.post('/api/admin/update', upload.single('image'), AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('adminCode').isString(),
    (0, express_validator_1.check)('email').isString(),
    (0, express_validator_1.check)('name').isString(),
    (0, express_validator_1.check)('permission').isNumeric()
], userController.OnUpdate);
router.get('/api/admin/delete/:code', AuthAdmin_1.AuthenticateAdmin, userController.OnDelete);
router.get('/api/admin/confirmRegister/:code', AuthAdmin_1.AuthenticateAdmin, userController.OnConfirmRegister);
router.post('/api/admin/getToken', [
    (0, express_validator_1.check)('token').isString()
], userController.OnGetAccessToken);
router.post('/api/admin/changeStatus', [
    (0, express_validator_1.check)('adminCode').isString(),
    (0, express_validator_1.check)('status').isString()
], AuthAdmin_1.AuthenticateAdmin, userController.OnChangeStatus);
/** for manage bank */
router.get('/api/admin/bank/get', AuthAdmin_1.AuthenticateAdmin, bankController.OnGetBankAll);
router.post('/api/admin/changeStatusBank', [
    (0, express_validator_1.check)('bank_id').notEmpty(),
    (0, express_validator_1.check)('status').isString().notEmpty()
], AuthAdmin_1.AuthenticateAdmin, bankController.OnChangeStatusBank);
router.get('/api/admin/bankProvider/get', AuthAdmin_1.AuthenticateAdmin, bankController.OnGetBankProvider);
router.post('/api/admin/bank/create', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('name').isString(),
    (0, express_validator_1.check)('bank_number').isString(),
    (0, express_validator_1.check)('branch').isString(),
    (0, express_validator_1.check)('bank_provider_id').isNumeric(),
], bankController.OnCreateBankAccount);
router.post('/api/admin/bank/update', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('name').isString(),
    (0, express_validator_1.check)('bank_number').isString(),
    (0, express_validator_1.check)('branch').isString(),
    (0, express_validator_1.check)('bank_id').isNumeric(),
    (0, express_validator_1.check)('bank_provider_id').isNumeric(),
], bankController.OnUpdateBankAccount);
/** for manage member */
router.get('/api/admin/member/get', AuthAdmin_1.AuthenticateAdmin, membersController.OnGetAll);
router.post('/api/admin/member/changePassword', [
    (0, express_validator_1.check)('memberCode').isString(),
    (0, express_validator_1.check)('newPassword').isString()
], AuthAdmin_1.AuthenticateAdmin, adminManageController.OnChangePasswordMember);
router.post('/api/admin/member/changeStatus', [
    (0, express_validator_1.check)('memberCode').isString(),
    (0, express_validator_1.check)('status').isString()
], AuthAdmin_1.AuthenticateAdmin, membersController.OnChangeStatus);
router.get('/api/admin/member/delete/:code', AuthAdmin_1.AuthenticateAdmin, membersController.OnDeleteMember);
/** for manage package */
router.get('/api/admin/package/get', AuthAdmin_1.AuthenticateAdmin, packageController.OnGetPackageAll);
router.post('/api/admin/package/update', upload.single('image'), AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('packageId').notEmpty(),
    (0, express_validator_1.check)('day').isNumeric().notEmpty(),
    (0, express_validator_1.check)('content').isString().notEmpty(),
    (0, express_validator_1.check)('price').isNumeric().notEmpty(),
    (0, express_validator_1.check)('grossProfit').isNumeric().notEmpty()
], packageController.OnUpdatePackage);
/** for manage package order */
router.get('/api/admin/packageOrder/get', AuthAdmin_1.AuthenticateAdmin, packageController.OnGetMemberPackageOrder);
router.get('/api/admin/package/:paymentId/confirm', AuthAdmin_1.AuthenticateAdmin, packageController.OnConfirmPayment);
/** for manage review */
router.get('/api/admin/review/get', AuthAdmin_1.AuthenticateAdmin, reviewController.OnGetReview);
router.post('/api/admin/changeStatusReview', [
    (0, express_validator_1.check)('id').notEmpty(),
    (0, express_validator_1.check)('display').isString().notEmpty()
], AuthAdmin_1.AuthenticateAdmin, reviewController.OnChangeStatusReview);
router.post('/api/admin/review/update', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('review_id').isNumeric(),
    (0, express_validator_1.check)('display').isString()
], reviewController.OnUpdateReview);
router.get('/api/admin/review/delete/:id', AuthAdmin_1.AuthenticateAdmin, reviewController.OnDeleteReview);
/**for upload video */
router.post('/api/admin/store/videoUpload', upload.single('video'), AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('storeCode').isNumeric().notEmpty()
], contentController.OnUploadVideoStore);
router.get('/api/admin/content/get', AuthAdmin_1.AuthenticateAdmin, contentController.OnGetContentAll);
router.post('/api/admin/content/update', [
    (0, express_validator_1.check)('id').notEmpty(),
    (0, express_validator_1.check)('type').isString(),
    (0, express_validator_1.check)('title').isString(),
    (0, express_validator_1.check)('content').isString(),
    (0, express_validator_1.check)('h1').isString(),
    (0, express_validator_1.check)('h2').isString(),
], upload.single('image'), AuthAdmin_1.AuthenticateAdmin, contentController.OnUpdateContent);
router.post('/api/admin/content/changeVideo', [
    (0, express_validator_1.check)('id').notEmpty(),
    (0, express_validator_1.check)('pathUrl').isString(),
    (0, express_validator_1.check)('isFile').isBoolean(),
], upload.single('video'), AuthAdmin_1.AuthenticateAdmin, contentController.OnChangeVideoContent);
router.post('/api/admin/changeStatusContent', [
    (0, express_validator_1.check)('id').notEmpty(),
    (0, express_validator_1.check)('display').isString().notEmpty()
], AuthAdmin_1.AuthenticateAdmin, contentController.OnChangeStatusContent);
/** for manage store */
router.get('/api/admin/store/get', AuthAdmin_1.AuthenticateAdmin, storeController.OnGetStoreAll);
router.get('/api/admin/store/getDetails/:code', AuthAdmin_1.AuthenticateAdmin, adminStoreController.OnGetStoreDetails);
router.post('/api/admin/store/changeStatusStore', [
    (0, express_validator_1.check)('storeCode').isString(),
    (0, express_validator_1.check)('status').isString(),
], AuthAdmin_1.AuthenticateAdmin, storeController.OnChangeStatusStore);
router.post('/api/admin/store/updateProfile', AuthAdmin_1.AuthenticateAdmin, upload.single('image'), [
    (0, express_validator_1.check)('storeCode').isString(),
    (0, express_validator_1.check)('name').isString(),
    (0, express_validator_1.check)('age').isString(),
    (0, express_validator_1.check)('weight').isString(),
    (0, express_validator_1.check)('height').isString(),
    (0, express_validator_1.check)('bwh').isString(),
], storeController.OnUpdateProfile);
router.post('/api/admin/storeProduct/Create', AuthAdmin_1.AuthenticateAdmin, upload.fields([{ name: 'standard', maxCount: 2 }, { name: 'premium', maxCount: 2 }]), [
    (0, express_validator_1.check)('storeCode').isString(),
    (0, express_validator_1.check)('name_member').isString(),
    (0, express_validator_1.check)('content_member').isString(),
    (0, express_validator_1.check)('name_premium').isString(),
    (0, express_validator_1.check)('content_premium').isString(),
    (0, express_validator_1.check)('price_standard').isNumeric(),
    (0, express_validator_1.check)('price_premium').isNumeric(),
    (0, express_validator_1.check)('clip').isString(),
], adminStoreController.OnCreateProduct);
router.post('/api/admin/storeProductPre/Create', AuthAdmin_1.AuthenticateAdmin, upload.fields([{ name: 'premium', maxCount: 2 }]), [
    (0, express_validator_1.check)('storeCode').isString(),
    (0, express_validator_1.check)('name_premium').isString(),
    (0, express_validator_1.check)('content_premium').isString(),
    (0, express_validator_1.check)('price_premium').isNumeric(),
    (0, express_validator_1.check)('clip').isString(),
], adminStoreController.OnCreateProductPre);
router.post('/api/admin/storePost/create', AuthAdmin_1.AuthenticateAdmin, upload.array('image'), [
    (0, express_validator_1.check)('storeCode').isString(),
], postController.OnCreatePostAdmin);
router.get('/api/admin/storePost/delete/:code', AuthAdmin_1.AuthenticateAdmin, postController.OnDeletePost);
router.get('/api/admin/storeProduct/delete/:code', AuthAdmin_1.AuthenticateAdmin, productController.OnDeleteProduct);
router.post('/api/admin/store/updateConcept', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('storeCode').isString(),
    (0, express_validator_1.check)('concept').isString()
], storeController.OnUpdateConcept);
router.post('/api/admin/storeProduct/setRecommend', [
    (0, express_validator_1.check)('productCode').isString().notEmpty(),
    (0, express_validator_1.check)('recommend').isString().notEmpty(),
], AuthAdmin_1.AuthenticateAdmin, adminStoreController.OnSetProductRecommend);
router.post('/api/admin/storeProduct/setPriority', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('productCode').isString().notEmpty(),
    (0, express_validator_1.check)('priority').notEmpty(),
], adminStoreController.OnSetProductPriority);
router.post('/api/admin/store/changePassword', [
    (0, express_validator_1.check)('storeCode').isString(),
    (0, express_validator_1.check)('newPassword').isString()
], AuthAdmin_1.AuthenticateAdmin, adminManageController.OnChangePasswordStore);
/** for order */
router.get('/api/admin/orders/read/:number', AuthAdmin_1.AuthenticateAdmin, orderController.OnReadOrder);
router.get('/api/admin/orders/get', AuthAdmin_1.AuthenticateAdmin, orderController.OnGetOrderAdmin);
router.post('/api/admin/orders/updatePaymentStatus', [
    (0, express_validator_1.check)('orderNumber').isString(),
    (0, express_validator_1.check)('status').isString()
], AuthAdmin_1.AuthenticateAdmin, orderController.OnUpdatePaymentStatus);
router.post('/api/admin/orders/updateStatus', [
    (0, express_validator_1.check)('orderNumber').isString(),
    (0, express_validator_1.check)('status').isString(),
    (0, express_validator_1.check)('message').isString(),
], AuthAdmin_1.AuthenticateAdmin, orderController.OnUpdateStatus);
router.post('/api/admin/orders/updateProductStatus', [
    (0, express_validator_1.check)('orderNumber').isString(),
    (0, express_validator_1.check)('productId').isNumeric(),
    (0, express_validator_1.check)('status').isString(),
], AuthAdmin_1.AuthenticateAdmin, orderController.OnUpdateProductStatus);
router.post('/api/admin/orders/updateGpProduct', [
    (0, express_validator_1.check)('orderNumber').isString(),
    (0, express_validator_1.check)('productId').isNumeric(),
    (0, express_validator_1.check)('gp').isNumeric(),
], AuthAdmin_1.AuthenticateAdmin, orderController.OnUpdateGPInOrder);
/** for report */
router.post('/api/admin/storeReport/export', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('start'),
    (0, express_validator_1.check)('end')
], reportController.OnExportStoreReport);
router.post('/api/admin/storeReport/get', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('start'),
    (0, express_validator_1.check)('end')
], reportController.OnGetStoreReport);
router.post('/api/admin/customerReport/export', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('start'),
    (0, express_validator_1.check)('end')
], reportController.OnExportCustomerReport);
router.post('/api/admin/customerReport/get', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('start'),
    (0, express_validator_1.check)('end')
], reportController.OnGetCustomerReport);
router.post('/api/admin/orderReport/export', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('start'),
    (0, express_validator_1.check)('end')
], reportController.OnExportOrderReport);
router.post('/api/admin/orderReport/get', AuthAdmin_1.AuthenticateAdmin, [
    (0, express_validator_1.check)('start'),
    (0, express_validator_1.check)('end')
], reportController.OnGetOrderReport);
/** for settings */
router.post('/api/admin/setGrossProfit', [
    (0, express_validator_1.check)('gp').notEmpty().isString()
], AuthAdmin_1.AuthenticateAdmin, adminManageController.OnSetGrossProfit);
router.get('/api/admin/getSetting', AuthAdmin_1.AuthenticateAdmin, adminManageController.OnGetDataSettings);
router.post('/api/admin/updateSetting', [
    (0, express_validator_1.check)('settingName').notEmpty().isString(),
    (0, express_validator_1.check)('settingValue').notEmpty().isString()
], AuthAdmin_1.AuthenticateAdmin, adminManageController.OnUpdateSettings);
/** for chat */
router.post('/api/admin/chatToMember', [
    (0, express_validator_1.check)('memberCode').isString(),
    (0, express_validator_1.check)('message').isString(),
], AuthAdmin_1.AuthenticateAdmin, chatController.OnSendMessageToMember);
router.get('/api/admin/readChat/:code', AuthAdmin_1.AuthenticateAdmin, chatController.OnReadMessageAdmin);
router.get('/api/admin/getOldChat', AuthAdmin_1.AuthenticateAdmin, chatController.OnGetOldChatAdmin);
/** for log */
router.get('/api/admin/getLog', AuthAdmin_1.AuthenticateAdmin, adminManageController.OnGetLogSignin);
router.post('/api/admin/changeStatusLog', [
    (0, express_validator_1.check)('adminCode').isString(),
    (0, express_validator_1.check)('status').isString(),
], AuthAdmin_1.AuthenticateAdmin, adminManageController.OnChangeStatusLog);
/** for dashboard */
router.get('/api/admin/getDashboard', AuthAdmin_1.AuthenticateAdmin, reportController.OnGetDashboardData);
/** for banner and ads */
router.post('/api/admin/updateSlide', upload.single('image'), [
    (0, express_validator_1.check)('id').isString(),
    (0, express_validator_1.check)('position').isString(),
], AuthAdmin_1.AuthenticateAdmin, adsController.OnUpdateAds);
router.post('/api/admin/createSlide', upload.single('image'), [
    (0, express_validator_1.check)('position').isString(),
], AuthAdmin_1.AuthenticateAdmin, adsController.OnCreateAds);
router.get('/api/admin/deleteSlide/:id', AuthAdmin_1.AuthenticateAdmin, adsController.OnDeleteAds);
router.post('/api/admin/updateBanner', upload.single('image'), [
    (0, express_validator_1.check)('title').isString(),
    (0, express_validator_1.check)('display').isString(),
    (0, express_validator_1.check)('content').isString(),
    (0, express_validator_1.check)('id').isNumeric(),
], AuthAdmin_1.AuthenticateAdmin, bannerController.OnUpdateBanner);
router.post('/api/admin/changeDisplayBanner', [
    (0, express_validator_1.check)('id').isNumeric(),
    (0, express_validator_1.check)('display').isBoolean()
], AuthAdmin_1.AuthenticateAdmin, bannerController.OnChangeDisplayBanner);
// router.post('/api/admin/changeDisplaySlide', [
//     check('position').isString(),
//     check('display').isBoolean()
// ], AuthenticateAdmin, adsController.OnChangeDisplayAds)
router.post('/api/admin/resetPassword', [
    (0, express_validator_1.check)('username').isString(),
    (0, express_validator_1.check)('email').isString().isEmail()
], userController.OnResetPassword);
router.get('/api/admin/checkReset/:token', userController.OnCheckResetToken);
router.post('/api/admin/updatePassword', [
    (0, express_validator_1.check)('newPassword').isString(),
    (0, express_validator_1.check)('token').isString()
], userController.OnUpdateNewPassword);
exports.adminRouter = router;
