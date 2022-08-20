import { sequelize } from './../util/database';
import { Orders } from './../models/orders';
import { Members } from './../models/members';
import moment from 'moment'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import ExcelJS from 'exceljs'
import { ReportService } from '../services/Report.service'

export class ReportController extends ReportService {
    OnGetStoreReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportStore(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    gender: (data.gender==='men')?'ชาย':'หญิง',
                    date: data.createdAt,
                    shopName: data.storeName,
                    cusUser: data.username,
                    orderLevel: data.packageLevel,
                    orderItem: data.product_name,
                    amount: data.price?1:null,
                    price: data.price,
                    note: ''
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get report success.',
                report: filteredData,
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnExportStoreReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportStore(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    gender: (data.member_gender==='men')?'ชาย':'หญิง',
                    date: data.createdAt,
                    shopName: data.storeName,
                    cusUser: data.username,
                    orderLevel: data.packageLevel,
                    orderItem: data.product_name,
                    amount: data.price?1:null,
                    price: data.price,
                    note: ''
                }
            })
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ReportShop');
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
    OnGetCustomerReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportCustomer(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    dateRenewal: data.registerDate,
                    packageLevel: data.packageLevel,
                    cusUser: data.username,
                    totalPrice: data.priceTotal,
                    totalPackage: data.totalPackage,
                    dataRegister: data.registerDate,
                    note: ''
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get report success.',
                report: filteredData,
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnExportCustomerReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportCustomer(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    dateRenewal: data.registerDate,
                    packageLevel: data.packageLevel,
                    cusUser: data.username,
                    totalPrice: data.priceTotal,
                    totalPackage: data.totalPackage,
                    dataRegister: data.registerDate,
                    note: ''
                }
            })
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ReportCustomer');
            worksheet.columns = [
                {header: 'วันต่ออายุ Package ล่าสุด', key: 'dateRenewal', width: 20},
                {header: 'ระดับ Package', key: 'packageLevel', width: 15},
                {header: 'ชื่อยูส', key: 'cusUser', width: 20,},
                {header: 'ยอดซื้อสะสม', key: 'totalPrice', width: 20,},
                {header: 'ยอด Package สะสม', key: 'totalPackage', width: 20,},
                {header: 'วันที่สมัครสมาชิก', key: 'dataRegister', width: 20,},
                {header: 'หมายเหตุ', key: 'note', width: 15,},
            ];
            worksheet.addRows(filteredData)
            var public_path = path.join(__dirname, '../../dist/public/')
            var newfolder = public_path+`files/${moment().format('YYYY')}/${moment().format('MM')}/`
            if(!fs.existsSync(`${newfolder}`)){
                fs.mkdirSync(newfolder, { recursive: true })
            }
            const filename = `ReportCustomer${moment().format('YYYYMMDDHH')}.xlsx`
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
    OnGetOrderReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportOrder(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    orderNumber: data.order_number,
                    cusName: data.name,
                    address: data.address+' '+data.district+' '+data.subdistrict+' '+data.province+' '+data.code,
                    phone: data.phone,
                    totalPrice: data.totalprice,
                    netPrice: data.netprice,
                    slip: data.slip,
                    note: data.note,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    orderDate: data.createdAt
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get report success.',
                report: filteredData,
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnExportOrderReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportOrder(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    orderNumber: data.order_number,
                    cusName: data.name,
                    address: data.address+' '+data.district+' '+data.subdistrict+' '+data.province+' '+data.code,
                    phone: data.phone,
                    totalPrice: data.totalprice,
                    netPrice: data.netprice,
                    slip: data.slip,
                    note: data.note,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    orderDate: data.createdAt
                }
            })
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('ReportOrder')
            worksheet.columns = [
                {header: 'order NO.', key: 'orderNumber', width: 20},
                {header: 'ชื่อ', key: 'cusName', width: 15},
                {header: 'ที่อยู่', key: 'address', width: 40,},
                {header: 'Tel', key: 'phone', width: 20,},
                {header: 'ราคาขาย', key: 'totalPrice', width: 20,},
                {header: 'ราคาหลังหัก %GP', key: 'netPrice', width: 20,},
                {header: 'ข้อความ', key: 'note', width: 20,},
                {header: 'สถานะออเดอร์', key: 'status', width: 20,},
                {header: 'สถานะการจ่ายเงิน', key: 'paymentStatus', width: 20,},
            ];
            worksheet.addRows(filteredData)
            var public_path = path.join(__dirname, '../../dist/public/')
            var newfolder = public_path+`files/${moment().format('YYYY')}/${moment().format('MM')}/`
            if(!fs.existsSync(`${newfolder}`)){
                fs.mkdirSync(newfolder, { recursive: true })
            }
            const filename = `ReportOrder${moment().format('YYYYMMDDHH')}.xlsx`
            const pathname = '/'+(newfolder+filename).split('public\\')[1]
            await workbook.xlsx.writeFile(newfolder+filename)
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
    OnGetDashboardData = async(req: any, res: any) => {
        const findingMember = await Members.findAll({where: {statusMember: 'active', isStore: 'no'}})
        const allMonth = moment.months()
        const memPerMonth: any = allMonth.map((data: any) => {return {month: data, total: 0}})
        findingMember.forEach((data: any) => {
            memPerMonth.forEach((monthInArr: any, index: any) => {
                if(moment(data.createdAt).format('MMMM') === monthInArr.month){
                    memPerMonth[index].total += 1
                }
            })
        })
        const findingTotalPerPack: any = await this.queryMemberPackage()
        const totalPerPack = findingTotalPerPack.map((data: any) => {
            return {
                packageName: data.name,
                totalMember: data.totalMember
            }
        })
        const currentDate = moment().format('YYYY-MM-DD')
        const findingOrderAll: any = await Orders.findAll({where: {
            where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', currentDate)
        }})
        const toDayOrder = findingOrderAll.map((data: any) => {
            return {
                paymentStatus: data.payment_status,
                status: data.status,
                totalPrice: data.totalprice
            }
        })
        const findingStoreOrder: any = await this.queryStoreOrder()

        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get memebr per month success.',
            memberPerMonth: memPerMonth,
            totalPerPack: totalPerPack,
            toDayOrder: toDayOrder,
            orderAll: findingStoreOrder
        })
    }
}