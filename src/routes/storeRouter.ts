import { ProductController } from './../controllers/ProductController';
import { StoreController } from './../controllers/StoreController';
import { PostController } from './../controllers/PostController'
import { AuthenticateStore } from './../middleware/AuthStore';
import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'

const upload = multerUpload.uploadImage()
const router = Router()
const storeController = new StoreController()
const postController = new PostController()
const productController = new ProductController()

router.get('/api/store/getDataAll', AuthenticateStore, storeController.OnGetDataAll)

router.post('/api/store/signin', [
    check('username').isString().notEmpty(),
    check('password').isString().notEmpty()
], storeController.OnSingin)

router.post('/api/store/register', upload.single('image'), [
    check('name').isString(),
    check('username').isString(),
    check('password').isString(),
    check('age').isString(),
    check('gender').isString(),
], storeController.OnRegister)

router.put('/api/store/updateProfile', AuthenticateStore, upload.single('image'), [
    check('name').isString(),
    check('age').isString(),
    check('weight').isString(),
    check('height').isString(),
    check('bwh').isString(),
], storeController.OnUpdateProfile)

router.post('/api/store/product/create', AuthenticateStore, upload.array('image'), [
    check('name_member').isString(),
    check('content_member').isString(),
    check('name_premium').isString(),
    check('content_premium').isString(),
    check('price_standard').isNumeric(),
    check('price_premium').isNumeric(),
    check('clip').isString(),
], productController.OnCreateProduct)

router.post('/api/store/post/create', AuthenticateStore, upload.array('image'), [
    check('caption').notEmpty().isString()
], postController.OnCreatePost)

export const storeRouter = router