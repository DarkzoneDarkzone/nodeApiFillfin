import { ViewService } from './../services/View.service';
import { Review } from './../models/review';
import { ViewProduct } from './../models/viewProduct';
import { Members } from './../models/members';
import { sequelize } from './../util/database';
import { Store } from './../models/store';
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import { validationResult } from 'express-validator'
import * as jwt from 'jsonwebtoken'

export class StoreController extends ViewService{
    OnRegister = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await Store.findOne({where:{username: req.body.username}})
        const finding_member = await Members.findOne({where:{username: req.body.username}})
        if(finding || finding_member){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'username already used.'
            })
        }
        /* generate access_token for user */
        const access_token = jwt.sign({
            username: req.body.username,
            gender: req.body.gender,
            at: new Date().getTime()
        }, `${Config.secretKey}`, { expiresIn: '1d' })
        /* generate refresh_token when register and no expire */
        const refresh_token = jwt.sign({
            username: req.body.username,
            gender: req.body.gender,
            at: new Date().getTime(),
            token: access_token
        }, `${Config.secretKey}`)
        const store_str = req.body.username+req.body.gender+Math.random().toString().substr(2, 8)+moment().unix()
        const store_code = await bcrypt.hash(store_str, 10)
        const store_member_code = await bcrypt.hash(store_code, 10)
        const hashPass = await bcrypt.hash(req.body.password, 10)
        const t = await sequelize.transaction()
        try {
            let profile_img = ""
            if(req.file){
                let upload = "/uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname);
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
                .resize(200, 200)
                .withMetadata()
                .jpeg({ quality: 95})
                .toFile( path.resolve(req.file.destination, originalname+ext))
                .then((data: any) => {
                    fs.unlink( req.file.path, (err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                    return upload+originalname+ext
                })
                profile_img = image
            }
            const result = await Store.create({
                store_code: store_code.replace(/\W/g,""),
                access_token: access_token,
                refresh_token: refresh_token,
                name: req.body.name,
                username: req.body.username,
                password: hashPass,
                age: req.body.age,
                profile_img: profile_img,
                profile_video: '',
                concept: '',
                weight: '',
                height: '',
                bwh: '',
                gender: req.body.gender,
                status: 'active'
            }, { transaction: t })
            const store_member = await Members.create({
                member_code: store_member_code.replace(/\W/g,""),
                access_token: '',
                refresh_token: refresh_token,
                username: req.body.username,
                password: req.body.password,
                gender: req.body.gender,
                isStore: 'yes'
            }, { transaction: t })
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch(error){
            await t.rollback()
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnSingin = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array
            })
        }
        const finding = await Store.findOne({where:{username: req.body.username}})
        if(!finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'user was not found.'
            })
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, finding.password)
        if(!isPasswordCorrect){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'password was incorrect.'
            })
        }
        try {
            /* generate access_token for user */
            const access_token = jwt.sign({
                store_id: finding.id,
                section: 'store',
                store_code: finding.store_code,
                username: finding.username,
                gender: finding.gender,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '1d' })
            finding.access_token = access_token
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'login success.',
                data: {
                    access_token: access_token,
                    refresh_token: finding.refresh_token,
                    storeName: finding.name,
                    storeCode: finding.store_code
                }
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnUpdateProfile = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await Store.findOne({where:{store_code: req.body.storeCode}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message:'error',
                description: 'store is not found.'
            })
        }
        try {
            if(req.file){
                let upload = "/uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname)
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
                .resize(200, 200)
                .withMetadata()
                .jpeg({ quality: 95})
                .toFile( path.resolve(req.file.destination, originalname+ext))
                .then((data: any) => {
                    fs.unlink( req.file.path, (err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                    return upload+originalname+ext
                })
                finding.profile_img = image
            }
            finding.name = req.body.name,
            finding.age = req.body.age,
            finding.weight = req.body.weight,
            finding.height = req.body.height,
            finding.bwh = req.body.bwh,
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'update data success.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetDataAll = async(req: any, res: any) => {
        const storeToken = req.authStore
        const store = await Store.findOne({
            where:{store_code: storeToken.store_code},
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'access_token', 'store_code', 'refresh_token', 'username', 'password']
            },
        })
        if(!store){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'store was not found.'
            })
        }
        const product = await ViewProduct.findAll({
            where:{
                package_id: "PACKAGE_EXCLUSIVE",
                store_id: store.id,
                status: 'active'
            },
            attributes: ['product_code', 'name_member', 'content_member', 'name_premium', 'content_premium', 'price_standard', 'price_premium', 'recommend', 'pre_order',
                        'status', 'sex', 'clip', 'store_id', 'path_img', 'package_id', 'buy_limit', 'show_gift', 'price_sell', 'createdAt',
                [sequelize.fn('GROUP_CONCAT', sequelize.col('path_img')), 'product_img']
            ],
            group: ['store_id', 'id'],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        const review = await Review.findAll({
            where:{store_id: store.id},
            order: [
                ['createdAt', 'DESC']
            ]
        })
        const store_post = await this.query_store_post(store.id)
        let arr_product: any[] = []
        let arr_product_pre: any[] = []
        product.forEach((data: any) => {
            const arr_data = {
                product_code: data.product_code,
                name: data.name_premium,
                content_product: data.content_premium,
                price: data.price_premium,
                recommend: data.recommend,
                sex: data.sex,
                clip: data.clip,
                show_gift: data.show_gift,
                preOrder: data.pre_order,
                product_img: data.product_img,
            }
            if(data.pre_order == "no"){
                arr_product.push(arr_data)
            } else {
                arr_product_pre.push(arr_data)
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: {
                store_detail: store,
                all_product: arr_product,
                pre_order: arr_product_pre,
                store_post: store_post,
                review: review
            }
        })
    }
    OnUpdateConcept = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const store = req.authStore
        try {
            const finding = await Store.findOne({where:{store_code: store.store_code}})
            finding.concept = req.body.concept
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'concept was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
}