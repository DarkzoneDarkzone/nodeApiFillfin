import { AuthenticateAdmin } from './../middleware/AuthAdmin';
import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import { UserController } from '../controllers/UserController'
import { BankController } from '../controllers/BankController'
import { MembersController } from '../controllers/MembersController';
import { OrderController } from '../controllers/OrderController';

const upload = multerUpload.uploadImage()
const router = Router()
const userController = new UserController()
const bankController = new BankController()
const membersController = new MembersController()
const orderController = new OrderController()
/** for authenticate */
router.post('/api/admin/register', upload.single('image'), AuthenticateAdmin, [
    check('username').isString(),
    check('password').isString(),
    check('email').isString(),
    check('name').isString(),
], userController.OnRegister)
router.post('/api/admin/signin', AuthenticateAdmin, [
    check('username').isString(),
    check('password').isString()
], userController.OnSignin)
router.post('/api/admin/update', upload.single('image'), AuthenticateAdmin, [
    check('email').isString(),
    check('name').isString()
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

// router.get('/api/admin/orders/get', AuthenticateAdmin, orderController.)

export const adminRouter = router