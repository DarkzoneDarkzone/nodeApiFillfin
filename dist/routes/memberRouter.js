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
exports.memberRouter = void 0;
const MembersController_1 = require("../controllers/MembersController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multerUpload = __importStar(require("../util/multerUpload"));
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const membersController = new MembersController_1.MembersController();
router.get('/api/member/getAll', membersController.OnGetAll);
router.get('/api/member/get/:member_code', membersController.OnGetById);
router.post('/api/member/signin', [
    (0, express_validator_1.check)('username').notEmpty().isString(),
    (0, express_validator_1.check)('password').notEmpty().isString(),
], membersController.OnSignin);
router.post('/api/member/register', [
    (0, express_validator_1.check)('username').notEmpty().isString(),
    (0, express_validator_1.check)('password').notEmpty().isString(),
    (0, express_validator_1.check)('gender').notEmpty().isString(),
    (0, express_validator_1.check)('package_id').notEmpty().isString(),
], membersController.OnCreate);
router.post('/api/member/checkToken', membersController.OnCheckAccessToken);
router.post('/api/member/getToken', membersController.OnGetAccessToken);
exports.memberRouter = router;
