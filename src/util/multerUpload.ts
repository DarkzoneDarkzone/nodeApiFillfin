import fs from 'fs'
import path from 'path'
import multer from 'multer'
import moment from 'moment'

export const uploadImage = () => {
  const storage = multer.diskStorage({
    destination: function (req: any, file:any , callback:any ){
      var public_path = path.join(__dirname, '../../dist/public/')
      var newfolder = public_path+`uploads/${moment().format('YYYY')}/${moment().format('MM')}/`
      if(!fs.existsSync(`${newfolder}`)){
        fs.mkdirSync(newfolder, { recursive: true })
      }
      callback(null, newfolder)
    },
    filename: function (req: any, file:any, callback:any ){
      var ext = path.extname(file.originalname)
      let basename = "image-"+moment().format('YYYYMMDDHHmmss-')+Math.floor(Math.random()*10000)+'-'+path.basename(file.originalname, ext)
      callback(null, basename+ext)
    }
  })
  return multer({
    storage: storage,
    fileFilter: function (req: any, file:any , callback:any ){
      var ext = path.extname(file.originalname)
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.mov' && ext !== '.avi') {
          return callback(new Error("Type images or video aren't allowed"))
        }
        callback(null, true)
    },
    limits:{
      fileSize: (1048576 * 100) // 100MB
    }
  })
}
  