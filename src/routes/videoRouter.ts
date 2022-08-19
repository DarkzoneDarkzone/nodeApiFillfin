import { StoreController } from './../controllers/StoreController';
import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import fs from 'fs'
const upload = multerUpload.uploadImage()
const router = Router()
import path from 'path'

router.get('/streaming/video/:year/:month/:path', function(req: any, res: any){
    const range = req.headers.range
    if(!range){
        return res.status(500)
    }
    const videoPath = (path.join(__dirname, `../../dist/public/video/${req.params.year}/${req.params.month}/`))+req.params.path
    const videoSize = fs.statSync(videoPath).size
    const CHUNK_SIZE = 2*10**6 //2MB video file part will download every 2MB
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize-1)
    const contentLength = end - start +1
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    }
    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
})

export const videoRouter = router