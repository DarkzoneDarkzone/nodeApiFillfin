import { Website } from './../models/website'
import { sequelize } from './../util/database'
import { Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

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
        const finding: any = await Website.findOne({where:{type: type}})
        if(!finding){
            return res.status(400).json({
                status: false,
                message: 'error',
                description: 'not found.'
            })
        }
        const response = {
            title: finding.title,
            content: finding.content,
            h1: finding.h1,
            h2: finding.h2,
            videoLink: finding.video_link,
            imageLink: finding.image_link
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get data success.',
            content: response
        })
    }
}
