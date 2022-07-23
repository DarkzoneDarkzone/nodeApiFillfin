import { sequelize } from './../util/database'
import { BankProvider } from './../models/bankProvider'
import { BankAccount } from './../models/bankAccount'
import { BankService } from '../services/Bank.service'
import 'moment/locale/th'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'

export class BankController extends BankService {
    OnGetBankAccount = async(req: any, res: any) => {
        const finding = await BankAccount.findAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding
        })
    }
    OnCreateBankAccount = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding_bank = await BankAccount.findOne({where:{bank_number: req.body.bank_number}})
        if(!finding_bank){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'data is not found.'
            })
        }
        const t = await sequelize.transaction()
        try {
            const bank_account = await BankAccount.create({
                name: req.body.name,
                bank_account: req.body.bank_account,
                branch: req.body.branch,
                bank_provider_id: req.body.bank_provider_id,
                status: 'active'
            }, { transaction: t })
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch {
            await t.rollback()
            return res.status(500).json({
                status: false,
                message: 'error',
                dscription: 'something went wrong.'
            })
        }
    }
    OnUpdateBankAccount = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await BankAccount.findOne({where:{id: req.body.id}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'data is not found.'
            })
        }
        try {
            finding.name = req.body.name
            finding.bank_account = req.body.bank_account
            finding.branch = req.body.branch
            finding.bank_provider_id = req.body.bank_provider_id
            finding.status = req.body.status
            finding.save()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was updated..'
            })
        } catch {
            return res.status(500).json({
                status: false,
                message: 'error',
                dscription: 'something went wrong.'
            })
        }
    }
    OnGetBankProvider = async(req: any, res: any) => {
        const finding = await BankProvider.findAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding
        })
    }
    OnGetBankAll = async(req: any, res: any) => {
        const finding = await this.queryBankAccountAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            data: finding
        })
    }
}