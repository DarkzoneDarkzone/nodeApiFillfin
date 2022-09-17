import { Ads } from './../models/ads'
import moment from 'moment'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import { ViewService } from '../services/View.service'

export class AdsController extends ViewService {
    OnGetAds = async(req: any, res: any) => {
        const finding:any = await this.queryAdsShow(req.params.page)
        if(!finding){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'ads was not found.'
            })
        }
        const filtered =  {
            ads_id: finding.id,
            position: finding.position,
            title: finding.title,
            content: finding.content,
            h1: finding.h1,
            h2: finding.h2,
            image: finding.imgPath,
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            descriptin: 'get ads success.',
            ads: filtered
        })
    }
    OnChangeDisplayAds = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await Ads.findOne({where:{position: req.body.position}})
            if(!finding){
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    description: 'position was not found.'
                })
            }
            finding.display = req.body.display
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
    OnUpdateAds = async(req: any, res: any) => {
        const ads = await Ads.findOne({where:{id: req.body.id}})
        if(!ads){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'ads was not found.'
            })
        }
        try {
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
                ads.img_path = image
            }
            ads.position = req.body.position
            ads.save()
            return res.status(201).json({
                sttaus: true,
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
    OnCreateAds = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await Ads.findAll({where:{position: req.body.position}})
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
                await Ads.create({
                    position: req.body.position,
                    isMen: '',
                    title: '',
                    content: '',
                    h1: '',
                    h2: '',
                    display: 1,
                    priority: finding.length,
                    img_path: image
                })
            } else {
                return res.status(400).json({
                    sttaus: false,
                    message: 'error',
                    description: "ads wasn't create."
                })
            }
            return res.status(201).json({
                sttaus: true,
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
    OnDeleteAds = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        try {
            const finding = await Ads.findOne({where:{id: req.params.id}})
            finding.destroy()
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'ads was deleted.'
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