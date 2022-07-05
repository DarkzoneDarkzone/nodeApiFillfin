import fs from 'fs'
import path from 'path'
import multer from 'multer';
import moment from 'moment'
import 'moment/locale/th';

export const uploadImage = () => {
  const storage = multer.diskStorage({
    destination: function (req: any, file:any , callback:any ) {
      var public_path = path.join(__dirname, '../../dist/public/')
      var newfolder = public_path+`uploads/${moment().format('YYYY')}/${moment().format('MM')}/`;
      if(!fs.existsSync(`${newfolder}`)){
        fs.mkdirSync(newfolder, { recursive: true }); 
      } 
      callback(null, newfolder)
    },
    filename: function (req: any, file:any, callback:any ) {
      var ext = path.extname(file.originalname);
      let basename = "image-"+moment().format('YYYYMMDDHHmmss-')+Math.floor(Math.random()*10000)+'-'+path.basename(file.originalname, ext);
      callback(null, basename+ext)
    }
  })

  return multer({
    storage: storage,
    fileFilter: function (req: any, file:any , callback:any ) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg') {
          return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits:{
      fileSize: (1048576 * 10)
    }
  })
}
  