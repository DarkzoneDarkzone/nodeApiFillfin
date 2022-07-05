import { BankController } from './../controllers/BankController';
import { ProductController } from './../controllers/ProductController';
import { AuthenticateMemberAndGuest } from './../middleware/AuthMemberAndGuest';
import { PackageController } from './../controllers/PackageController';
import { OrderController } from './../controllers/OrderController';
import { AuthenticateMember } from './../middleware/AuthMember';
import { MembersController } from '../controllers/MembersController'
import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'

const upload = multerUpload.uploadImage()
const router = Router()
const membersController = new MembersController()
const orderController = new OrderController()
const packageController = new PackageController()
const productController = new ProductController()
const bankController = new BankController()
/** for authenticate */
router.post('/api/member/signin',[check('username').notEmpty().isString(), check('password').notEmpty().isString(),], membersController.OnSignin)
router.post('/api/member/update', AuthenticateMember, [
    check('username').isString().notEmpty()
], membersController.OnUpdate)
router.post('/api/member/register', [
    check('username').notEmpty().isString(),
    check('password').notEmpty().isString(),
    check('gender').notEmpty().isString(),
    check('package_id').notEmpty().isString(),
], membersController.OnCreate)
router.post('/api/member/checkToken', membersController.OnCheckAccessToken)
router.post('/api/member/getToken', membersController.OnGetAccessToken)
/** for package */
router.get('/api/package/get', packageController.OnGetPackageAll)
router.get('/api/package/getBill/:member_code', packageController.OnGetPackageOrder)
router.get('/api/package/statusPayment/:member_code', packageController.OnCheckStatusPayment)
router.post('/api/package/createOrder', [
    check('member_id').notEmpty(),
    check('gender').notEmpty().isString(),
    check('package_id').notEmpty(),
], packageController.OnCreatePackageOrder)
router.post('/api/package/createPayment', upload.single('slip'), [
    check('member_code').notEmpty(),
    check('bank_ref').notEmpty(),
], packageController.OnCreatePayment)
/** for show product */
router.get('/api/product/:gender/store/:store_code', AuthenticateMemberAndGuest, productController.OnGetProduct)
router.get('/api/product/:gender/allStore', AuthenticateMemberAndGuest, productController.OnGetStoreAll)
/** for order product */
router.get('/api/product/addToCart/:code', AuthenticateMember, productController.OnAddProductToCart)
router.post('/api/member/createOrder', [
    check('totalprice').notEmpty().isNumeric(),
    check('netprice').notEmpty().isNumeric(),
    check('name').notEmpty().isString(),
    check('address').notEmpty().isString(),
    check('phone').notEmpty().isString(),
    check('district').notEmpty().isString(),
    check('subdistrict').notEmpty().isString(),
    check('province').notEmpty().isString(),
    check('code').notEmpty().isString(),
    check('note').notEmpty().isString(),
    check('bank_ref').notEmpty().isNumeric(),
], AuthenticateMember, orderController.OnCreateOrder)
router.get('/api/member/getOrder', AuthenticateMember, orderController.OnGetOrderMember)

router.get('/api/bank/get', bankController.OnGetBankAll)

export const memberRouter = router