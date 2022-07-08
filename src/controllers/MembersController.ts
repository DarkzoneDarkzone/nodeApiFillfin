import { sequelize } from './../util/database';
import { ViewService } from './../services/View.service';
import { PackageOrder } from './../models/packageOrder';
import { Package } from './../models/package';
import { Members } from './../models/members';
import * as jwt from 'jsonwebtoken'
import * as Config from '../util/config'
import { Op } from 'sequelize'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

export class MembersController extends ViewService {
    OnGetAll = async(req: any, res: any) => {
        /* finding data */
        const finding = await Members.findAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding
        })
    }
    OnSignin = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await Members.findOne({where:{username: req.body.username}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        if(!(req.body.password == finding.password)){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'password was not correct.'
            })
        }
        try {
            /* generate new access_token */
            const access_token = jwt.sign({
                member_id: finding.id,
                section: 'member',
                username: finding.username,
                gender: finding.gender,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '1d' })
            finding.access_token = access_token
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'password is checked.',
                data: {
                    access_token: finding.access_token,
                    refresh_token: finding.refresh_token,
                    member_code: finding.member_code,
                    gender: finding.gender,
                    userName: finding.username
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
    OnCreate = async(req: any, res: any) => {
        /* validate data before */
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessages: errors.array()
            })
        }
        /* finding email multiple */
        const finding = await Members.findOne({where:{username: req.body.username}})
        if(finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'username has been used.'
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
        const str_member_code = `${req.body.username}.${req.body.password}${moment().format('YYYYMMDDHHmmss')}`
        let member_code = await bcrypt.hash(str_member_code, 10)
        const package_select = await Package.findOne({where:{package_id: req.body.package_id}})
        const t = await sequelize.transaction()
        try {
            /* end upload image */
            const user = await Members.create({
                member_code: member_code.replace(/\W/g,""),
                access_token: access_token,
                refresh_token: refresh_token,
                username: req.body.username,
                gender: req.body.gender,
                password: req.body.password,
                isStore: 'no'
            }, { transaction: t })
            const begin = moment().format('YYYY-MM-DD HH:mm:ss')
            // const expire = moment(begin).add(package_select.day, 'days').format('YYYY-MM-DD HH:mm:ss')
            const pack_order = await PackageOrder.create({
                package_id: req.body.package_id,
                begin: begin,
                expire: begin,
                status_expire: "no",
                status_confirm: "pending",
                status_payment: "notpay",
                member_id: user.id,
                gender: user.gender
            }, { transaction: t })
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.',
                data: user.member_code
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
    OnUpdate = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessages: errors.array()
            })
        }
        /* finding username multiple */
        const finding = await Members.findOne({where:{username: req.body.username}})
        if(finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'username has been used.'
            })
        }
        try {
            finding.username = req.body.username,
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'update data success.'
            })
        } catch(error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetAccessToken = async (req: any, res: any) => {
        /* finding old data */
        const finding = await Members.findOne({where:{refresh_token: req.params.token}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member is not found.'
            })
        }
        try {
            /* generate new access_token */
            const access_token = jwt.sign({
                username: finding.username,
                gender: req.params.gender,
                at: new Date().getTime()
            }, `${Config.secretKey}`, {expiresIn: '1d'})
            finding.access_token = access_token
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'generated new access_token.',
                data: access_token
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'Something went wrong.'
            })
        }
    }
    OnCheckAccessToken = async (req: any, res: any, next: any) => {
        const access_token = req.body.token
        if(!access_token){
            return res.status(401).json({
                message: 'Not Authenticated.'
            })
        }
        /* receive bearer token from header */
        let decodedToken: any
        /* if having token */
        if(access_token != ''){
            try {
                /* verify token for get data and check expire token */
                decodedToken = await jwt.verify(access_token, `${Config.secretKey}`)
                /* if token was expired */
                if(moment().unix() > decodedToken.exp){
                    return res.status(401).json({
                        status: false,
                        message: 'error',
                        description: 'token was expired.'
                    })
                }
                /* data keep for use when update data in database */
                req.authToken = access_token
                return res.status(200).json({
                    status: true,
                    message: 'token is correct.'
                })
            } catch(error) {
                return res.status(401).json({ 
                    status: false, 
                    message:'error', 
                    description: "authentication failed, token was expired!"
                })
            }
        }
    }
}