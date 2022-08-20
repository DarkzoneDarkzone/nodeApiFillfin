import { ChatTemp } from './models/chat_temp';
import { sequelize } from './util/database';
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
app.use((req: any, res: any, next: any) => {
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

/**------------- 0 0 * * * * -------------
 * run cron-job every 1 Hour
*/
cron.schedule('0 0 * * * *', async() => {
    /** for remove folder slip old than 'cron_job_month' value */
    const cron_job = await Settings.findOne({where:{setting_name: 'cron_job_month'}})
    var public_path = path.join(__dirname, './../dist/public/')
    const folderPath = `/slip/${moment().format('YYYY')}/${moment().subtract(parseInt(cron_job.setting_value), 'months').format('MM')}`
    if(fs.existsSync(public_path+folderPath)){
        fs.rmSync(public_path+folderPath, { recursive: true })
    }
    /** for delete message old than 'time_delete_message' value */
    const delete_message = await Settings.findOne({where:{setting_name: 'time_delete_message'}})
    const dateToDelete = moment().subtract(parseInt(delete_message.setting_value), 'days').format('YYYY-MM-DD')
    await ChatTemp.destroy({
        where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', dateToDelete)
    })
})

app.listen(serverPort)