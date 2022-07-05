"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageRouter = void 0;
const PackageController_1 = require("./../controllers/PackageController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multerUpload = __importStar(require("../util/multerUpload"));
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const packageController = new PackageController_1.PackageController();
router.get('/api/package/get', packageController.OnGetPackageAll);
router.get('/api/package/getOrder/:member_code', packageController.OnGetPackageOrder);
router.get('/api/package/createOrder', [
    (0, express_validator_1.check)('member_id').notEmpty(),
    (0, express_validator_1.check)('gender').notEmpty().isString(),
    (0, express_validator_1.check)('package_id').notEmpty(),
], packageController.OnCreatePackageOrder);
router.get('/api/package/createPayment', upload.single('slip'), [
    (0, express_validator_1.check)('member_id').notEmpty(),
    (0, express_validator_1.check)('gender').notEmpty().isString(),
    (0, express_validator_1.check)('bank_ref').notEmpty(),
], packageController.OnCreatePayment);
exports.packageRouter = router;
