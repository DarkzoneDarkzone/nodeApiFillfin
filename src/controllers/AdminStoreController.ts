import { PostImage } from './../models/postImage';
import { Post } from './../models/post';
import { ProductImage } from './../models/productImage';
import { Product } from './../models/product';
import { ViewService } from './../services/View.service';
import { Review } from './../models/review';
import { ViewProduct } from './../models/viewProduct';
import { Members } from './../models/members';
import { sequelize } from './../util/database';
import { Op } from 'sequelize'
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

export class AdminStoreController {
    OnCreateProduct = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const store_profile = await Store.findOne({where:{store_code: req.body.storeCode}})
        if(!store_profile){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'store was not found.'
            })
        }
        const product_str = store_profile.id + Math.random().toString().substr(2, 10)+moment().unix();
        const product_code = await bcrypt.hash(product_str, 10);
        const t = await sequelize.transaction()
        try {
            const product_result = await Product.create({
                product_code: product_code.replace(/\W/g,""),
                name_member: req.body.name_member,
                content_member: req.body.content_member,
                name_premium: req.body.name_premium,
                content_premium: req.body.content_premium,
                price_standard: req.body.price_standard,
                price_premium: req.body.price_premium,
                recommend: "no",
                pre_order: "no",
                status: 'active',
                sex: store_profile.gender,
                clip: req.body.clip,
                store_id: store_profile.id
            }, { transaction: t })
            let productImage: any[] = []
            let count = 0
            if(req.files.standard){
                for (const file of req.files.standard) {
                    let upload = "/uploads"+file.destination.split("uploads").pop()
                    let dest = file.destination
                    var ext = path.extname(file.originalname);
                    let originalname = path.basename(file.originalname, ext)
                    for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                        originalname = originalname.split('(')[0]
                        originalname += '('+i+')'
                    }
                    const image = await sharp(file.path)
                    .resize(200, 200)
                    .withMetadata()
                    .jpeg({ quality: 95})
                    .toFile( path.resolve(file.destination, originalname+ext))
                    .then((data: any) => {
                        fs.unlink( file.path, (err) => {
                            if(err){
                                console.log(err)
                            }
                        })
                        return upload+originalname+ext
                    })
                    const arr = {
                        product_id: product_result.id,
                        path_img: image,
                        hover: (count==1)?"yes":"no",
                        display: "yes",
                        premium: "no",
                    }
                    count++
                    productImage.push(arr)
                }
            }
            if(req.files.premium){
                for (const file of req.files.premium) {
                    let upload = "/uploads"+file.destination.split("uploads").pop()
                    let dest = file.destination
                    var ext = path.extname(file.originalname);
                    let originalname = path.basename(file.originalname, ext)
                    for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                        originalname = originalname.split('(')[0]
                        originalname += '('+i+')'
                    }
                    const image = await sharp(file.path)
                    .resize(200, 200)
                    .withMetadata()
                    .jpeg({ quality: 95})
                    .toFile( path.resolve(file.destination, originalname+ext))
                    .then((data: any) => {
                        fs.unlink( file.path, (err) => {
                            if(err){
                                console.log(err)
                            }
                        })
                        return upload+originalname+ext
                    })
                    const arr = {
                        product_id: product_result.id,
                        path_img: image,
                        hover: "no",
                        display: "yes",
                        premium: "yes",
                    }
                    count++
                    productImage.push(arr)
                }
            }
            const product_image = await ProductImage.bulkCreate(productImage, { transaction : t})
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
    OnCreateProductPre = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const store_profile = await Store.findOne({where:{store_code: req.body.storeCode}})
        if(!store_profile){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'store was not found.'
            })
        }
        const product_str = store_profile.id + Math.random().toString().substr(2, 10)+moment().unix()
        const product_code = await bcrypt.hash(product_str, 10)
        const t = await sequelize.transaction()
        try {
            const product_result = await Product.create({
                product_code: product_code.replace(/\W/g,""),
                name_member: '',
                content_member: '',
                name_premium: req.body.name_premium,
                content_premium: req.body.content_premium,
                price_standard: req.body.price_premium,
                price_premium: req.body.price_premium,
                recommend: "no",
                pre_order: "yes",
                status: 'active',
                sex: store_profile.gender,
                clip: req.body.clip,
                store_id: store_profile.id
            }, { transaction: t })
            let productImage: any[] = []
            if(req.files.premium){
                for (const file of req.files.premium) {
                    let upload = "/uploads"+file.destination.split("uploads").pop()
                    let dest = file.destination
                    var ext = path.extname(file.originalname);
                    let originalname = path.basename(file.originalname, ext)
                    for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                        originalname = originalname.split('(')[0]
                        originalname += '('+i+')'
                    }
                    const image = await sharp(file.path)
                    .resize(200, 200)
                    .withMetadata()
                    .jpeg({ quality: 95})
                    .toFile( path.resolve(file.destination, originalname+ext))
                    .then((data: any) => {
                        fs.unlink( file.path, (err) => {
                            if(err){
                                console.log(err)
                            }
                        })
                        return upload+originalname+ext
                    })
                    const arr = {
                        product_id: product_result.id,
                        path_img: image,
                        hover: "no",
                        display: "yes",
                        premium: "yes",
                    }
                    productImage.push(arr)
                }
            }
            const product_image = await ProductImage.bulkCreate(productImage, { transaction : t})
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
    OnCreatePost = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const store = await Store.findOne({where:{store_code: req.body.storeCode}})
        if(!store){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'store was not found.'
            })
        }
        const all_post = await Post.findAll({where:{store_id: store.id, status: 'active'}})
        if(all_post.length > 10){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'your post has limited.'
            })
        }
        const t = await sequelize.transaction()
        try {
            const str_post_code = `${store.code}${moment().format('YYYYMMDDHHmmss')}`
            let post_code = await bcrypt.hash(str_post_code, 10)
            const post = await Post.create({
                post_code: post_code.replace(/\W/g,""),
                store_id: store.id,
                display: "yes",
                caption: req.body.caption,
                status: "active"
            }, { transaction : t})
            let postImage: any[] = []
            if(req.files){
                let count = 0
                for (const file of req.files) {
                    let upload = "/uploads"+file.destination.split("uploads").pop()
                    let dest = file.destination
                    var ext = path.extname(file.originalname);
                    let originalname = path.basename(file.originalname, ext)
                    for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                        originalname = originalname.split('(')[0]
                        originalname += '('+i+')'
                    }
                    const image = await sharp(file.path)
                    .resize(200, 200)
                    .withMetadata()
                    .jpeg({ quality: 95})
                    .toFile( path.resolve(file.destination, originalname+ext))
                    .then((data: any) => {
                        fs.unlink( file.path, (err) => {
                            if(err){
                                console.log(err)
                            }
                        })
                        return upload+originalname+ext
                    })
                    const arr = {
                        post_id: post.id,
                        path_image: image,
                        priority: count++
                    }
                    postImage.push(arr)
                }
            }
            const post_image = await PostImage.bulkCreate(postImage, { transaction : t})
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch(error){
            console.log(error)
            await t.rollback()
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
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
        const store = await Store.findOne({where:{store_code: req.body.storeCode}})
        if(!store){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'store was not found.'
            })
        }
        try {
            store.concept = req.body.concept
            store.save()
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
    OnSetProductRecommend = async(req: any,  res: any) => {
        const product = await Product.findOne({where:{product_code: req.body.productCode}})
        try {
            product.recommend = req.body.recommend
            product.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'product status was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnSetProductPriority = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const product = await Product.findOne({where:{product_code: req.body.productCode}})
        try {
            product.priority = req.body.priority
            product.save()
            const updateAds = await Product.update(
                {
                    priority: +1,
                },{
                    where: {
                        store_id: product.store_id,
                        priority: { [Op.gte]: req.body.priority}
                    }
                })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'product was updated.'
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