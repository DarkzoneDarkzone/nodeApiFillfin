import { sequelize } from './../util/database'
import { Members } from './../models/members'
import { PackageService } from './../services/Package.service'
import { PackagePayment } from './../models/packagePayment'
import { Package } from './../models/package'
import { PackageOrder } from '../models/packageOrder'
import 'moment/locale/th'
import moment from 'moment'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'

export class PackageController extends PackageService {
    OnGetPackageAll = async(req: any, res: any) => {
        const finding = await Package.findAll()
        let arr_package: any[] = []
        finding.forEach((data: any) => {
            const newArr = {
                pack_id: data.pack_id,
                package_id: data.package_id,
                name: data.name,
                image: data.image,
                content: data.content,
                price: data.price,
                grossProfit: data.gross_profit,
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
    OnGetPackage = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = await Members.findOne({where:{member_code: req.body.memberCode}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const finding = await Package.findOne({where:{package_id: req.body.packageId, gender: member.gender}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'package was not found.'
            })
        }
        const data_response = {
            packageId: finding.package_id,
            packageName: finding.name,
            day: finding.day,
            packageImage: finding.image,
            price: finding.price,
            username: member.username,
            password: member.password
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get package success.',
            package: data_response
        })
    }
    OnCheckPackageMember = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = await Members.findOne({where:{member_code: req.params.code}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const member_package: any = await this.view_member_package(member.id, member.gender)
        if(member_package){
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                package: member_package
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'error',
                description: "don't have package."
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
        const member = await Members.findOne({where:{member_code: req.body.memberCode}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const package_select = await Package.findOne({where:{package_id: req.body.packageId}})
        if(!package_select){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'package was not found.'
            })
        }
        const begin = moment().format('YYYY-MM-DD HH:mm:ss')
        const expire = moment(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss')
        const t =  await sequelize.transaction()
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
            const pack_order = await PackageOrder.create({
                package_id: req.body.packageId,
                begin: begin,
                expire: expire,
                status_expire: "no",
                status_confirm: "pending",
                status_payment: "pending",
                member_id: member.id,
                gender: member.gender
            }, { transaction: t })
            const pack_payment = await PackagePayment.create({
                package_order_id: pack_order.pack_order_id,
                slip: slip,
                status_confirm: 'pending',
                user_confirm: 0, //admin id
                bank_ref: req.body.bankRef
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
    OnRenewalPackage = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const authMember = req.authMember
        const member = await Members.findOne({where:{id: authMember.member_id}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const member_package: any = await this.view_member_package(member.id, member.gender)
        if(member_package.isStore == "yes"){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'you are store cannot renewal.'
            })
        }
        const package_select = await Package.findOne({where:{package_id: member_package.package_id}})
        const begin = member_package.begin
        const expire = moment(member_package.expire).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss')
        const t =  await sequelize.transaction()
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
            const pack_order = await PackageOrder.create({
                package_id: member_package.package_id,
                begin: begin,
                expire: expire,
                status_expire: "no",
                status_confirm: "pending",
                status_payment: "pending",
                member_id: member.id,
                gender: member.gender
            }, { transaction: t })
            const pack_payment = await PackagePayment.create({
                package_order_id: pack_order.pack_order_id,
                slip: slip,
                status_confirm: 'pending',
                user_confirm: 0,
                bank_ref: req.body.bankRef
            }, { transaction: t })
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'order package was created.'
            })
        } catch(error) {
            await t.rollback()
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnConfirmPayment = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const admin = req.authAdmin
        if(!admin){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'not authenticated.'
            })
        }
        const payment = await PackagePayment.findOne({where:{package_order_id: req.params.paymentId}})
        if(!payment){
            return res.status(404).json({
            status: false,
            message: 'error',
            description: 'data was not found.'
            })   
        }
        const order = await PackageOrder.findOne({where:{pack_order_id: req.params.paymentId}})
        if(!order){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'data was not found.'
            })
        }
        const package_select = await Package.findOne({where:{package_id: order.package_id}})
        const begin = moment().format('YYYY-MM-DD HH:mm:ss')
        const expire = moment(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss')
        try {
            payment.status_confirm = "confirm"
            payment.user_confirm = admin.user_id
            payment.save()
            order.begin = begin
            order.expire = expire
            order.status_expire = "no"
            order.status_confirm = "confirm"
            order.status_payment = "confirm"
            order.save()
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
    OnGetMemberPackageOrder = async(req: any, res: any) => {
        const finding = await this.query_package_order()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            order: finding
        })
    }
    OnUpdatePackage = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const package_result = await Package.findOne({where:{pack_id: req.body.packageId}})
        if(!package_result){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'package was not found.'
            })
        }
        try {
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
                .resize(500, 500)
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
                package_result.image = image
            }
            package_result.day = req.body.day
            package_result.content = req.body.content
            package_result.price = req.body.price
            package_result.gross_profit = req.body.grossProfit
            package_result.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'package was updated.'
            })
        } catch(error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnCheckStatusPayment = async(req: any, res: any) => {
        const member = await Members.findOne({where:{member_code: req.params.member_code}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const payment = await PackageOrder.findOne({where:{member_id: member.id, status_expire: 'no'}})
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
            description: 'get status success.',
            statusPay: statusPay
        })
    }
}