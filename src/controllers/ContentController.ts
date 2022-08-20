import { Store } from './../models/store';
import { Website } from './../models/website'
import moment from 'moment'
import { validationResult } from 'express-validator'
import path from 'path'
import fs from 'fs'

export class ContentController {
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
    /** for upload video ...unsuccess... */
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
                // res.send({ status: "success" })
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
}