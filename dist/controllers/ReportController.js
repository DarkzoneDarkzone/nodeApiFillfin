"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const chat_temp_1 = require("./../models/chat_temp");
const store_1 = require("./../models/store");
const database_1 = require("./../util/database");
const orders_1 = require("./../models/orders");
const members_1 = require("./../models/members");
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const sharp = require('sharp');
const path_1 = __importDefault(require("path"));
const exceljs_1 = __importDefault(require("exceljs"));
const Report_service_1 = require("../services/Report.service");
const sequelize_1 = require("sequelize");
class ReportController extends Report_service_1.ReportService {
    constructor() {
        super(...arguments);
        this.OnGetStoreReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield this.queryReportStore(req.body.start || new Date(0, 0, 0), req.body.end || new Date());
                const filteredData = finding.map((data) => {
                    return {
                        gender: (data.gender === 'men') ? 'ชาย' : 'หญิง',
                        date: data.createdAt,
                        shopName: data.storeName,
                        cusUser: data.username,
                        orderLevel: data.packageLevel,
                        orderItem: data.product_name,
                        amount: data.price ? 1 : null,
                        price: data.price,
                        note: ''
                    };
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'get report success.',
                    report: filteredData,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnExportStoreReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield this.queryReportStore(req.body.start || new Date(0, 0, 0), req.body.end || new Date());
                const filteredData = finding.map((data) => {
                    return {
                        gender: (data.member_gender === 'men') ? 'ชาย' : 'หญิง',
                        date: data.createdAt,
                        shopName: data.storeName,
                        cusUser: data.username,
                        orderLevel: data.packageLevel,
                        orderItem: data.product_name,
                        amount: data.price ? 1 : null,
                        price: data.price,
                        note: ''
                    };
                });
                const workbook = new exceljs_1.default.Workbook();
                const worksheet = workbook.addWorksheet('ReportShop');
                worksheet.columns = [
                    { header: 'เพศ', key: 'gender', width: 10 },
                    { header: 'วันที่', key: 'date', width: 10 },
                    { header: 'ชื่อร้าน', key: 'shopName', width: 20, },
                    { header: 'ชื่อยูสลูกค้า', key: 'cusUser', width: 20, },
                    { header: 'ระดับ order', key: 'orderLevel', width: 15, },
                    { header: 'รายการสินค้า', key: 'orderItem', width: 40, },
                    { header: 'จำนวน', key: 'amount', width: 10, },
                    { header: 'ราคา', key: 'price', width: 15, },
                    { header: 'หมายเหตุ', key: 'note', width: 15, },
                ];
                worksheet.addRows(filteredData);
                var public_path = path_1.default.join(__dirname, '../../dist/public/');
                var newfolder = public_path;
                var fileFolder = `files/${(0, moment_1.default)().format('YYYY')}/${(0, moment_1.default)().format('MM')}/`;
                if (!fs_1.default.existsSync(`${newfolder + fileFolder}`)) {
                    fs_1.default.mkdirSync(newfolder + fileFolder, { recursive: true });
                }
                const filename = `ReportShop${(0, moment_1.default)().format('YYYYMMDDHH')}.xlsx`;
                const pathname = '/' + fileFolder + filename;
                workbook.xlsx.writeFile(newfolder + fileFolder + filename);
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    filepath: pathname
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    descripion: 'something went wrong.'
                });
            }
        });
        this.OnGetCustomerReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield this.queryReportCustomer(req.body.start || new Date(0, 0, 0), req.body.end || new Date());
                const filteredData = finding.map((data) => {
                    return {
                        dateRenewal: data.registerDate,
                        packageLevel: data.packageLevel,
                        cusUser: data.username,
                        totalPrice: data.priceTotal,
                        totalPackage: data.totalPackage,
                        dataRegister: data.registerDate,
                        note: ''
                    };
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'get report success.',
                    report: filteredData,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnExportCustomerReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield this.queryReportCustomer(req.body.start || new Date(0, 0, 0), req.body.end || new Date());
                const filteredData = finding.map((data) => {
                    return {
                        dateRenewal: data.registerDate,
                        packageLevel: data.packageLevel,
                        cusUser: data.username,
                        totalPrice: data.priceTotal,
                        totalPackage: data.totalPackage,
                        dataRegister: data.registerDate,
                        note: ''
                    };
                });
                const workbook = new exceljs_1.default.Workbook();
                const worksheet = workbook.addWorksheet('ReportCustomer');
                worksheet.columns = [
                    { header: 'วันต่ออายุ Package ล่าสุด', key: 'dateRenewal', width: 20 },
                    { header: 'ระดับ Package', key: 'packageLevel', width: 15 },
                    { header: 'ชื่อยูส', key: 'cusUser', width: 20, },
                    { header: 'ยอดซื้อสะสม', key: 'totalPrice', width: 20, },
                    { header: 'ยอด Package สะสม', key: 'totalPackage', width: 20, },
                    { header: 'วันที่สมัครสมาชิก', key: 'dataRegister', width: 20, },
                    { header: 'หมายเหตุ', key: 'note', width: 15, },
                ];
                worksheet.addRows(filteredData);
                var public_path = path_1.default.join(__dirname, '../../dist/public/');
                var newfolder = public_path;
                var fileFolder = `files/${(0, moment_1.default)().format('YYYY')}/${(0, moment_1.default)().format('MM')}/`;
                if (!fs_1.default.existsSync(`${newfolder + fileFolder}`)) {
                    fs_1.default.mkdirSync(newfolder + fileFolder, { recursive: true });
                }
                const filename = `ReportCustomer${(0, moment_1.default)().format('YYYYMMDDHH')}.xlsx`;
                const pathname = '/' + fileFolder + filename;
                workbook.xlsx.writeFile(newfolder + fileFolder + filename);
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    filepath: pathname
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    descripion: 'something went wrong.'
                });
            }
        });
        this.OnGetOrderReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield this.queryReportOrder(req.body.start || new Date(0, 0, 0), req.body.end || new Date());
                const filteredData = finding.map((data) => {
                    return {
                        orderNumber: data.order_number,
                        cusName: data.name,
                        address: data.address + ' ' + data.district + ' ' + data.subdistrict + ' ' + data.province + ' ' + data.code,
                        phone: data.phone,
                        totalPrice: data.totalprice,
                        netPrice: data.netprice,
                        slip: data.slip,
                        note: data.note,
                        paymentStatus: data.payment_status,
                        status: data.status,
                        orderDate: data.createdAt
                    };
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'get report success.',
                    report: filteredData,
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnExportOrderReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield this.queryReportOrder(req.body.start || new Date(0, 0, 0), req.body.end || new Date());
                const filteredData = finding.map((data) => {
                    return {
                        orderNumber: data.order_number,
                        cusName: data.name,
                        address: data.address + ' ' + data.district + ' ' + data.subdistrict + ' ' + data.province + ' ' + data.code,
                        phone: data.phone,
                        totalPrice: data.totalprice,
                        netPrice: data.netprice,
                        slip: data.slip,
                        note: data.note,
                        paymentStatus: data.payment_status,
                        status: data.status,
                        orderDate: data.createdAt
                    };
                });
                const workbook = new exceljs_1.default.Workbook();
                const worksheet = workbook.addWorksheet('ReportOrder');
                worksheet.columns = [
                    { header: 'order NO.', key: 'orderNumber', width: 20 },
                    { header: 'ชื่อ', key: 'cusName', width: 15 },
                    { header: 'ที่อยู่', key: 'address', width: 40, },
                    { header: 'Tel', key: 'phone', width: 20, },
                    { header: 'ราคาขาย', key: 'totalPrice', width: 20, },
                    { header: 'ราคาหลังหัก %GP', key: 'netPrice', width: 20, },
                    { header: 'ข้อความ', key: 'note', width: 20, },
                    { header: 'สถานะออเดอร์', key: 'status', width: 20, },
                    { header: 'สถานะการจ่ายเงิน', key: 'paymentStatus', width: 20, },
                ];
                worksheet.addRows(filteredData);
                var public_path = path_1.default.join(__dirname, '../../dist/public/');
                var newfolder = public_path;
                var fileFolder = `files/${(0, moment_1.default)().format('YYYY')}/${(0, moment_1.default)().format('MM')}/`;
                if (!fs_1.default.existsSync(`${newfolder + fileFolder}`)) {
                    fs_1.default.mkdirSync(newfolder + fileFolder, { recursive: true });
                }
                const filename = `ReportOrder${(0, moment_1.default)().format('YYYYMMDDHH')}.xlsx`;
                const pathname = '/' + fileFolder + filename;
                workbook.xlsx.writeFile(newfolder + fileFolder + filename);
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    filepath: pathname
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    descripion: 'something went wrong.'
                });
            }
        });
        this.OnGetDashboardData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const findingMember = yield members_1.Members.findAll({ where: { statusMember: 'active', isStore: 'no' } });
            const allMonth = moment_1.default.months();
            const memPerMonth = allMonth.map((data) => { return { month: data, total: 0 }; });
            findingMember.forEach((data) => {
                memPerMonth.forEach((monthInArr, index) => {
                    if ((0, moment_1.default)(data.createdAt).format('MMMM') === monthInArr.month) {
                        memPerMonth[index].total += 1;
                    }
                });
            });
            const findingTotalPerPack = yield this.queryMemberPackage();
            const totalPerPack = findingTotalPerPack.map((data) => {
                return {
                    packageName: data.name,
                    totalMember: data.totalMember
                };
            });
            const currentDate = (0, moment_1.default)().format('YYYY-MM-DD');
            const findingOrderAll = yield orders_1.Orders.findAll({ where: {
                    where: database_1.sequelize.where(database_1.sequelize.fn('date', database_1.sequelize.col('createdAt')), '=', currentDate)
                } });
            const toDayOrder = findingOrderAll.map((data) => {
                return {
                    orderNumber: data.order_number,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    totalPrice: parseInt(data.totalprice)
                };
            });
            const findingStoreOrder = yield this.queryStoreOrder();
            const filterStoreOrder = findingStoreOrder.map((data) => {
                return {
                    name: data.name,
                    status: data.status,
                    store_id: data.store_id,
                    totalPrice: parseInt(data.totalPrice),
                    totalProductSold: data.totalProductSold
                };
            });
            const newStore = yield store_1.Store.findAll({ where: {
                    status: 'inactive',
                    createdAt: {
                        [sequelize_1.Op.eq]: database_1.sequelize.col('updatedAt')
                    }
                } });
            const newMember = yield this.queryNewMember();
            const newOrder = yield orders_1.Orders.findAll({ where: { status: 'pending', payment_status: 'pending' } });
            const newChat = yield chat_temp_1.ChatTemp.findAll({ where: { isRead: 0 } });
            const dashboardTop = {
                newStore: newStore.length,
                newMember: newMember.length,
                newOrder: newOrder.length,
                newChat: newChat.length
            };
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get memebr per month success.',
                memberPerMonth: memPerMonth,
                totalPerPack: totalPerPack,
                toDayOrder: toDayOrder,
                orderAll: filterStoreOrder,
                forTopDashboard: dashboardTop
            });
        });
    }
}
exports.ReportController = ReportController;
