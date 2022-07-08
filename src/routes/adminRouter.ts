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
const bankController = new BankController()
const membersController = new MembersController()
const orderController = new OrderController()
const packageController = new PackageController()
const reviewController = new ReviewController()

router.post('/api/testt', upload.single('video'), AuthenticateAdmin, userController.OnUploadVideoStore)
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

export const adminRouter = router