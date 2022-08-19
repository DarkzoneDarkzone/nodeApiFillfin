import { TokenLog } from './../models/tokenLog';
import { Settings } from './../models/settings';
import { Store } from './../models/store';
import { Members } from './../models/members';
import 'moment/locale/th'
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
}