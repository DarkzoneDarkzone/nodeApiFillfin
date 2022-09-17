import { Settings } from './../models/settings'
import { Website } from './../models/website'
import { Review } from './../models/review'
import { OrdersCart } from './../models/ordersCart'
import { Product } from './../models/product'
import { OrdersProduct } from './../models/ordersProduct'
import { OrdersPayment } from './../models/ordersPayment'
import { OrdersAddress } from './../models/ordersAddress'
import { ViewService } from './../services/View.service'
import { Orders } from './../models/orders'
import { sequelize } from './../util/database'
import * as jwt from 'jsonwebtoken'
import * as Config from '../util/config'
import { Op } from 'sequelize'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'

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
        const t = await sequelize.transaction()
        const packages: any = await this.view_member_package(member.member_id, member.gender)
        const order_number: string = "OD-"+moment().unix()+Math.floor((Math.random() * 100) + 1).toString().padStart(3, "0")
        const order_product: any = await this.query_product_incart(member.member_id)
        const gp_recommend: any = await Settings.findOne({where:{setting_name: 'gross_profit'}})
        let missingProduct: any[] = []
        let orderProduct: any[] = []
        let arrProductId: any[] = []
        let totalPrice: number = 0
        let netPrice: number = 0
        for await (const data of order_product) {
            const prod = await Product.findOne({where:{product_code: data.product_code}})
            if(prod.status!=='active'){
                await OrdersCart.destroy({where:{productId: prod.id,memberId: member.member_id}})
                const res_data = {
                    name_product: (data.premium==='yes')?data.name_premium:data.name_member,
                }
                missingProduct.push(res_data)
            } else {
                const order_data = {
                    order_number: order_number,
                    product_id: prod.id,
                    product_name: (data.premium==='yes')?data.name_premium:data.name_member,
                    status: 'pending',
                    product_content: (data.premium==='yes')?data.content_premium:data.content_member,
                    gross_profit: (data.recommend==='yes')?parseInt(gp_recommend.setting_value):parseInt(packages.gross_profit),
                    price: (data.premium==='yes')?data.price_premium:data.price_standard
                }
                totalPrice += order_data.price
                netPrice += order_data.price * (1 - order_data.gross_profit / 100)
                arrProductId.push(prod.id)
                orderProduct.push(order_data)
            }
        }
        if(missingProduct.length!==0){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'product has been sold.',
                data: missingProduct
            })
        }
        if(orderProduct.length===0){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'not found product in cart.',
            })
        }
        try {
            let slip = ''
            if(req.file){
                /** for slip destination */
                const destSlip = req.file.destination.split("uploads")[0]+"/slip"+req.file.destination.split("uploads")[1]
                if(!fs.existsSync(`${destSlip}`)){
                    fs.mkdirSync(destSlip, { recursive: true })
                }
                /** for slip destination */
                let upload = "/slip"+req.file.destination.split("uploads").pop()
                var ext = path.extname(req.file.originalname)
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(destSlip+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
                .resize(500, 500)
                .withMetadata()
                .jpeg({ quality: 95})
                .toFile(path.resolve(destSlip, originalname+ext))
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
            const update_product = await Product.update({status: 'sold'},{where:{id:{[Op.in]: arrProductId}}}, { transaction: t })
            const ord_delete = await OrdersCart.destroy({where:{memberId: member.member_id}}, { transaction :t })
            const order = await Orders.create({
                order_number: order_number,
                payment_status: 'pending',
                status: 'pending',
                totalprice: totalPrice,
                netprice: netPrice,
                member_id: member.member_id,
                message: '',
                isRead: false,
                isReview: false,
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
                total_pay: 0, //req.body.totalpay_payment,
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
                status: true,
                message: 'ok',
                description: 'something went wrong.',
                error: error
            })
        }
    }
    OnGetOrderMember = async(req: any, res: any) => {
        const member = req.authMember
        const order: any = await this.query_member_order(member.member_id)
        const order_response: any = order.map((data: any) => {
            const arr_product: any = []
            let product_id = data.product_id.split(',')
            if(product_id.length > 0){
                let product_name = data.product_name.split(',')
                let product_content = data.product_content.split(',')
                let price = data.price.split(',')
                let product_status = data.product_status.split(',')
                let store_id = data.store_id.split(',')
                let product_image = data.product_image.split(',')
                for (let i = 0; i < product_id.length; i++) {
                    const dd = {
                        product_id: product_id[i],
                        product_name: product_name[i],
                        product_content: product_content[i],
                        price: price[i],
                        product_status: product_status[i],
                        store_id: store_id[i],
                        product_image: product_image[i],
                    }
                    arr_product.push(dd)
                }
            }
            return {
                orderNumber: data.order_number,
                paymentStatus: data.payment_status,
                status: data.status,
                totalPrice: data.totalprice,
                netprice: data.netprice,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                name: data.name,
                address: data.address,
                phone: data.phone,
                district: data.district,
                subdistrict: data.subdistrict,
                province: data.province,
                code: data.code,
                note: data.note,
                isReview: data.isReview,
                product: arr_product
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            order: order_response
        })
    }
    OnGetOrderStore = async(req: any, res: any) => {
        const store = req.authStore
        const orderss: any = await this.query_store_order(store.store_id)
        const order_response = orderss.map((data: any) => {
            const arr_product: any = []
            let product_id = data.product_id.split(',')
            if(product_id.length > 0){
                let product_name = data.product_name.split(',')
                let product_content = data.product_content.split(',')
                let price = data.price.split(',')
                let product_status = data.product_status.split(',')
                let product_image = data.product_image.split(',')
                for (let i = 0; i < product_id.length; i++) {
                    const dd = {
                        product_id: product_id[i],
                        product_name: product_name[i],
                        product_content: product_content[i],
                        price: price[i],
                        product_status: product_status[i],
                        product_image: product_image[i],
                    }
                    arr_product.push(dd)
                }
            }
            return {
                orderNumber: data.order_number,
                paymentStatus: data.payment_status,
                status: data.status,
                totalPrice: data.totalprice,
                netprice: data.netprice,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                name: data.name,
                address: data.address,
                phone: data.phone,
                district: data.district,
                subdistrict: data.subdistrict,
                province: data.province,
                code: data.code,
                note: data.note,
                product: arr_product
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            order: order_response
        })
    }
    OnGetOrderAdmin = async(req: any, res: any) => {
        const store = req.authAdmin
        const order: any = await this.query_admin_order()
        const order_response: any = order.map((data: any) => {
            const arr_product: any = []
            let product_id = data.product_id.split(',')
            if(product_id.length > 0){
                let product_name = data.product_name.split(',')
                let product_content = data.product_content.split(',')
                let price = data.price.split(',')
                let product_status = data.product_status.split(',')
                let product_image = data.product_image.split(',')
                let recommend = data.recommend.split(',')
                let preOrder = data.preOrder.split(',')
                for (let i = 0; i < product_id.length; i++) {
                    const dd = {
                        product_id: product_id[i],
                        product_name: product_name[i],
                        product_content: product_content[i],
                        price: price[i],
                        product_status: product_status[i],
                        product_image: product_image[i],
                        recommend: recommend[i],
                        preOrder: preOrder[i]
                    }
                    arr_product.push(dd)
                }
            }
            return {
                orderNumber: data.order_number,
                paymentStatus: data.payment_status,
                status: data.status,
                totalPrice: data.totalprice,
                netprice: data.netprice,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                name: data.name,
                address: data.address,
                phone: data.phone,
                district: data.district,
                subdistrict: data.subdistrict,
                province: data.province,
                code: data.code,
                note: data.note,
                slip: data.slip,
                isRead: data.isRead?true:false,
                product: arr_product
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            order: order_response
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
        const order: any = await this.query_order_one(req.body.orderNumber, req.body.productId)
        if(!order){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'order was not found.'
            })
        }
        if(order.status_product != 'success'){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'product has delivery.'
            })
        }
        const t = await sequelize.transaction();
        try {
            const review = await Review.create({
                member_id: member.member_id,
                message: req.body.message,
                product_id: order.product_id,
                star: req.body.star,
                display: 'yes',
                store_id: order.store_id
            }, {transaction: t })
            const order_prod = await OrdersProduct.update({
                status: 'accepted'
            },{
                where:{
                    order_number: order.order_number, 
                    product_id: req.body.productId
                }
            }, { transaction: t})
            const orders = await Orders.update({
                status: 'success',
                isReview: true
            },{
                where:{
                    order_number: order.order_number, 
                }
            }, { transaction: t})
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
    OnUpdatePaymentStatus = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await Orders.findOne({where: {order_number: req.body.orderNumber}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'order was not found.'
            })
        }
        try {
            finding.payment_status = req.body.status
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'payment status was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnUpdateStatus = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await Orders.findOne({where: {order_number: req.body.orderNumber}})
            if(!finding){
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'order was not found.'
                })
            }
            finding.status = req.body.status
            finding.message = req.body.message
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'order status was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnUpdateProductStatus = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await OrdersProduct.findOne({where: {order_number: req.body.orderNumber, product_id: req.body.productId}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'product was not found.'
            })
        }
        try {
            finding.status = req.body.status
            finding.save()
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
    OnUpdateGPInOrder = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const productForSet = await OrdersProduct.findOne({where: {order_number: req.body.orderNumber, product_id: req.body.productId}})
        const productAllInOrder: any = await OrdersProduct.findAll({where: {order_number: req.body.orderNumber}})
        const orders = await Orders.findOne({where:{order_number: req.body.orderNumber}})
        if(!productForSet || !orders){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'order was not found.'
            })
        }
        try {
            let totalPrice: number = 0
            let netPrice: number = 0
            productAllInOrder.forEach((data: any) => {
                totalPrice += data.price
                netPrice += data.price * (1 - data.gross_profit / 100)
            });
            productForSet.gross_profit = parseInt(req.body.gp)
            productForSet.save()
            orders.totalprice = totalPrice
            orders.netprice = netPrice
            orders.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'order GP was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnReadOrder = async(req: any, res: any) => {
        const finding = await Orders.findOne({where: {order_number: req.params.number}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'order was not found.'
            })
        }
        finding.isRead = true
        finding.save()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'order was readed.'
        })
    }
}