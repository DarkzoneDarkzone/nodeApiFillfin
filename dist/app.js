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
const chat_temp_1 = require("./models/chat_temp");
const database_1 = require("./util/database");
const settings_1 = require("./models/settings");
const express_1 = __importDefault(require("express"));
const config_1 = require("./util/config");
const path_1 = __importDefault(require("path"));
const Sockets_1 = require("./util/Sockets");
const videoRouter_1 = require("./routes/videoRouter");
const websiteRouter_1 = require("./routes/websiteRouter");
const adminRouter_1 = require("./routes/adminRouter");
const storeRouter_1 = require("./routes/storeRouter");
const memberRouter_1 = require("./routes/memberRouter");
const cron = require("node-cron");
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
/* เปิด SyncModels เมื่อเปลี่ยนแปลง Database Structure */
// SyncModels.OnInit()
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, './../dist/public/')));
/*  -------- converting json -------- */
app.use(body_parser_1.default.json({ limit: '100mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '100mb' }));
/* Middleware */
app.use((req, res, next) => {
    console.log('access sever');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(memberRouter_1.memberRouter);
app.use(adminRouter_1.adminRouter);
app.use(storeRouter_1.storeRouter);
app.use(websiteRouter_1.websiteRouter);
app.use(videoRouter_1.videoRouter);
app.use("/test", (req, res) => {
    res.status(200).json({ message: "ok" });
});
/* Socket Start */
const server = app.listen(config_1.socketPort, '0.0.0.0');
const io = Sockets_1.SIO.init(server);
/**------------- 0 0 * * * * -------------
 * run cron-job every 1 Hour
*/
cron.schedule('0 0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    /** for remove folder slip old than 'cron_job_month' value */
    const cron_job = yield settings_1.Settings.findOne({ where: { setting_name: 'cron_job_month' } });
    var public_path = path_1.default.join(__dirname, './../dist/public/');
    const folderPath = `/slip/${(0, moment_1.default)().format('YYYY')}/${(0, moment_1.default)().subtract(parseInt(cron_job.setting_value), 'months').format('MM')}`;
    if (fs_1.default.existsSync(public_path + folderPath)) {
        fs_1.default.rmSync(public_path + folderPath, { recursive: true });
    }
    /** for delete message old than 'time_delete_message' value */
    const delete_message = yield settings_1.Settings.findOne({ where: { setting_name: 'time_delete_message' } });
    const dateToDelete = (0, moment_1.default)().subtract(parseInt(delete_message.setting_value), 'days').format('YYYY-MM-DD');
    yield chat_temp_1.ChatTemp.destroy({
        where: database_1.sequelize.where(database_1.sequelize.fn('date', database_1.sequelize.col('createdAt')), '=', dateToDelete)
    });
}));
app.listen(config_1.serverPort);
