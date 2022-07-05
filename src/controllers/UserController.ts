import { Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import bcrypt from 'bcrypt'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import * as multerUpload from '../util/multerUpload'
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
        }, `${Config.secretKey}`, { expiresIn: '1d' })
        /* generate refresh_token when register and no expire */
        const refresh_token = jwt.sign({
            username: req.body.username,
            at: new Date().getTime(),
            token: access_token
        }, `${Config.secretKey}`)
        const users_str = req.body.username+Math.random().toString().substr(2, 8)+moment().unix()
        const users_code = await bcrypt.hash(users_str, 10)
        const hashPass = await bcrypt.hash(req.body.password, 10)
        try {
            let profile_img = ''
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
                        console.log(err)
                    })
                    return upload+originalname+ext
                })
                profile_img = image
            }
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
            const finding = await User.findOne({where:{username: req.body.username}})
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
                usercode: finding.users_code,
                username: req.body.username,
                psermission: finding.permission,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '1d' })
            /* generate refresh_token when register and no expire */
            const refresh_token = jwt.sign({
                username: req.body.username,
                at: new Date().getTime(),
                token: access_token
            }, `${Config.secretKey}`)
            finding.access_token = access_token
            finding.refresh_token = refresh_token
            finding.save()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'password has checked.',
                data: {
                    access_token: access_token,
                    refresh_token: refresh_token
                }
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
        const finding = await User.findOne({where:{users_code: req.body.userCode}})
        if(!finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: ''
            })
        }
        try {
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
        const user = await User.findOne({where:{users_code: req.params.code}})
        if(!user){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'user was not found.'
            })
        }
        try {
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
}