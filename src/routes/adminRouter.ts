import { BannerController } from './../controllers/BannerController';
import { AdsController } from './../controllers/AdsController';
import { ContentController } from './../controllers/ContentController';
import { ReportController } from './../controllers/ReportController';
import { ProductController } from './../controllers/ProductController';
import { PostController } from './../controllers/PostController';
import { AdminStoreController } from './../controllers/AdminStoreController';
import { StoreController } from './../controllers/StoreController';
import { PackageController } from './../controllers/PackageController' 
import { AuthenticateAdmin } from './../middleware/AuthAdmin' 
import { Router } from 'express'
import { check } from 'express-validator'
import { UserController } from '../controllers/UserController'
import { BankController } from '../controllers/BankController'
import { MembersController } from '../controllers/MembersController' 
import { OrderController } from '../controllers/OrderController' 
import { ReviewController } from '../controllers/ReviewController'
import { AdminManageController } from '../controllers/AdminManageController'
import { ChatController } from '../controllers/ChatController';
import * as multerUpload from '../util/multerUpload'

const upload = multerUpload.uploadImage()
const router = Router()
const userController = new UserController()
const storeController = new StoreController()
const bankController = new BankController()
const membersController = new MembersController()
const orderController = new OrderController()
const packageController = new PackageController()
const reviewController = new ReviewController()
const adminStoreController = new AdminStoreController()
const postController = new PostController()
const productController = new ProductController()
const reportController = new ReportController()
const adminManageController = new AdminManageController()
const chatController = new ChatController()
const contentController = new ContentController()
const adsController = new AdsController()
const bannerController = new BannerController()

