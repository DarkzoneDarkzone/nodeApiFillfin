import { sequelize } from './../util/database';
import { Members } from './../models/members';
import { PackageService } from './../services/Package.service';
import { PackagePayment } from './../models/packagePayment';
import { Package } from './../models/package';
import { PackageOrder } from '../models/packageOrder';
import { HostNotFoundError, Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import { validationResult } from 'express-validator'

import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import * as multerUpload from '../util/multerUpload'

export class PackageController extends PackageService {
    OnGetPackageAll = async(req: any, res: any) => {
        const finding = await Package.findAll()
        let arr_package: any[] = []
        finding.forEach((data: any) => {
            const newArr = {
                package_id: data.package_id,
                name: data.name,
                image: data.image,
                content: data.content,
                price: data.price,
                day: data.day,
                gender: data.gender,
            }
            arr_package.push(newArr)
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: arr_package
        })
    }
    OnCreatePackageOrder = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const package_order = await Package.findOne({where:{package_id: req.body.package_id}})
        const begin = moment().format('YYYY-MM-DD HH:mm:ss')
        const expire = moment(begin).add('days', package_order.day).format('YYYY-MM-DD HH:mm:ss')
        const t = await sequelize.transaction()
        try {
            const pack_order = await PackageOrder.create({
                package_id: req.body.package_id,
                begin: begin,
                expire: expire,
                status_expire: "no",
                status_confirm: "pending",
                status_payment: "pending",
                member_id: req.body.member_id,
                gender: req.body.gender
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
    OnCreatePayment = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = await Members.findOne({where:{member_code: req.body.member_code}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const package_order = await PackageOrder.findOne({
            where:{
                member_id: member.id,
                status_confirm: 'pending',
                status_payment: 'notpay',
            }
        })
        if(!package_order){
            return res.status(404).json({
                status: false,
                message: 'package was not found.'
            })
        }
        const t =  await sequelize.transaction()
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
            package_order.status_payment = "pending"
            package_order.save()
            const pack_payment = await PackagePayment.create({
                package_order_id: package_order.pack_order_id,
                slip: slip,
                status_confirm: 'pending',
                user_confirm: 0,
                bank_ref: req.body.bank_ref
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
    OnGetPackageOrder = async(req: any, res: any) => {
        const member = await Members.findOne({where:{member_code: req.params.member_code}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: "member was not found."
            })
        }
        const finding = await this.queryPackageOrderLast(member.id, member.gender)
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: "package was not found."
            })
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding
        })
    }
    OnCheckStatusPayment = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = await Members.findOne({where:{member_code: req.params.member_code}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const payment = await PackageOrder.findOne({where:{member_id: member.id}})
        let statusPay: any
        if(payment){
            statusPay = payment.status_payment
        }
        const member_package: any = await this.view_member_package(member.id, member.gender)
        if(member_package){
            if(member_package.isStore == "yes"){
                statusPay = "success"
            }
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: statusPay
        })
    }
    OnConfirmPayment = async(req: any, res: any) => {
        return false
        // const admin
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const payment = await PackagePayment.findOne({where:{package_order_id: req.params.payment_id}})
        const order = await PackageOrder.findOne({where:{package_order_id: req.params.payment_id}})
        const package_select = await Package.findOne({where:{package_id: order.package_id}})
        const begin = moment().format('YYYY-MM-DD HH:mm:ss')
        const expire = moment(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss')
        try {
            payment.status_confirm = "confirm"
            // payment.user_confirm = ** admin id **
            payment.save()
            order.begin = begin
            order.expire = expire
            order.status_expire = "no"
            order.status_confirm = "confirm"
            order.status_payment = "confirm"
            order.save
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'confirm payment success.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message:' error',
                description: 'something went wrong.'
            })
        }
    }
}