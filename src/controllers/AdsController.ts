import { Ads } from './../models/ads'
import { Op } from 'sequelize'
import moment from 'moment'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'

export class AdsController {
    OnGetAds = async(req: any, res: any) => {
        const finding = await Ads.findAll({
            where:{
            position: req.params.page,
            display: true
            },
            order: [
                ['priority', 'ASC'],
            ],
        })
        const filtered = finding.map((data: any) => {
            return {
                ads_id: data.id,
                position: data.position,
                title: data.title,
                content: data.content,
                h1: data.h1,
                h2: data.h2,
                image: data.img_path,
            }
        })
        return res.status(200).json({
            status: true,
            message: 'ok',
            descriptin: 'get banner success.',
            ads: filtered
        })
    }
    OnCreateAds = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'erorr',
                errorMessage: errors.array()
            })
        }
        try {
            let image_path = ''
            if(req.file){
                let upload = "/uploads"+req.file.destination.split("uploads").pop()
                let dest = req.file.destination
                var ext = path.extname(req.file.originalname)
                let originalname = path.basename(req.file.originalname, ext)
                for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                    originalname = originalname.split('(')[0]
                    originalname += '('+i+')'
                }
                const image = await sharp(req.file.path)
                .resize(500, 500)
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
                image_path = image
            }
            const updateAds = await Ads.update(
            {
                priority: +1,
            },{
                where: {
                    position: req.body.position,
                    priority: {[Op.lt]: req.body.priority}
                }
            })
            const res = await Ads.create({
                position: req.body.position,
                isMen: '',
                title: '',
                content: '',
                h1: '',
                h2: '',
                display: true,
                priority: req.body.priority,
                img_path: image_path
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'ads was created.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnUpdateAds = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'erorr',
                errorMessage: errors.array()
            })
        }
        const finding = await Ads.findOne({where:{id: req.body.id}})
        if(!finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'ads was not found.'
            })
        }
        try {
            const updateAds = await Ads.update(
            {
                priority: +1,
            },{
                where: {
                    position: req.body.position,
                    priority: {[Op.lt]: req.body.priority}
                }
            })
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
                .resize(500, 500)
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
                finding.img_path = image
            }
            finding.position = req.body.position
            finding.display = req.body.display
            finding.priority = req.body.priority
            finding.save()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'ads was updated.'
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
}