/** for authenticate */
router.get('/api/admin/get', AuthenticateAdmin, userController.OnGetAdminAll)
router.post('/api/admin/register', upload.single('image'), [
    check('username').isString(),
    check('password').isString(),
    check('email').isString(),
    check('name').isString(),
], userController.OnRegister)
router.post('/api/admin/signin', [
    check('username').isString(),
    check('password').isString()
], userController.OnSignin)
router.post('/api/admin/changePassword', [
    check('adminCode').isString(),
    check('newPassword').isString()
], AuthenticateAdmin, adminManageController.OnChangePasswordAdmin)
router.post('/api/admin/update', upload.single('image'), AuthenticateAdmin, [
    check('adminCode').isString(),
    check('email').isString(),
    check('name').isString(),
    check('permission').isNumeric()
], userController.OnUpdate)
router.get('/api/admin/delete/:code', AuthenticateAdmin, userController.OnDelete)
router.get('/api/admin/confirmRegister/:code', AuthenticateAdmin, userController.OnConfirmRegister)
router.post('/api/admin/getToken', [
    check('token').isString()
], userController.OnGetAccessToken)
router.post('/api/admin/changeStatus', [
    check('adminCode').isString(),
    check('status').isString()
], AuthenticateAdmin, userController.OnChangeStatus)
/** for manage bank */
router.get('/api/admin/bank/get', AuthenticateAdmin, bankController.OnGetBankAll)
router.post('/api/admin/changeStatusBank', [
    check('bank_id').notEmpty(),
    check('status').isString().notEmpty()
], AuthenticateAdmin, bankController.OnChangeStatusBank)
router.get('/api/admin/bankProvider/get', AuthenticateAdmin, bankController.OnGetBankProvider)
router.post('/api/admin/bank/create', AuthenticateAdmin, [
    check('name').isString(),
    check('bank_number').isString(),
    check('branch').isString(),
    check('bank_provider_id').isNumeric(),
], bankController.OnCreateBankAccount)
router.post('/api/admin/bank/update', AuthenticateAdmin, [
    check('name').isString(),
    check('bank_number').isString(),
    check('branch').isString(),
    check('bank_id').isNumeric(),
    check('bank_provider_id').isNumeric(),
], bankController.OnUpdateBankAccount)
/** for manage member */
router.get('/api/admin/member/get', AuthenticateAdmin, membersController.OnGetAll)
router.post('/api/admin/member/changePassword', [
    check('memberCode').isString(),
    check('newPassword').isString()
], AuthenticateAdmin, adminManageController.OnChangePasswordMember)
router.post('/api/admin/member/changeStatus', [
    check('memberCode').isString(),
    check('status').isString()
], AuthenticateAdmin, membersController.OnChangeStatus)
router.get('/api/admin/member/delete/:code', AuthenticateAdmin, membersController.OnDeleteMember)
/** for manage package */
router.get('/api/admin/package/get', AuthenticateAdmin, packageController.OnGetPackageAll)
router.post('/api/admin/package/update', upload.single('image'), AuthenticateAdmin, [
    check('packageId').notEmpty(),
    check('day').isNumeric().notEmpty(),
    check('content').isString().notEmpty(),
    check('price').isNumeric().notEmpty(),
    check('grossProfit').isNumeric().notEmpty()
], packageController.OnUpdatePackage)
/** for manage package order */
router.get('/api/admin/packageOrder/get', AuthenticateAdmin, packageController.OnGetMemberPackageOrder)
router.get('/api/admin/package/:paymentId/confirm', AuthenticateAdmin, packageController.OnConfirmPayment)
/** for manage review */
router.get('/api/admin/review/get', AuthenticateAdmin, reviewController.OnGetReview)
router.post('/api/admin/changeStatusReview', [
    check('id').notEmpty(),
    check('display').isString().notEmpty()
], AuthenticateAdmin, reviewController.OnChangeStatusReview)
router.post('/api/admin/review/update', AuthenticateAdmin, [
    check('review_id').isNumeric(),
    check('display').isString()
], reviewController.OnUpdateReview)
router.get('/api/admin/review/delete/:id', AuthenticateAdmin, reviewController.OnDeleteReview)
/**for upload video */
router.post('/api/admin/store/videoUpload', upload.single('video'), AuthenticateAdmin, [
    check('storeCode').isNumeric().notEmpty()
], contentController.OnUploadVideoStore)
router.get('/api/admin/content/get', AuthenticateAdmin, contentController.OnGetContentAll)
router.post('/api/admin/content/update', [
    check('id').notEmpty(),
    check('type').isString(),
    check('title').isString(),
    check('content').isString(),
    check('h1').isString(),
    check('h2').isString(),
], upload.single('image'), AuthenticateAdmin, contentController.OnUpdateContent)
router.post('/api/admin/content/changeVideo', [
    check('id').notEmpty(),
    check('pathUrl').isString(),
    check('isFile').isBoolean(),
], upload.single('video'), AuthenticateAdmin, contentController.OnChangeVideoContent)
router.post('/api/admin/changeStatusContent', [
    check('id').notEmpty(),
    check('display').isString().notEmpty()
], AuthenticateAdmin, contentController.OnChangeStatusContent)
/** for manage store */
router.get('/api/admin/store/get', AuthenticateAdmin, storeController.OnGetStoreAll)
router.get('/api/admin/store/getDetails/:code', AuthenticateAdmin, adminStoreController.OnGetStoreDetails)
router.post('/api/admin/store/changeStatusStore', [
    check('storeCode').isString(),
    check('status').isString(),
], AuthenticateAdmin, storeController.OnChangeStatusStore)
router.post('/api/admin/store/updateProfile', AuthenticateAdmin, upload.single('image'), [
    check('storeCode').isString(),
    check('name').isString(),
    check('age').isString(),
    check('weight').isString(),
    check('height').isString(),
    check('bwh').isString(),
], storeController.OnUpdateProfile)
router.get('/api/admin/productRecommend/:sex', AuthenticateAdmin, adminStoreController.OnGetProductRecommend)
router.post('/api/admin/storeProduct/Create', AuthenticateAdmin, upload.fields([{name: 'standard', maxCount: 2}, {name: 'premium', maxCount: 2}]), [
    check('storeCode').isString(),
    check('name_member').isString(),
    check('content_member').isString(),
    check('name_premium').isString(),
    check('content_premium').isString(),
    check('price_standard').isNumeric(),
    check('price_premium').isNumeric(),
    check('clip').isString(),
], adminStoreController.OnCreateProduct)
router.post('/api/admin/storeProductPre/Create', AuthenticateAdmin, upload.fields([{name: 'premium', maxCount: 2}]), [
    check('storeCode').isString(),
    check('name_premium').isString(),
    check('content_premium').isString(),
    check('price_premium').isNumeric(),
    check('clip').isString(),
], adminStoreController.OnCreateProductPre)
router.post('/api/admin/storePost/create', AuthenticateAdmin, upload.array('image'), [
    check('storeCode').isString(),
], postController.OnCreatePostAdmin)
router.get('/api/admin/storePost/delete/:code', AuthenticateAdmin, postController.OnDeletePost)
router.get('/api/admin/storeProduct/delete/:code', AuthenticateAdmin, productController.OnDeleteProduct)
router.post('/api/admin/store/updateConcept', AuthenticateAdmin, [
    check('storeCode').isString(),
    check('concept').isString()
], storeController.OnUpdateConcept)
router.post('/api/admin/storeProduct/setRecommend', [
    check('productCode').isString().notEmpty(),
    check('recommend').isString().notEmpty(),
], AuthenticateAdmin, adminStoreController.OnSetProductRecommend)
router.post('/api/admin/storeProduct/setPriority', AuthenticateAdmin, [
    check('productCode').isString().notEmpty(),
    check('priority').notEmpty(),
], adminStoreController.OnSetProductPriority)
router.post('/api/admin/storeProduct/setPriorityRecommend', AuthenticateAdmin, [
    check('productCode').isString().notEmpty(),
    check('priority').notEmpty(),
], adminStoreController.OnSetProductPriorityRecommend)
router.post('/api/admin/store/changePassword', [
    check('storeCode').isString(),
    check('newPassword').isString()
], AuthenticateAdmin, adminManageController.OnChangePasswordStore)
/** for order */
router.get('/api/admin/orders/read/:number', AuthenticateAdmin, orderController.OnReadOrder)
router.get('/api/admin/orders/get', AuthenticateAdmin, orderController.OnGetOrderAdmin)
router.post('/api/admin/orders/updatePaymentStatus', [
    check('orderNumber').isString(),
    check('status').isString()
], AuthenticateAdmin, orderController.OnUpdatePaymentStatus)
router.post('/api/admin/orders/updateStatus', [
    check('orderNumber').isString(),
    check('status').isString(),
    check('message').isString(),
], AuthenticateAdmin, orderController.OnUpdateStatus)
router.post('/api/admin/orders/updateProductStatus', [
    check('orderNumber').isString(),
    check('productId').isNumeric(),
    check('status').isString(),
], AuthenticateAdmin, orderController.OnUpdateProductStatus)
router.post('/api/admin/orders/updateGpProduct', [
    check('orderNumber').isString(),
    check('productId').isNumeric(),
    check('gp').isNumeric(),
], AuthenticateAdmin, orderController.OnUpdateGPInOrder)
/** for report */
router.post('/api/admin/storeReport/export', AuthenticateAdmin, [
    check('start'),
    check('end')
], reportController.OnExportStoreReport)
router.post('/api/admin/storeReport/get', AuthenticateAdmin, [
    check('start'),
    check('end')
], reportController.OnGetStoreReport)
router.post('/api/admin/customerReport/export', AuthenticateAdmin, [
    check('start'),
    check('end')
], reportController.OnExportCustomerReport)
router.post('/api/admin/customerReport/get', AuthenticateAdmin, [
    check('start'),
    check('end')
], reportController.OnGetCustomerReport)
router.post('/api/admin/orderReport/export', AuthenticateAdmin, [
    check('start'),
    check('end')
], reportController.OnExportOrderReport)
router.post('/api/admin/orderReport/get', AuthenticateAdmin, [
    check('start'),
    check('end')
], reportController.OnGetOrderReport)
/** for settings */
router.post('/api/admin/setGrossProfit', [
    check('gp').notEmpty().isString()
],AuthenticateAdmin, adminManageController.OnSetGrossProfit)
router.get('/api/admin/getSetting', AuthenticateAdmin, adminManageController.OnGetDataSettings)
router.post('/api/admin/updateSetting',upload.single('image'), [
    check('settingName').notEmpty().isString(),
    check('settingValue').notEmpty().isString()
],AuthenticateAdmin, adminManageController.OnUpdateSettings)
/** for chat */
router.post('/api/admin/chatToMember', [
    check('memberCode').isString(),
    check('message').isString(),
], AuthenticateAdmin, chatController.OnSendMessageToMember)
router.get('/api/admin/readChat/:code', AuthenticateAdmin, chatController.OnReadMessageAdmin)
router.get('/api/admin/getOldChat', AuthenticateAdmin, chatController.OnGetOldChatAdmin)
/** for log */
router.get('/api/admin/getLog', AuthenticateAdmin, adminManageController.OnGetLogSignin)
router.post('/api/admin/changeStatusLog', [
    check('adminCode').isString(),
    check('status').isString(),
], AuthenticateAdmin, adminManageController.OnChangeStatusLog)
/** for dashboard */
router.get('/api/admin/getDashboard', AuthenticateAdmin, reportController.OnGetDashboardData)
/** for banner and ads */
router.post('/api/admin/updateSlide', upload.single('image'), [
    check('id').isString(),
    check('position').isString(),
], AuthenticateAdmin, adsController.OnUpdateAds)
router.post('/api/admin/createSlide', upload.single('image'), [
    check('position').isString(),
], AuthenticateAdmin, adsController.OnCreateAds)
router.get('/api/admin/deleteSlide/:id', AuthenticateAdmin, adsController.OnDeleteAds)
router.post('/api/admin/updateBanner', upload.single('image'), [
    check('title').isString(),
    check('display').isString(),
    check('content').isString(),
    check('id').isNumeric(),
], AuthenticateAdmin, bannerController.OnUpdateBanner)
router.post('/api/admin/changeDisplayBanner', [
    check('id').isNumeric(),
    check('display').isBoolean()
], AuthenticateAdmin, bannerController.OnChangeDisplayBanner)
// router.post('/api/admin/changeDisplaySlide', [
//     check('position').isString(),
//     check('display').isBoolean()
// ], AuthenticateAdmin, adsController.OnChangeDisplayAds)
router.post('/api/admin/resetPassword', [
    check('username').isString(),
    check('email').isString().isEmail()
], userController.OnResetPassword)
router.get('/api/admin/checkReset/:token', userController.OnCheckResetToken)
router.post('/api/admin/updatePassword', [
    check('newPassword').isString(),
    check('token').isString()
], userController.OnUpdateNewPassword)

export const adminRouter = router