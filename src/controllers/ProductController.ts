import { ProductImage } from './../models/productImage';
import { ViewProductAllStore } from './../models/viewProductAllStore';
import { sequelize } from './../util/database';
import { Product } from './../models/product';
import { Store } from './../models/store';
import { Op } from 'sequelize'
import * as Config from '../util/config'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { ViewService } from '../services/View.service'
import { ViewProduct } from '../models/viewProduct';
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'

export class ProductController extends ViewService {
    OnGetStoreAll = async(req: any, res: any) => {
        const page: number = parseInt(req.query.page) || 1
        const store_name = req.query.search || ""
        const limit: number = 15
        const offset: number = (page*limit)-limit
        const member = req.authMember
        const gender = req.params.gender
        let canbuy = false
        let status_standard = true
        let package_member = "PACKAGE_MEMBER"
        if(member){
            const member_package: any = await this.view_member_package(member.member_id, gender)
            if(member_package){
                canbuy = true
                status_standard = (member_package.premium=="yes")?false:true
                package_member = member_package.package_id
            }
        }
        const product_store: any = await ViewProductAllStore.findAndCountAll({
            where:{
                sex: gender, 
                storeStatus: 'active',
                store_name:{[Op.substring]:store_name},
            },
            attributes: ['store_name', 'store_profile', 'store_concept', 'store_code', 'storeStatus', 'id', 'product_code', 'name_member', 'content_member',
                        'name_premium', 'content_premium', 'price_standard', 'price_premium', 'recommend', 'pre_order', 'status', 'sex', 'clip', 
                        'store_id', 'priority', 'createdAt', 'updatedAt', 'product_img', 'productPriority',
                        [sequelize.fn('COUNT', sequelize.col('product_code')), 'totalProduct']
            ],
            offset: offset,
            limit: limit,
            group: ['store_id']
        })
        const product_recom: any = await this.query_product_recommend(package_member, gender)
        const filter_product_store = product_store.rows.map((data: any) => {
            return {
                product_code: data.product_code,
                name_product: (data.status_premium=='yes')?data.name_premium:data.name_member,
                content_product: (data.status_premium=='yes')?data.content_premium:data.content_member,
                price: (data.status_premium=='yes')?data.price_premium:data.price_standard,
                store_code: data.store_code,
                store_name: data.store_name,
                sex: data.sex,
                canbuy: canbuy,
                preOrder: (data.pre_order=='yes')?true:false,
                show_gift: data.show_gift,
                store_profile: data.store_profile,
                store_concept: data.store_concept,
                product_img: (data.pre_order=='yes')?data.store_profile:data.product_img,
                totalProduct: data.totalProduct
            }
        })
        const filter_product_recom = product_recom.map((data: any) => {
            return {
                product_code: data.product_code,
                name_product: (data.status_premium=='yes')?data.name_premium:data.name_member,
                content_product: (data.status_premium=='yes')?data.content_premium:data.content_member,
                price: (data.status_premium=='yes')?data.price_premium:data.price_standard,
                sex: data.sex,
                store_name: data.store_name,
                canbuy: canbuy,
                show_gift: data.show_gift,
                store_profile: data.store_profile,
                store_concept: data.store_concept,
                store_detail_limit: data.store_detail_limit,
                product_img: data.product_img,
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: {
                standard: status_standard,
                total_store: product_store.count,
                total_page: Math.ceil(product_store.count/limit),
                current_page: page,
                per_page: limit,
                store_all: filter_product_store,
                product_recom: filter_product_recom,
            }
        })
    }
    OnGetProduct = async(req: any, res: any) => {
        const page: number = parseInt(req.query.page) || 1
        const limit: number = 15
        const offset: number = (page*limit)-limit
        const member = req.authMember
        const gender = req.params.gender
        const store_code = req.params.store_code
        let status_standard = true
        let canbuy = false
        const store = await Store.findOne({where:{store_code: store_code},
            attributes: {exclude: ['createdAt', 'updatedAt', 'access_token', 'store_code', 'refresh_token', 'username', 'password']},
        })
        if(!store){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'invalid store code'
            })
        }
        let package_member = "PACKAGE_MEMBER"
        if(member){
            const member_package: any = await this.view_member_package(member.member_id, gender)
            if(member_package){
                canbuy = true
                status_standard = (member_package.premium=="yes")?false:true
                package_member = member_package.package_id
            }
        }
        const product = await ViewProduct.findAndCountAll({
            where:{
                package_id: package_member,
                sex: gender,
                store_id: store.id,
                pre_order: "no",
                status: 'active'
            },
            attributes: ['product_code', 'name_member', 'content_member', 'name_premium', 'content_premium', 'price_standard', 'price_premium', 'recommend', 'pre_order',
                        'status', 'sex', 'clip', 'store_id', 'path_img', 'package_id', 'buy_limit', 'show_gift', 'price_sell', 'status_premium',
                        [sequelize.fn('GROUP_CONCAT', sequelize.col('path_img')), 'product_img']
            ],
            offset: offset,
            limit: limit,
            group: ['store_id', 'id']
        })
        const preorder: any = await this.query_product_preorder(package_member, gender, store.id)
        const review: any = await this.queryReviewForMember(store.id)
        const review_res = review.map((data: any) => {
            return {
                memberName: data.username,
                message: data.message,
                star: data.star
            }
        })
        const store_post = await this.query_store_post(store.id)
        const filter_product = product.rows.map((data: any) => {
            return {
                product_code: data.product_code,
                name_product: (data.status_premium == 'yes')?data.name_premium:data.name_member,
                content_product: (data.status_premium == 'yes')?data.content_premium:data.content_member,
                price: (data.status_premium == 'yes')?data.price_premium:data.price_standard,
                recommend: data.recommend,
                sex: data.sex,
                clip: data.clip,
                canbuy: canbuy,
                show_gift: data.show_gift,
                product_img: data.product_img,
            }
        })
        const filter_pre = preorder.map((data: any) => {
            return {
                product_code: data.product_code,
                name_product: (data.status_premium=='yes')?data.name_premium:data.name_member,
                content_product: (data.status_premium=='yes')?data.content_premium:data.content_member,
                price: (data.status_premium=='yes')?data.price_premium:data.price_standard,
                recommend: data.recommend,
                sex: data.sex,
                clip: data.clip,
                canbuy: canbuy,
                show_gift: data.show_gift,
                product_img: data.product_img,
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: {
                standard: status_standard,
                total_product: product.count.length,
                total_page: Math.ceil(product.count.length/limit),
                current_page: page,
                per_page: limit,
                store_detail: store,
                all_product: filter_product,
                pre_order: filter_pre,
                store_post: store_post,
                review: review_res
            }
        })
    }
    OnGetProductByCode = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const gender = req.query.gender
        const member = req.authMember
        let package_member = "PACKAGE_MEMBER"
        let member_package: any
        let canbuy = false
        if(member){
            member_package = await this.view_member_package(member.member_id, gender)
            if(member_package){
                canbuy = true
                package_member = member_package.package_id
            }
        }
        const finding = await ViewProduct.findOne({
            where:{
                product_code: req.params.code,
                package_id: package_member,
                sex: gender,
            },
            attributes: ['product_code', 'name_member', 'content_member', 'name_premium', 'content_premium', 'price_standard', 'price_premium', 'recommend', 'pre_order',
                        'status', 'sex', 'clip', 'store_id', 'path_img', 'package_id', 'buy_limit', 'show_gift', 'price_sell', 'status_premium',
                [sequelize.fn('GROUP_CONCAT', sequelize.col('path_img')), 'product_img']
            ],
            group: ['store_id', 'id']
        })
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'product was not found.'
            })
        }
        const filtered = {
                product_code: finding.product_code,
                name_product: (finding.status_premium=='yes')?finding.name_premium:finding.name_member,
                content_product: (finding.status_premium=='yes')?finding.content_premium:finding.content_member,
                price: (finding.status_premium=='yes')?finding.price_premium:finding.price_standard,
                recommend: finding.recommend,
                sex: finding.sex,
                clip: finding.clip,
                canbuy: canbuy,
                show_gift: finding.show_gift,
                product_img: finding.product_img,
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            data: filtered
        })
    }
    OnCreateProduct = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const store = req.authStore
        const store_profile = await Store.findOne({where:{store_code: store.store_code}})
        const prod_most_prior = await Product.findOne({
            where:{store_id: store_profile.id},
            order: [
                ['priority', 'DESC']
            ]
        })
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
                price_standard: parseInt(req.body.price_standard),
                price_premium: parseInt(req.body.price_premium),
                recommend: "no",
                pre_order: "no",
                status: 'active',
                sex: store.gender,
                clip: req.body.clip,
                store_id: store_profile.id,
                priority: (prod_most_prior)?prod_most_prior.priority+1:0
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
                    .resize(500, 500)
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
                        member_type: ""
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
                    .resize(500, 500)
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
                        member_type: ""
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
        const store = req.authStore
        const store_profile = await Store.findOne({where:{store_code: store.store_code}})
        const prod_most_prior = await Product.findOne({
            where:{store_id: store_profile.id},
            order: [
                ['priority', 'DESC']
            ]
        })
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
                price_standard: parseInt(req.body.price_premium),
                price_premium: parseInt(req.body.price_premium),
                recommend: "no",
                pre_order: "yes",
                status: 'active',
                sex: store.gender,
                clip: req.body.clip,
                store_id: store_profile.id,
                priority: (prod_most_prior)?prod_most_prior.priority+1:0
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
                    .resize(500, 500)
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
                        member_type: ''
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
    OnDeleteProduct = async(req: any, res: any) => {
        const product = await Product.findOne({where:{product_code: req.params.code}})
        if(!product){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'product was not found.'
            })
        }
        try {
            product.destroy()
            const product_image = ProductImage.destroy({where:{product_id: product.id}})
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'product was deleted.'
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