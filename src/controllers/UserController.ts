import { TokenLog } from './../models/tokenLog';
import { Log } from './../models/log';
import { Website } from './../models/website';
import { Store } from './../models/store';
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import { validationResult } from 'express-validator'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/users'

export class UserController {
    OnRegister = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        /** finding user */
        const finding = await User.findOne({where:{username: req.body.username}})
        if(finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'username has already used.'
            })
        }
        /* generate access_token for user */
        const access_token = jwt.sign({
            username: req.body.username,
            at: new Date().getTime()
        }, `${Config.secretKey}`, { expiresIn: '10m' })
        /* generate refresh_token when register and no expire */
        const refresh_token = jwt.sign({
            username: req.body.username,
            at: new Date().getTime(),
            token: access_token
        }, `${Config.secretKey}`)
        /** generate user_code */
        const users_str = req.body.username+Math.random().toString().substr(2, 8)+moment().unix()
        const users_code = await bcrypt.hash(users_str, 10)
        /** hash password */
        const hashPass = await bcrypt.hash(req.body.password, 10)
        try {
            let profile_img = ''
            /** upload image */
            if(req.file){
                let upload = "/uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname);
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
                .resize(200, 200)
                .withMetadata()
                .jpeg({ quality: 95})
                .toFile( path.resolve(req.file.destination, originalname+ext))
                .then((data: any) => {
                    fs.unlink( req.file.path, (err) => {
                        if(err){
                            console.log(err)
                        }
                    })
                    return upload+originalname+ext
                })
                profile_img = image
            }
            /** create user */
            const users = await User.create({
                users_code: users_code.replace(/\W/g, ""),
                access_token: access_token,
                refresh_token: refresh_token,
                username: req.body.username,
                password: hashPass,
                email: req.body.email,
                profile_img: profile_img,
                permission: 3,
                status_confirm: 'pending',
                display_name: req.body.name,
                status: 'pending'
            })
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnSignin = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            /** find user */
            const finding = await User.findOne({where:{username: req.body.username}})
            /** check password is correct */
            const isPasswordCorrect = await bcrypt.compare(req.body.password, finding.password)
            if(!isPasswordCorrect){
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'password was incorrect.'
                })
            }
            /* generate access_token for user */
            const access_token = jwt.sign({
                user_id: finding.id,
                section: 'admin',
                usercode: finding.users_code,
                username: req.body.username,
                psermission: finding.permission,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '10m' })
            /* generate refresh_token when register and no expire */
            const refresh_token = jwt.sign({
                username: finding.username,
                gender: finding.gender,
                section: 'store',
                at: new Date().getTime(),
                token: access_token
            }, `${Config.secretKey}`)
            /** update access_token and refresh_token */
            finding.access_token = access_token
            finding.refresh_token = refresh_token
            finding.save()
            const ip = req.ip.split(':')[3]
            const userAgent = req.headers['user-agent']
            const logging = await Log.create({
                user_code: finding.users_code,
                refresh_token: refresh_token,
                details: userAgent,
                ip_address: ip,
                section: 'admin',
                status: 'active',
            }) 
            const tokenLogging = await TokenLog.create({
                refresh_token: refresh_token,
                section: 'admin',
                active: true,
            })
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'password has checked.',
                access_token: access_token,
                refresh_token: refresh_token
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnUpdate = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        /** finding user */
        const finding = await User.findOne({where:{users_code: req.body.adminCode}})
        if(!finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'admin was not found.'
            })
        }
        try {
            /** update data user */
            finding.email = req.body.email
            finding.permission = req.body.permission
            finding.status_confirm = req.body.status_confirm
            finding.display_name = req.body.display_name
            finding.profile_img = req.body.profile_img
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'data was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnDelete = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'erorr',
                errorMessage: errors.array()
            })
        }
        /** find user account */
        const user = await User.findOne({where:{users_code: req.params.code}})
        if(!user){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user was not found.'
            })
        }
        try {
            /** delete user account */
            user.destroy()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'data was deleted.'
            })
        } catch (error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnUploadVideoStore = async(req: any, res: any) => {
        const store = await Store.findOne({where:{id: req.body.storeId}})
        if(!store){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'store was not found.'
            })
        }
        try {
            if(req.file){
                let dest = req.file.destination.split("uploads")
                var ext = path.extname(req.file.originalname)
                let originalname = path.basename(req.file.originalname, ext)
                const newfolder = `${dest[0]}video${dest[1]}`
                if(!fs.existsSync(newfolder)){
                    fs.mkdirSync(newfolder, { recursive: true })
                } 
                for(let i = 1; fs.existsSync(newfolder+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const path_upload = "video"+dest[1]+originalname+ext
                fs.copyFile(req.file.path, dest[0]+path_upload, (err) => {
                    if(err){
                        console.log(err)
                    }
                })
                fs.unlink( req.file.path, (err) => {
                    if(err){
                        console.log(err)
                    }
                })
                store.profile_video = path_upload
                store.save()
                return res.status(201).json({
                    sttaus: true,
                    message: 'ok',
                    description: 'video was uploaded.'
                })
            }
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'file was not found.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnUpdateContent = async(req: any, res: any) => {
        const website = await Website.findOne({where:{id: req.body.id}})
        if(!website){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'content was not found.'
            })
        }
        try {
            if(req.file){
                let dest = req.file.destination.split("uploads")
                var ext = path.extname(req.file.originalname)
                let originalname = path.basename(req.file.originalname, ext)
                const newfolder = `${dest[0]}video${dest[1]}`
                if(!fs.existsSync(newfolder)){
                    fs.mkdirSync(newfolder, { recursive: true })
                } 
                for(let i = 1; fs.existsSync(newfolder+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const path_upload = "video"+dest[1]+originalname+ext
                fs.copyFile(req.file.path, dest[0]+path_upload, (err) => {
                    if(err){
                        console.log(err)
                    }
                })
                fs.unlink( req.file.path, (err) => {
                    if(err){
                        console.log(err)
                    }
                })
                website.video_link = path_upload
            }
            website.type = req.body.type
            website.title = req.body.title
            website.content = req.body.content
            website.h1 = req.body.h1
            website.h2 = req.body.h2
            website.image_link = req.body.image_link
            website.save()
            return res.status(201).json({
                sttaus: true,
                message: 'ok',
                description: 'content was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetAccessToken = async(req: any, res: any) => {
        const finding = await User.findOne({where:{refresh_token: req.body.token}})
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user is not found.'
            })
        }
        const token = await TokenLog.findOne({where:{refresh_token: finding.refresh_token}})
        if(!token.active){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'token has been revoked.'
            })
        }
        try {
            /* generate new access_token */
            const access_token = jwt.sign({
                user_id: finding.users_code,
                section: 'admin',
                username: finding.username,
                at: new Date().getTime()
            }, `${Config.secretKey}`, {expiresIn: '10m'})
            finding.access_token = access_token
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'generated new access token.',
                token: access_token
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'Something went wrong.'
            })
        }
    }
    OnGetContent = async(req: any, res: any) => {
        const finding = await Website.findAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get content success.',
            content: finding
        })
    }
    OnChangeStatusContent = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const finding = await Website.update(
            {
                display: req.body.display
            },{
                where: { id: req.body.id }
            }
        )
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'update content success.'
        })
    }
}