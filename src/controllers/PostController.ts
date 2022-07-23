import { sequelize } from './../util/database';
import { PostImage } from './../models/postImage';
import { Store } from './../models/store';
import { Post } from './../models/post';
import { ViewService } from './../services/View.service';
import 'moment/locale/th'
import moment from 'moment'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import bcrypt from 'bcrypt'

export class PostController extends ViewService{
    OnCreatePost = async(req: any, res: any) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: false,
                message: 'error',
                errorMessage: errors.array()
            })
        }
        const storeToken = req.authStore
        if(!storeToken){
            return res.status(401).json({
                status: false,
                message: 'error',
                description: 'not authenticated.'
            })
        }
        const store = await Store.findOne({where:{store_code: storeToken.store_code}})
        const all_post = await Post.findAll({where:{store_id: store.id, status: 'active'}})
        if(all_post.length > 10){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'your post has limited.'
            })
        }
        const t = await sequelize.transaction()
        try {
            const str_post_code = `${store.code}${moment().format('YYYYMMDDHHmmss')}`
            let post_code = await bcrypt.hash(str_post_code, 10)
            const post = await Post.create({
                post_code: post_code.replace(/\W/g,""),
                store_id: store.id,
                display: "yes",
                caption: req.body.caption,
                status: "active"
            }, { transaction : t})
            let postImage: any[] = []
            if(req.files){
                let count = 0
                for (const file of req.files) {
                    let upload = "/uploads"+file.destination.split("uploads").pop()
                    let dest = file.destination
                    var ext = path.extname(file.originalname);
                    let originalname = path.basename(file.originalname, ext)
                    for(let i = 1; fs.existsSync(dest+originalname+ext); i++){
                        originalname = originalname.split('(')[0]
                        originalname += '('+i+')'
                    }
                    const image = await sharp(file.path)
                    .resize(200, 200)
                    .withMetadata()
                    .jpeg({ quality: 95})
                    .toFile( path.resolve(file.destination, originalname+ext))
                    .then((data: any) => {
                        fs.unlink( file.path, (err) => {
                            if(err){
                                console.log(err)
                            }
                        })
                        return upload+originalname+ext
                    })
                    const arr = {
                        post_id: post.id,
                        path_image: image,
                        priority: count++
                    }
                    postImage.push(arr)
                }
            }
            const post_image = await PostImage.bulkCreate(postImage, { transaction : t})
            await t.commit()
            return res.status(201).json({
                status: true,
                message: 'ok',
                description: 'data was created.'
            })
        } catch(error){
            console.log(error)
            await t.rollback()
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnDeletePost = async(req: any, res: any) => {
        const post = await Post.findOne({where:{post_code: req.params.code, status: 'active'}})
        if(!post){
            return res.status(404).json({
                status: false,
                message: 'error',
                description: 'post was not found.'
            })
        }
        try {
            post.destroy()
            const post_image = PostImage.destroy({where:{post_id: post.id}})
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'post was deleted.'
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