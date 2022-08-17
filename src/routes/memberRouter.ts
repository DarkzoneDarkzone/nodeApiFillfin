import { CartController } from './../controllers/CartController';
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
const cartController = new CartController()

/** for authenticate */
router.post('/api/member/signin',[check('username').notEmpty().isString(), check('password').notEmpty().isString(),], membersController.OnSignin)
router.post('/api/member/update', AuthenticateMember, [
    check('username').isString().notEmpty()
], membersController.OnUpdate)
router.post('/api/member/register', [
    check('username').notEmpty().isString(),
    check('password').notEmpty().isString(),
    check('gender').notEmpty().isString(),
], membersController.OnCreate)
router.post('/api/member/checkToken', [
    check('token').isString()
], membersController.OnCheckAccessToken)
router.post('/api/member/getToken', [
    check('token').isString()
], membersController.OnGetAccessToken)
/** for package */
router.get('/api/package/get', packageController.OnGetPackageAll)
router.get('/api/package/statusPayment/:member_code', packageController.OnCheckStatusPayment)
router.post('/api/package/getSelect', [
    check('memberCode').isString().notEmpty(),
    check('packageId').notEmpty(),
], packageController.OnGetPackage)
router.get('/api/package/checkPackage/:code', packageController.OnCheckPackageMember)
router.post('/api/package/createPayment', upload.single('slip'), [
    check('memberCode').notEmpty().isString(),
    check('bankRef').notEmpty(),
    check('packageId').notEmpty(),
], packageController.OnCreatePayment)
router.post('/api/package/renewal', upload.single('slip'), AuthenticateMember, [
    check('bankRef').notEmpty(),
], packageController.OnRenewalPackage)
/** for show product */
router.get('/api/product/:code', AuthenticateMemberAndGuest, productController.OnGetProductByCode)
router.get('/api/product/:gender/store/:store_code', AuthenticateMemberAndGuest, productController.OnGetProduct)
router.get('/api/product/:gender/allStore', AuthenticateMemberAndGuest, productController.OnGetStoreAll)
/** for order product */
router.get('/api/member/cart/add/:code', AuthenticateMember, cartController.OnAddProductToCart)
router.get('/api/member/cart/delete/:code', AuthenticateMember, cartController.OnDeleteProductFromCart)
router.get('/api/member/cart/get', AuthenticateMember, cartController.OnGetProductInCart)
router.get('/api/member/cart/checkProduct', AuthenticateMember, cartController.OnCheckProductInCart)
router.post('/api/member/createOrder', upload.single('image'), [
    check('name').notEmpty().isString(),
    check('address').notEmpty().isString(),
    check('phone').notEmpty().isString(),
    check('district').notEmpty().isString(),
    check('subdistrict').notEmpty().isString(),
    check('province').notEmpty().isString(),
    check('code').notEmpty().isString(),
    check('note').notEmpty().isString(),
    check('bank_ref').notEmpty().isNumeric()
], AuthenticateMember, orderController.OnCreateOrder)
router.post('/api/member/order/review', AuthenticateMember, [
    check('message').isString().notEmpty(),
    check('orderNumber').isString().notEmpty(),
    check('productId').isNumeric().notEmpty(),
    check('star').isNumeric().notEmpty()
], orderController.OnReview)
router.get('/api/member/getOrder', AuthenticateMember, orderController.OnGetOrderMember)
router.get('/api/bank/get', bankController.OnGetBankAll)

export const memberRouter = router