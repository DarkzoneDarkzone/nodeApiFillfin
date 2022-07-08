import { OrdersCart } from './../models/ordersCart';
import { Product } from './../models/product';
import { ViewService } from './../services/View.service';
import { sequelize } from './../util/database';
import { Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import { validationResult } from 'express-validator'

export class CartController extends ViewService {
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
        try {
            const prod = await Product.findOne({where:{product_code: req.params.code}})
            const cart = await OrdersCart.findOne({where:{productId: prod.id,memberId: member.member_id}})
            if(!cart){
                const cartCreate = await OrdersCart.create({
                    productId: prod.id,
                    memberId: member.member_id
                })
            }
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'product was add to cart.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnDeleteProductFromCart = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = req.authMember
        try {
            const prod = await Product.findOne({where:{product_code: req.params.code}})
            const cart = await OrdersCart.destroy({where:{productId: prod.id,memberId: member.member_id}})
            return res.status(201).json({
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
    OnGetProductInCart = async(req: any, res: any) => {
        const member = req.authMember
        const finding: any = await this.query_product_incart(member.member_id)
        const filtered = finding.map((data: any) => {
            return {
                productCode: data.product_code,
                productName: (data.premium=='yes')?data.name_premium:data.name_member,
                productContent: (data.premium=='yes')?data.content_premium:data.content_member,
                productPrice: (data.premium=='yes')?data.price_premium:data.price_standard,
                productImg: data.path_img,
                status: data.status
            }
        })
        let totalPrice = 0
        filtered.forEach((data: any) => {
            totalPrice += data.productPrice
        });
        let netprice = totalPrice
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            cart: filtered,
            totalprice: totalPrice,
            netprice: netprice
        })
    }
    OnCheckProductInCart = async(req: any, res: any) => {
        const member = req.authMember
        const finding: any = await this.query_product_incart(member.member_id)
        const missingProduct: any[] = []
        for await (const data of finding) {
            const prod = await Product.findOne({where:{product_code: data.product_code}})
            if(prod.status != 'active'){
                await OrdersCart.destroy({where:{productId: prod.id,memberId: member.member_id}})
                const res_data = {
                        product_code: data.product_code,
                        name_product: (data.status_premium=='yes')?data.name_premium:data.name_member,
                        content_product: (data.status_premium=='yes')?data.content_premium:data.content_member,
                        price: (data.status_premium=='yes')?data.price_premium:data.price_standard,
                        product_img: data.path_img,
                }
                missingProduct.push(res_data)
            }
        }
        if(missingProduct.length != 0){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'product has been sold.',
                product: missingProduct
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'product has ready to sell.'
            })
        }
    }
}