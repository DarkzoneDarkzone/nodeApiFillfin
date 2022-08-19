import { Settings } from './models/settings'
import express, { Application } from 'express'
import { socketPort, serverPort } from './util/config'
import * as SyncModels from './models/SyncModels'
import path from 'path'
import { SIO } from './util/Sockets'
import { videoRouter } from './routes/videoRouter'
import { websiteRouter } from './routes/websiteRouter'
import { adminRouter } from './routes/adminRouter'
import { storeRouter } from './routes/storeRouter'
import { memberRouter } from './routes/memberRouter'
import cron = require('node-cron')
import moment from 'moment'
import fs from 'fs'

/* เปิด SyncModels เมื่อเปลี่ยนแปลง Database Structure */
// SyncModels.OnInit()

const app: Application = express()
app.use(express.static(path.join(__dirname, './../dist/public/')))

/*  -------- converting json -------- */  
app.use(express.urlencoded({extended: true}))
app.use(express.json())

/* Middleware */
app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*' )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

/** router */
app.use(memberRouter)
app.use(adminRouter)
app.use(storeRouter)
app.use(websiteRouter)
app.use(videoRouter)

/* Socket Start */
const server = app.listen(socketPort)
const io = SIO.init(server)

cron.schedule('0 0 * * * *', async() => {
    const finding = await Settings.findOne({where:{setting_name: 'cron_job_month'}})
    var public_path = path.join(__dirname, './../dist/public/')
    const folderPath = `/slip/${moment().format('YYYY')}/${moment().subtract(parseInt(finding.setting_value), 'months').format('MM')}`
    if(fs.existsSync(public_path+folderPath)){
        fs.rmSync(public_path+folderPath, { recursive: true });
    }
});

app.listen(serverPort)