import { ViewReportShop } from './../models/viewReportShop';
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import { validationResult } from 'express-validator'
import ExcelJS from 'exceljs'
import { ReportService } from '../services/Report.service'

export class ReportController extends ReportService {
    OnGetStoreReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportStore(req.body.start || null, req.body.end || null)
            const filteredData = finding.map((data: any) => {
            return {
                gender: (data.member_gender==='men')?'ชาย':'หญิง',
                date: data.createdAt,
                shopName: data.storeName,
                cusUser: data.username,
                orderLevel: data.packageLevel,
                orderItem: data.product_name,
                amount: 1,
                price: data.price,
                note: ''
            }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get report success.',
                report: filteredData
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnExportStore = async(req: any, res: any) => {
        try {
            // const finding: any = await this.queryReportStore(req.body.start || null, req.body.end || null)
            const finding = await ViewReportShop.findAll()
            const filteredData = finding.map((data: any) => {
                return {
                    gender: (data.member_gender==='men')?'ชาย':'หญิง',
                    date: data.createdAt,
                    shopName: data.storeName,
                    cusUser: data.username,
                    orderLevel: data.packageLevel,
                    orderItem: data.product_name,
                    amount: 1,
                    price: data.price,
                    note: ''
                }
            })
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('My Sheet');
            worksheet.columns = [
                {header: 'เพศ', key: 'gender', width: 10},
                {header: 'วันที่', key: 'date', width: 10},
                {header: 'ชื่อร้าน', key: 'shopName', width: 20,},
                {header: 'ชื่อยูสลูกค้า', key: 'cusUser', width: 20,},
                {header: 'ระดับ order', key: 'orderLevel', width: 15,},
                {header: 'รายการสินค้า', key: 'orderItem', width: 40,},
                {header: 'จำนวน', key: 'amount', width: 10,},
                {header: 'ราคา', key: 'price', width: 15,},
                {header: 'หมายเหตุ', key: 'note', width: 15,},
            ];
            worksheet.addRows(filteredData)
            var public_path = path.join(__dirname, '../../dist/public/')
            var newfolder = public_path+`files/${moment().format('YYYY')}/${moment().format('MM')}/`
            if(!fs.existsSync(`${newfolder}`)){
                fs.mkdirSync(newfolder, { recursive: true })
            }
            const filename = `ReportShop${moment().format('YYYYMMDDHH')}.xlsx`
            const pathname = '/'+(newfolder+filename).split('public\\')[1]
            await workbook.xlsx.writeFile(newfolder+filename);
            return res.status(200).json({
                status: true,
                message: 'ok',
                filepath: pathname
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                descripion: 'something went wrong.'
            })
        }
    }
}