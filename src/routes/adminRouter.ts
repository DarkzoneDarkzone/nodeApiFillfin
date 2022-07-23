import { ProductController } from './../controllers/ProductController';
import { PostController } from './../controllers/PostController';
import { AdminStoreController } from './../controllers/AdminStoreController';
import { StoreController } from './../controllers/StoreController';
import { PackageController } from './../controllers/PackageController' 
import { AuthenticateAdmin } from './../middleware/AuthAdmin' 
import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import { UserController } from '../controllers/UserController'
import { BankController } from '../controllers/BankController'
import { MembersController } from '../controllers/MembersController' 
import { OrderController } from '../controllers/OrderController' 
import { ReviewController } from '../controllers/ReviewController'

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

/** for authenticate */
router.post('/api/admin/register', upload.single('image'), AuthenticateAdmin, [
    check('username').isString(),
    check('password').isString(),
    check('email').isString(),
    check('name').isString(),
], userController.OnRegister)
router.post('/api/admin/signin', [
    check('username').isString(),
    check('password').isString()
], userController.OnSignin)
router.post('/api/admin/update', upload.single('image'), AuthenticateAdmin, [
    check('adminCode').isString(),
    check('email').isString(),
    check('name').isString(),
    check('permission').isNumeric(),
    check('statusConfirm').isString(),
    check('status').isString(),
], userController.OnUpdate)
router.get('/api/admin/delete/:code', AuthenticateAdmin, userController.OnDelete)
/** for manage bank */
router.get('/api/admin/bank/get', AuthenticateAdmin, bankController.OnGetBankAll)
router.post('/api/admin/bank/create', AuthenticateAdmin, [
    check('name').isString(),
    check('bank_number').isString(),
    check('branch').isString(),
    check('bank_id').isNumeric(),
], bankController.OnCreateBankAccount)
router.post('/api/admin/bank/update', AuthenticateAdmin, [
    check('name').isString(),
    check('bank_number').isString(),
    check('branch').isString(),
    check('bank_id').isNumeric(),
], bankController.OnUpdateBankAccount)
/** */
router.get('/api/admin/member/get', AuthenticateAdmin, membersController.OnGetAll)
router.get('/api/admin/orders/get', AuthenticateAdmin, orderController.OnGetOrderStore)
/** for manage package */
router.get('/api/admin/package/get', AuthenticateAdmin, packageController.OnGetPackageAll)
router.post('/api/admin/package/update', upload.single('image'), AuthenticateAdmin, [
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
router.post('/api/admin/review/update', AuthenticateAdmin, [
    check('review_id').isNumeric(),
    check('display').isString()
], reviewController.OnUpdateReview)
/**for upload video */
router.post('/api/admin/store/videoUpload', upload.single('video'), AuthenticateAdmin, [
    check('storeId').isNumeric().notEmpty()
], userController.OnUploadVideoStore)
router.post('/api/admin/content/update', [
    check('type').isString(),
    check('title').isString(),
    check('content').isString(),
    check('h1').isString(),
    check('h2').isString(),
    check('display').isString()
], upload.single('video'), AuthenticateAdmin, userController.OnUpdateContent)
/** for manage store */
router.post('/api/admin/store/updateProfile', AuthenticateAdmin, upload.single('image'), [
    check('storeCode').isString(),
    check('name').isString(),
    check('age').isString(),
    check('weight').isString(),
    check('height').isString(),
    check('bwh').isString(),
], storeController.OnUpdateProfile)
router.post('/api/admin/storeProduct/Create', AuthenticateAdmin, upload.array('image'), [
    check('storeCode').isString(),
    check('name_member').isString(),
    check('content_member').isString(),
    check('name_premium').isString(),
    check('content_premium').isString(),
    check('price_standard').isNumeric(),
    check('price_premium').isNumeric(),
    check('clip').isString(),
], adminStoreController.OnCreateProduct)
router.post('/api/admin/storeProductPre/Create', AuthenticateAdmin, upload.array('image'), [
    check('storeCode').isString(),
    check('name_premium').isString(),
    check('content_premium').isString(),
    check('price_premium').isNumeric(),
    check('clip').isString(),
], adminStoreController.OnCreateProductPre)
router.post('/api/admin/storePost/create', AuthenticateAdmin, upload.array('image'), [
    check('storeCode').isString(),
    check('caption').notEmpty().isString()
], postController.OnCreatePost)
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
    check('priority').isNumeric().notEmpty(),
], adminStoreController.OnSetProductPriority)

export const adminRouter = router