import { ViewService } from './../services/View.service';
import { User } from './../models/users';
import { Members } from './../models/members';
import { ChatTemp } from './../models/chat_temp';
import { sequelize } from './../util/database'
import { Op } from 'sequelize'
import moment from 'moment'
import { validationResult } from 'express-validator'

/** for socket */
import { SIO } from './../util/Sockets'

export class ChatController extends ViewService {
    OnSendMessageToAdmin = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = await Members.findOne({where:{id: req.authMember.member_id}})
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const message = req.body.message
        try {
            await ChatTemp.create({
                user_code: '',
                member_code: member.member_code,
                message: message,
                from: 'member',
                isRead: false
            })
            SIO.getIO().emit("admin", {role: 'member', message: message, username: member.username})
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'send message success.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnSendMessageToMember = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const member = await Members.findOne({where:{member_code: req.body.memberCode}})
        const admin = req.authAdmin
        if(!member){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'member was not found.'
            })
        }
        const message = req.body.message
        try {
            await ChatTemp.create({
                user_code: admin.usercode,
                member_code: member.member_code,
                message: message,
                from: 'admin',
                isRead: false
            })
            SIO.getIO().emit(`user-${member.username}`, {role: 'admin', message: message})
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'send message success.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetOldChatMember = async(req: any, res: any) => {
        const memberToken = req.authMember
        try {
            const member = await Members.findOne({where: {id: memberToken.member_id}})
            const findingMessage: any = await ChatTemp.findAll({where: {member_code: member.member_code}})
            const memberRead = await ChatTemp.findOne({where:{from: 'admin', member_code: member.member_code},
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            const filtered = findingMessage.map((data: any) => {
                return {
                    message: data.message,
                    role: data.from,
                    dateSend: data.createdAt
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get chat success.',
                oldMessage: filtered,
                statusRead: memberRead?memberRead.isRead:true
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetOldChatAdmin = async(req: any, res: any) => {
        try {
            const findingMessage: any = await ChatTemp.findAll()
            const memberAll: any = await this.queryChatMember()
            const filteredMessage = findingMessage.map((data: any) => {
                return {
                    memberCode: data.member_code,
                    message: data.message,
                    role: data.from,
                    dateSend: data.createdAt
                }
            })
            const filteredMember = memberAll.map((data: any) => {
                return {
                    adminCode: data.user_code,
                    memberCode: data.member_code,
                    message: data.message,
                    role: data.from,
                    isRead: data.isRead,
                    username: data.username
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get chat success.',
                allMessage: filteredMessage,
                allMember: filteredMember
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnReadMessageMember = async(req: any, res: any) => {
        const memberToken = req.authMember
        try {
            const member = await Members.findOne({where: {id: memberToken.member_id}})
            const updated = await ChatTemp.update(
            {
                isRead: true
            },{
                where: {member_code: member.member_code, from: 'admin'}
            })
            if(!updated){
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'no message to update.'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'message was readed.'
                })
            }
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnReadMessageAdmin = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const adminToken = req.authAdmin
        try {
            const admin = await User.findOne({where: {id: adminToken.user_id}})
            const updated = await ChatTemp.update(
            {
                isRead: true
            },{
                where: {member_code: req.params.code, from: 'member'}
            })
            if(!updated){
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'no message to update.'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'message was readed.'
                })
            }
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
}