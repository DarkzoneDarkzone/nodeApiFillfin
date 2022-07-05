"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bankRouter_1 = require("./routes/bankRouter");
const packageRouter_1 = require("./routes/packageRouter");
const productRouter_1 = require("./routes/productRouter");
const express_1 = __importDefault(require("express"));
const config_1 = require("./util/config");
const path_1 = __importDefault(require("path"));
const memberRouter_1 = require("./routes/memberRouter");
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../../dist/public/')));
/*  -------- converting json -------- */
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/* Middleware */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
/** router */
app.use(memberRouter_1.memberRouter);
app.use(productRouter_1.productRouter);
app.use(packageRouter_1.packageRouter);
app.use(bankRouter_1.bankRouter);
/* Socket Start */
// const server = app.listen(socketPort)
// const io = SIO.init(server)
app.listen(config_1.serverPort);
