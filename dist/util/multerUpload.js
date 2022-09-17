"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const moment_1 = __importDefault(require("moment"));
const uploadImage = () => {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, callback) {
            var public_path = path_1.default.join(__dirname, '../../dist/public/');
            var newfolder = public_path + `uploads/${(0, moment_1.default)().format('YYYY')}/${(0, moment_1.default)().format('MM')}/`;
            if (!fs_1.default.existsSync(`${newfolder}`)) {
                fs_1.default.mkdirSync(newfolder, { recursive: true });
            }
            callback(null, newfolder);
        },
        filename: function (req, file, callback) {
            var ext = path_1.default.extname(file.originalname);
            let basename = "image-" + (0, moment_1.default)().format('YYYYMMDDHHmmss-') + Math.floor(Math.random() * 10000) + '-' + path_1.default.basename(file.originalname, ext);
            callback(null, basename + ext);
        }
    });
    return (0, multer_1.default)({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path_1.default.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.mov' && ext !== '.avi') {
                return callback(new Error("Type images or video aren't allowed"));
            }
            callback(null, true);
        },
        limits: {
            fileSize: (1048576 * 100) // 100MB
        }
    });
};
exports.uploadImage = uploadImage;
