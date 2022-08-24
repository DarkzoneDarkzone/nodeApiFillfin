import { Banner } from './../models/banner';
import { Store } from './../models/store';
import { Website } from './../models/website'
import moment from 'moment'
import { validationResult } from 'express-validator'
import path from 'path'
import fs from 'fs'
const sharp = require('sharp')
import { ViewService } from '../services/View.service';
import { Ads } from '../models/ads';

export class ContentController extends ViewService {
    OnGetContent = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const type = req.params.type
        const finding: any = await Website.findOne({where:{type: type, display: 'yes'}})
        let response = {}
        if(finding){
            response = {
                title: finding.title,
                content: finding.content,
                h1: finding.h1,
                h2: finding.h2,
                videoLink: finding.video_link,
                imageLink: finding.image_link
            }
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            content: response
        })
    }
    OnGetContentAll = async(req: any, res: any) => {
        const content = await Website.findAll()
        const banner = await Banner.findAll()
        const ads = await Ads.findAll()
        const positionAds = await this.queryPositionAll()
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get content success.',
            content: content,
            banner: banner,
            ads: ads,
            adsPosition: positionAds
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
    OnUploadVideoStore = async(req: any, res: any) => {
        const store = await Store.findOne({where:{store_code: req.body.storeCode}})
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
                website.image_link = path_upload
            }
            website.type = req.body.type
            website.title = req.body.title
            website.content = req.body.content
            website.h1 = req.body.h1
            website.h2 = req.body.h2
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
    OnUpdateBanner = async(req: any, res: any) => {
        const banner = await Banner.findOne({where:{id: req.body.id}})
        if(!banner){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'banner was not found.'
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
                banner.img_path = image
            }
            banner.position = req.body.position
            banner.title = req.body.title
            banner.content = req.body.content
            // banner.h1 = req.body.h1
            // banner.h2 = req.body.h2
            banner.save()
            return res.status(201).json({
                sttaus: true,
                message: 'ok',
                description: 'banner was updated.'
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
                ads.img_path = image
                ads.save()
            } else {
                return res.status(400).json({
                    sttaus: false,
                    message: 'error',
                    description: "ads wasn't updated."
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
                await Ads.create({
                    position: req.body.position,
                    isMen: req.body.isMen,
                    title: '',
                    content: '',
                    h1: '',
                    h2: '',
                    display: 1,
                    priority: 5,
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
}