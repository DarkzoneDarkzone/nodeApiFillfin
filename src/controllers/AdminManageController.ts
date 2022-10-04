import { TokenLog } from './../models/tokenLog';
import { Settings } from './../models/settings';
import { Store } from './../models/store';
import { Members } from './../models/members';
import fs from 'fs'
import bcrypt from 'bcrypt'
const sharp = require('sharp')
import path from 'path'
import { validationResult } from 'express-validator'
import { User } from '../models/users'
import { Log } from '../models/log';

export class AdminManageController {
    OnChangePasswordMember = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await Members.findOne({where:{ member_code: req.body.memberCode }})
            finding.password = req.body.newPassword
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'passsword was changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnChangePasswordStore = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await Store.findOne({where:{ store_code: req.body.storeCode }})
            finding.password = await bcrypt.hash(req.body.newPassword, 10)
            finding.save()
            const findingMember = await Members.findOne({where: {username: finding.username}})
            findingMember.password = req.body.newPassword
            findingMember.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'passsword was changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnChangePasswordAdmin = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await User.findOne({where:{ users_code: req.body.adminCode }})
            // if(finding.permission !== 1){
            //     return res.status(405).json({
            //         status: false,
            //         message: 'error',
            //         description: "Don't have permission"
            //     })
            // }
            finding.password = await bcrypt.hash(req.body.newPassword, 10)
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'passsword was changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnSetGrossProfit = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await Settings.findOne({where:{setting_name: 'gross_profit'}})
            finding.setting_value = req.body.gp
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'set gp success.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetLogSignin = async(req: any, res: any) => {
        const finding: any = await Log.findAll()
        const filtered = finding.map((data: any) => {
            return {
                adminCode: data.user_code,
                ipAddress: data.ip_address,
                section: data.section,
                details: data.details,
                status: data.status,
                dateSignin: data.createdAt
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            log: filtered
        })
    }
    OnChangeStatusLog = async(req: any, res: any) => {
        const finding = await Log.findOne({where:{ user_code: req.body.adminCode }})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'admin was not found.'
            })
        }
        try {
            if(req.body.status === 'banned'){
                const token = await TokenLog.findOne({where:{refresh_token: finding.refresh_token}})
                if(token){
                    token.active = false
                    token.save()
                }
            }
            finding.status = req.body.status
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'admin status was changed.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetDataSettings = async(req: any, res: any) => {
        const finding = await Settings.findAll()
        const filtered = finding.map((data: any) => {
            return {
                settingName: data.setting_name,
                settingValue: data.setting_value,
                image: data.image,
                display: data.display
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            setting: filtered
        })
    }
    OnUpdateSettings = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await Settings.findOne({where: {setting_name: req.body.settingName}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
        try {
            if(req.file){
                let upload = "/uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname)
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
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
                finding.image = image
            }
            finding.setting_value = req.body.settingValue
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'update value success.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetLineQR = async(req: any, res: any) => {
        const finding = await Settings.findOne({where: {setting_name: req.params.section}})
        const filtered = {
            settingName: finding.setting_name,
            settingValue: finding.setting_value,
            image: finding.image,
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            setting: filtered
        })
    }
}