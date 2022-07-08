import { Review } from './../models/review';
import { OrdersCart } from './../models/ordersCart';
import { Product } from './../models/product';
import { OrdersProduct } from './../models/ordersProduct';
import { OrdersPayment } from './../models/ordersPayment';
import { OrdersAddress } from './../models/ordersAddress';
import { ViewService } from './../services/View.service';
import { Orders } from './../models/orders';
import { sequelize } from './../util/database';
import * as jwt from 'jsonwebtoken'
import * as Config from '../util/config'
import { Op } from 'sequelize'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import * as multerUpload from '../util/multerUpload'

export class OrderController extends ViewService{
    OnCreateOrder = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = req.authMember
        const t = await sequelize.transaction();
        const order_number: string = "OD-"+moment().unix()+Math.floor((Math.random() * 100) + 1).toString().padStart(3, "0")
        const order_product: any = await this.query_product_incart(member.member_id)
        let missingProduct: any[] = []
        let orderProduct: any[] = []
        let arrProductId: any[] = []
        for await (const data of order_product) {
            const prod = await Product.findOne({where:{product_code: data.product_code}})
            if(prod.status != 'active'){
                await OrdersCart.destroy({where:{productId: prod.id,memberId: member.member_id}})
                const res_data = {
                    name_product: (data.status_premium=='yes')?data.name_premium:data.name_member,
                }
                missingProduct.push(res_data)
            } else {
                const order_data = {
                    order_number: order_number,
                    product_id: prod.id,
                    product_name: (data.status_premium=='yes')?data.name_premium:data.name_member,
                    product_content: (data.status_premium=='yes')?data.content_premium:data.content_member,
                    price: (data.status_premium=='yes')?data.price_premium:data.price_standard
                }
                arrProductId.push(prod.id)
                orderProduct.push(order_data)
            }
        }
        if(missingProduct.length != 0){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'product has been sold.',
                data: missingProduct
            })
        }
        if(orderProduct.length == 0){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'not found product in cart.',
            })
        }
        try {
            let slip = ''
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
                slip = image
            }
            const order_pro = await OrdersProduct.bulkCreate(orderProduct)
            const update_product = await Product.update({status: 'sold'},
            {where:{
                    id:{
                        [Op.in]: arrProductId
                    }
            }}, { transaction: t })
            const ord_delete = await OrdersCart.destroy({where:{memberId: member.member_id}}, { transaction :t })
            const order = await Orders.create({
                order_number: order_number,
                payment_status: 'pending',
                status: 'pending',
                totalprice: parseInt(req.body.totalprice),
                netprice: parseInt(req.body.netprice),
                member_id: member.member_id,
            }, { transaction: t })
            const order_address = await OrdersAddress.create({
                order_number: order_number,
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                district: req.body.district,
                subdistrict: req.body.subdistrict,
                province: req.body.province,
                code: req.body.code,
                note: req.body.note,
            }, { transaction: t })
            const order_payment = await OrdersPayment.create({
                order_number: order_number,
                bank_id: parseInt(req.body.bank_ref),
                slip: slip,
                status_confirm: 'pending',
                name: '',//req.body.name_payment,
                total_pay: '', //req.body.totalpay_payment,
                date_pay: new Date(), //req.body.date_pay,
            }, { transaction: t })
            await t.commit()
            return res.status(201).json({
                status: false,
                message: 'error',
                description: 'create order success.'
            })
        } catch(error){
            await t.rollback();
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetOrderMember = async(req: any, res: any) => {
        const member = req.authMember
        const order = await this.query_member_order(member.id)
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            order: order
        })
    }
    OnGetOrderStore = async(req: any, res: any) => {
        const store = req.authStore
        const finding = await this.query_store_order(store.store_id)
        return res.status(200).json({
            status: false,
            message: 'ok',
            description: 'get data success.',
            order: finding
        })
    }
    OnReview = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = req.authMember
        const order: any = await this.query_order_one(req.body.orderNumber)
        if(!order){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'order was not found.'
            })
        }   
        const t = await sequelize.transaction();
        try {
            const review = await Review.create({
                member_id: member.memberId,
                message: req.body.message,
                order_number: req.body.orderNumber,
                star: req.body.star,
                display: 'yes',
                store_id: order.store_id
            }, {transaction: t })
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'order has been review.'
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