import { ContentController } from './../controllers/ContentController';
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
const contentController = new ContentController()

router.get('/api/website/getSlide/:page', adsController.OnGetAds)
router.post('/api/website/getBanner', [
    check('page').isString().notEmpty(),
    check('gender').isString().notEmpty()
], bannerController.OnGetBanner)
router.get('/api/website/content/:type', contentController.OnGetContent)

export const websiteRouter = router