import { TokenLog } from './../models/tokenLog';
import { PackageOrder } from './../models/packageOrder';
import { sequelize } from './../util/database'
import { ViewService } from './../services/View.service'
import { Members } from './../models/members'
import * as jwt from 'jsonwebtoken'
import * as Config from '../util/config'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { Log } from '../models/log';

export class MembersController extends ViewService {
    OnGetAll = async(req: any, res: any) => {
        /* finding data */
        const finding = await Members.findAll({order: [['createdAt', 'DESC']]})
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
        /** check user  */
        const finding = await Members.findOne({where:{username: req.body.username}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        if(finding.statusMember !== 'active'){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'member was not active.'
            })
        }
        /** check password */
        if(!(req.body.password == finding.password)){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'password was not correct.'
            })
        }
        const package_sel = await PackageOrder.findOne({where:{member_id: finding.id, status_confirm: 'pending', status_payment: 'pending'}})
        const current_package: any = await this.view_member_package(finding.id, finding.gender)
        try {
            /* generate new access_token */
            const access_token = jwt.sign({
                member_id: finding.id,
                section: 'member',
                username: finding.username,
                gender: finding.gender,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '30m' })
            // const refresh_token = jwt.sign({
            //     username: finding.username,
            //     gender: finding.gender,
            //     section: 'member',
            //     at: new Date().getTime(),
            //     token: access_token
            // }, `${Config.secretKey}`)
            finding.access_token = access_token
            // finding.refresh_token = refresh_token
            finding.save()
            const userAgent = req.headers['user-agent']
            const logging = await Log.create({
                user_code: finding.member_code,
                refresh_token: finding.refresh_token,
                details: userAgent,
                ip_address: req.ip,
                section: 'member',
                status: 'active',
            }) 
            const tokenLogging = await TokenLog.create({
                refresh_token: finding.refresh_token,
                reset_token: "",
                section: 'member',
                active: true,
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'password is checked.',
                data: {
                    access_token: finding.access_token,
                    refresh_token: finding.refresh_token,
                    member_code: finding.member_code,
                    gender: finding.gender,
                    userName: finding.username,
                    packageId: (package_sel)?package_sel.package_id:null,
                    dateExpire: current_package?current_package.expire:null
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
        }, `${Config.secretKey}`, { expiresIn: '30m' })
        /* generate refresh_token when register and no expire */
        const refresh_token = jwt.sign({
            username: req.body.username,
            gender: req.body.gender,
            at: new Date().getTime(),
            token: access_token
        }, `${Config.secretKey}`)
        /** generate member_code */
        const str_member_code = `${req.body.username}.${req.body.password}${moment().format('YYYYMMDDHHmmss')}`
        let member_code = await bcrypt.hash(str_member_code, 10)
        const t = await sequelize.transaction()
        try {
            /** create member */
            const user = await Members.create({
                member_code: member_code.replace(/\W/g,""),
                access_token: access_token,
                refresh_token: refresh_token,
                username: req.body.username,
                gender: req.body.gender,
                password: req.body.password,
                isStore: 'no',
                statusMember: 'active'
            }, { transaction: t })
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.',
                memberCode: user.member_code
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
        const finding = await Members.findOne({where:{refresh_token: req.body.token}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member is not found.'
            })
        }
        const token = await TokenLog.findOne({where:{refresh_token: finding.refresh_token}})
        if(!token.active){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'token has been revoked.'
            })
        }
        try {
            /* generate new access_token */
            const access_token = jwt.sign({
                member_id: finding.id,
                section: (finding.isStore=="yes")?'store':'member',
                username: finding.username,
                gender: finding.gender,
                at: new Date().getTime()
            }, `${Config.secretKey}`, {expiresIn: '30m'})
            finding.access_token = access_token
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'generated new access token.',
                token: access_token
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
        try {
            const accessToken: any = await jwt.verify(access_token, `${Config.secretKey}`)
            if(moment().unix() > accessToken.exp){
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'token was expired.'
                })
            }
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
    OnChangeStatus = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                messageL: 'error',
                errorMessage: errors.array()
            })
        }
        const member = await Members.findOne({where: {member_code: req.body.memberCode} })
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        try {
            member.statusMember = req.body.status
            member.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'status was changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnDeleteMember = async(req: any, res: any) => {
        const finding = await Members.findOne({where: {member_code: req.params.code}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        try {
            finding.destroy()
            return res.status(200).json({
                status: false,
                message: 'ok',
                description: 'member was deleted.'
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