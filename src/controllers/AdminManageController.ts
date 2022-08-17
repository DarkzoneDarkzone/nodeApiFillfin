import { Settings } from './../models/settings';
import { Store } from './../models/store';
import { Members } from './../models/members';
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import fs from 'fs'
import bcrypt from 'bcrypt'
const sharp = require('sharp')
import path from 'path'
import { validationResult } from 'express-validator'
import { User } from '../models/users'

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
}