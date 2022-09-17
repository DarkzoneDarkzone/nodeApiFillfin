"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = void 0;
const express_1 = require("express");
const multerUpload = __importStar(require("../util/multerUpload"));
const fs_1 = __importDefault(require("fs"));
const upload = multerUpload.uploadImage();
const router = (0, express_1.Router)();
const path_1 = __importDefault(require("path"));
router.get('/streaming/video/:year/:month/:path', function (req, res) {
    const range = req.headers.range;
    if (!range) {
        return res.status(500);
    }
    const videoPath = (path_1.default.join(__dirname, `../../dist/public/video/${req.params.year}/${req.params.month}/`)) + req.params.path;
    const videoSize = fs_1.default.statSync(videoPath).size;
    const CHUNK_SIZE = 2 * 10 ** 6; //2MB video file part will download every 2MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4'
    };
    res.writeHead(206, headers);
    const videoStream = fs_1.default.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});
exports.videoRouter = router;
