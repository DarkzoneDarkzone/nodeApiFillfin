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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const View_service_1 = require("./../services/View.service");
const users_1 = require("./../models/users");
const members_1 = require("./../models/members");
const chat_temp_1 = require("./../models/chat_temp");
const express_validator_1 = require("express-validator");
/** for socket */
const Sockets_1 = require("./../util/Sockets");
class ChatController extends View_service_1.ViewService {
    constructor() {
        super(...arguments);
        this.OnSendMessageToAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = yield members_1.Members.findOne({ where: { id: req.authMember.member_id } });
            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            const message = req.body.message;
            try {
                yield chat_temp_1.ChatTemp.create({
                    user_code: '',
                    member_code: member.member_code,
                    message: message,
                    from: 'member',
                    isRead: false
                });
                Sockets_1.SIO.getIO().emit("admin", { role: 'member', message: message, username: member.username });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'send message success.'
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
        this.OnSendMessageToMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const member = yield members_1.Members.findOne({ where: { member_code: req.body.memberCode } });
            const admin = req.authAdmin;
            if (!member) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'member was not found.'
                });
            }
            const message = req.body.message;
            try {
                yield chat_temp_1.ChatTemp.create({
                    user_code: admin.usercode,
                    member_code: member.member_code,
                    message: message,
                    from: 'admin',
                    isRead: false
                });
                Sockets_1.SIO.getIO().emit(`user-${member.username}`, { role: 'admin', message: message });
                return res.status(201).json({
                    status: true,
                    message: 'ok',
                    description: 'send message success.'
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
        this.OnGetOldChatMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const memberToken = req.authMember;
            try {
                const member = yield members_1.Members.findOne({ where: { id: memberToken.member_id } });
                const findingMessage = yield chat_temp_1.ChatTemp.findAll({ where: { member_code: member.member_code } });
                const memberRead = yield chat_temp_1.ChatTemp.findOne({ where: { from: 'admin', member_code: member.member_code },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });
                const filtered = findingMessage.map((data) => {
                    return {
                        message: data.message,
                        role: data.from,
                        dateSend: data.createdAt
                    };
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'get chat success.',
                    oldMessage: filtered,
                    statusRead: memberRead ? memberRead.isRead : true
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
        this.OnGetOldChatAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const findingMessage = yield chat_temp_1.ChatTemp.findAll();
                const memberAll = yield this.queryChatMember();
                const filteredMessage = findingMessage.map((data) => {
                    return {
                        memberCode: data.member_code,
                        message: data.message,
                        role: data.from,
                        dateSend: data.createdAt
                    };
                });
                const filteredMember = memberAll.map((data) => {
                    return {
                        adminCode: data.user_code,
                        memberCode: data.member_code,
                        message: data.message,
                        role: data.from,
                        isRead: data.isRead,
                        username: data.username
                    };
                });
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'get chat success.',
                    allMessage: filteredMessage,
                    allMember: filteredMember
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
        this.OnReadMessageMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const memberToken = req.authMember;
            try {
                const member = yield members_1.Members.findOne({ where: { id: memberToken.member_id } });
                const updated = yield chat_temp_1.ChatTemp.update({
                    isRead: true
                }, {
                    where: { member_code: member.member_code, from: 'admin' }
                });
                if (!updated) {
                    return res.status(400).json({
                        status: false,
                        message: 'error',
                        description: 'no message to update.'
                    });
                }
                else {
                    return res.status(200).json({
                        status: true,
                        message: 'ok',
                        description: 'message was readed.'
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnReadMessageAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const adminToken = req.authAdmin;
            try {
                const admin = yield users_1.User.findOne({ where: { id: adminToken.user_id } });
                const updated = yield chat_temp_1.ChatTemp.update({
                    isRead: true
                }, {
                    where: { member_code: req.params.code, from: 'member' }
                });
                if (!updated) {
                    return res.status(400).json({
                        status: false,
                        message: 'error',
                        description: 'no message to update.'
                    });
                }
                else {
                    return res.status(200).json({
                        status: true,
                        message: 'ok',
                        description: 'message was readed.'
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
    }
}
exports.ChatController = ChatController;
