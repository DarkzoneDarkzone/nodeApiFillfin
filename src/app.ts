import { videoRouter } from './routes/videoRouter';
import { websiteRouter } from './routes/websiteRouter';
import { adminRouter } from './routes/adminRouter';
import { storeRouter } from './routes/storeRouter';
import express, { Application } from 'express'
import { socketPort, serverPort } from './util/config'
import * as SyncModels from './models/SyncModels'
import path from 'path'
import { SIO } from './util/Sockets'
import { memberRouter } from './routes/memberRouter' 

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

app.listen(serverPort)
