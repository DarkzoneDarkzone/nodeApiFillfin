import { ProductImage } from './../models/productImage';
import { OrdersProduct } from './../models/ordersProduct';
import { ViewProductAllStore } from './../models/viewProductAllStore';
import { sequelize } from './../util/database';
import { Product } from './../models/product';
import { Review } from './../models/review';
import { Store } from './../models/store';
import { Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { ViewService } from '../services/View.service'
import { ViewProduct } from '../models/viewProduct';
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import * as multerUpload from '../util/multerUpload'

export class ProductController extends ViewService {
    OnGetStoreAll = async(req: any, res: any) => {
        const page: number = parseInt(req.query.page) || 1
        const store_name = req.query.name || ""
        const limit: number = 15
        const offset: number = (page*limit)-limit
        const member = req.authMember
        const gender = req.params.gender
        let package_member = "PACKAGE_MEMBER"
        let member_package: any
        let canbuy = false
        if(member){
            member_package = await this.view_member_package(member.member_id, gender)
            if(member_package){
                canbuy = (member_package.buy_limit == "no")?true:false
                package_member = member_package.package_id
            }
        }
        const product_store: any = await ViewProductAllStore.findAndCountAll({
            where:{
                sex: gender,
                store_name: {
                    [Op.substring]: store_name,
                }
            },
            offset: offset,
            limit: limit
        })
        const product_recom: any = await this.view_product_recommend(package_member, gender)
        let arr_store: any[] = []
        let arr_product: any[] = []
        product_store.rows.forEach((data: any) => {
            let name_product: any
            let content_product: any
            let price: any
            if(package_member == "PACKAGE_MEMBER"){
                name_product = data.name_member
                content_product = data.content_member
                price = data.price_standard
            } else {
                name_product = data.name_premium
                content_product = data.content_premium
                price = data.price_premium
            }
            const arr_data = {
                product_code: data.product_code,
                name_product: name_product,
                content_product: content_product,
                price: price,
                sex: data.sex,
                store_id: data.store_id,
                store_code: data.store_code,
                store_name: data.store_name,
                canbuy: canbuy,
                store_profile: data.store_profile,
                store_concept: data.store_concept,
                product_img: data.product_img,
            }
            arr_store.push(arr_data)
        })
        product_recom.forEach((data: any) => {
            let name_product: any
            let content_product: any
            let price: any
            if(package_member == "PACKAGE_MEMBER"){
                name_product = data.name_member
                content_product = data.content_member
                price = data.price_standard
            } else {
                name_product = data.name_premium
                content_product = data.content_premium
                price = data.price_premium
            }
            const arr_data = {
                product_code: data.product_code,
                name_product: name_product,
                content_product: content_product,
                price: price,
                sex: data.sex,
                store_id: data.store_id,
                store_name: data.store_name,
                canbuy: canbuy,
                store_profile: data.store_profile,
                store_concept: data.store_concept,
                store_detail_limit: data.store_detail_limit,
                product_img: data.product_img,
            }
            arr_product.push(arr_data)
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: {
                standard: (package_member == "PACKAGE_MEMBER")?true:false,
                total_store: product_store.count,
                total_page: Math.ceil(product_store.count/limit),
                current_page: page,
                per_page: limit,
                store_all: arr_store,
                product_recom: arr_product,
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
        const store = await Store.findOne({
            where:{store_code: store_code},
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'access_token', 'store_code', 'refresh_token', 'username', 'password']
            },
        })
        if(!store){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'invalid store code'
            })
        }
        let package_member = "PACKAGE_MEMBER"
        let member_package: any
        let canbuy = false
        if(member){
            member_package = await this.view_member_package(member.member_id, gender)
            if(member_package){
                canbuy = (member_package.buy_limit == "no")?true:false
                package_member = member_package.package_id
            }
        }
        const product = await ViewProduct.findAndCountAll({
            where:{
                package_id: package_member,
                sex: gender,
                store_id: store.id,
                pre_order: "no"
            },
            attributes: ['product_code', 'name_member', 'content_member', 'name_premium', 'content_premium', 'price_standard', 'price_premium', 'recommend', 'pre_order',
                        'status', 'sex', 'clip', 'store_id', 'premium', 'path_img', 'package_id', 'buy_limit', 'show_gift', 'price_sell',
                [sequelize.fn('GROUP_CONCAT', sequelize.col('path_img')), 'product_img']
            ],
            offset: offset,
            limit: limit,
            group: ['store_id', 'id']
        })
        const preorder: any = await this.view_product_preorder(package_member, gender, store.id)
        const review = await Review.findAll({where:{store_id: store.id}})
        const store_post = await this.view_store_post(store.id)
        let arr_product: any[] = []
        let arr_product_pre: any[] = []
        product.rows.forEach((data: any) => {
            let name_product: any
            let content_product: any
            let price: any
            if(package_member == "PACKAGE_MEMBER"){
                name_product = data.name_member
                content_product = data.content_member
                price = data.price_standard
            } else if(package_member == "PACKAGE_PREMIUM" || package_member == "PACKAGE_EXCLUSIVE") {
                name_product = data.name_premium
                content_product = data.content_premium
                price = data.price_premium
            }
            const arr_data1 = {
                product_code: data.product_code,
                name_product: name_product,
                content_product: content_product,
                price: price,
                recommend: data.recommend,
                sex: data.sex,
                clip: data.clip,
                canbuy: canbuy,
                show_gift: data.show_gift,
                product_img: data.product_img,
            }
            arr_product.push(arr_data1)
        })
        preorder.forEach((data: any) => {
            let name_product: any
            let content_product: any
            let price: any
            if(package_member == "PACKAGE_MEMBER"){
                name_product = data.name_member
                content_product = data.content_member
                price = data.price_standard
            } else if(package_member == "PACKAGE_PREMIUM" || package_member == "PACKAGE_EXCLUSIVE") {
                name_product = data.name_premium
                content_product = data.content_premium
                price = data.price_premium
            }
            const arr_data = {
                product_code: data.product_code,
                name_product: name_product,
                content_product: content_product,
                price: price,
                recommend: data.recommend,
                sex: data.sex,
                clip: data.clip,
                canbuy: canbuy,
                show_gift: data.show_gift,
                product_img: data.product_img,
            }
            arr_product_pre.push(arr_data)
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: {
                standard: (package_member == "PACKAGE_MEMBER")?true:false,
                total_product: product.count.length,
                total_page: Math.ceil(product.count.length/limit),
                current_page: page,
                per_page: limit,
                store_detail: store,
                all_product: arr_product,
                pre_order: arr_product_pre,
                store_post: store_post,
                review: review
            }
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
        if(!store){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'not authenticated.'
            })
        }
        const store_profile = await Store.findOne({where:{store_code: store.store_code}})
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
                sex: store.gender,
                clip: req.body.clip,
                store_id: store_profile.id
            }, { transaction: t })
            let productImage: any[] = []
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
                            console.log(err)
                        })
                        return upload+originalname+ext
                    })
                    const arr = {
                        product_id: product_result.id,
                        path_img: image,
                        hover: (count==1)?"yes":"no",
                        display: "yes",
                        premium: (count>1)?"yes":"no",
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
    OnAddProductToCart = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = req.authMember
        if(!member){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'not authenticated.'
            })
        }
        const mem_package: any = await this.view_member_package(member.member_id, member.gender)
        if(!mem_package){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'not authenticated.'
            })
        }
        const product  = await Product.findOne({where:{product_code: req.params.code}})
        let name_product: any
        let product_content: any
        let price: any
        if(mem_package.price_sell == "price_standard"){
            name_product = product.name_member
            product_content = product.content_member
            price = product.price_standard
        } else {
            name_product = product.name_premium
            product_content = product.content_premium
            price = product.price_premium
        }
        const arr_data: any = {
            product_id: product.id,
            name_product: name_product,
            product_content: product_content,
            price: price,
        }
        const t = await sequelize.transaction()
        try {
            const orderProduct = await OrdersProduct.findOne({
                where:{
                    product_id: arr_data.product_id,
                    incart: "yes",
                    member_id: member.member_id
                }
            })
            if(orderProduct){
                const cart = await OrdersProduct.update({
                    product_name: arr_data.name_product,
                    product_content: arr_data.product_content,
                    price: arr_data.price,
                })
            } else {
                const cart = await OrdersProduct.create({
                    order_number: '',
                    product_id: arr_data.product_id,
                    product_name: arr_data.name_product,
                    product_content: arr_data.product_content,
                    price: arr_data.price,
                    incart: "yes",
                    member_id: member.member_id
                }, { transaction: t })
            }
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
}