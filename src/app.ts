import { storeRouter } from './routes/storeRouter';
import express, { Application } from 'express'
import { socketPort, serverPort } from './util/config'
import path from 'path'
import { SIO } from './util/Sockets'
import { memberRouter } from './routes/memberRouter' 

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
app.use(storeRouter)

/* Socket Start */
// const server = app.listen(socketPort)
// const io = SIO.init(server)

app.listen(serverPort)
