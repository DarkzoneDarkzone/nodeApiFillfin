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
        if(!member){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: "don't have permission."
            })
        }
        console.log(member)
        return res.json({response: 'if you testing, please call me. (darkzone)'})
        let arr_product_id: any[] = []
        const t = await sequelize.transaction();
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
                        console.log(err)
                    })
                    return upload+originalname+ext
                })
                slip = image
            }
            const order_str = await bcrypt.hash(member.id+member.username+moment().unix(), 10)
            const order_number = "ords-"+order_str.replace(/\W/g, "")
            const order_product: any = await this.view_product_incart(member.id)
            order_product.forEach(async (data: any) => {
                const prod = await Product.findOne({where:{id: data.product_id}})
                if(prod.status != "active"){
                    const order_pro = await OrdersProduct.findOne({where:{product_id:data.product_id, member_id: member.id}})
                    order_pro.status = "outstock"
                    order_pro.save()
                    return res.status(400).json({
                        status: false,
                        message: 'error',
                        description: 'product out of stock.'
                    })
                }
            })
            const order = await Orders.create({
                order_number: order_number,
                payment_status: 'pending',
                status: 'pending',
                totalprice: req.body.totalprice,
                netprice: req.body.netprice,
                member_id: member.id
            }, { transaction: t })
            this.onUpdate("orders_product" ,"incart" ,`member_id = ${member.id} AND incart = "yes"` ,"no")
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
                bank_id: req.body.bank_ref,
                slip: slip,
                status_confirm: 'pending',
                // name: req.body.name_payment,
                // total_pay: req.body.totalpay_payment,
                // date_pay: req.body.date_pay,
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
        const order = await this.view_member_order(member.id)
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            order: order
        })
    }
    OnGetOrderStore = async(req: any, res: any) => {
        
    }
}