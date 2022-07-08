import { BannerController } from './../controllers/BannerController';
import { Router } from 'express'
import { check } from 'express-validator'
import { AdsController } from '../controllers/AdsController'
import * as multerUpload from '../util/multerUpload'
import { AuthenticateAdmin } from '../middleware/AuthAdmin';

const upload = multerUpload.uploadImage()
const router = Router()
const adsController = new AdsController()
const bannerController = new BannerController()

router.get('/api/website/getAds/:page', adsController.OnGetAds)
router.post('/api/website/getBanner', [
    check('page').isString().notEmpty(),
    check('gender').isString().notEmpty()
], bannerController.OnGetBanner)

router.post('/api/website/createAds', upload.single('image'), [
    check('position').isString(),
    check('priority').isString(),
], AuthenticateAdmin, adsController.OnCreateAds)

router.post('/api/website/updateAds', upload.single('image'), [
    check('position').isString(),
    check('priority').isString(),
], AuthenticateAdmin, adsController.OnUpdateAds)

router.post('/api/website/updateBanner', upload.single('image'), [
    check('title').isString(),
    check('display').isString(),
    check('content').isString(),
], AuthenticateAdmin, bannerController.OnUpdateBanner)

export const websiteRouter = router