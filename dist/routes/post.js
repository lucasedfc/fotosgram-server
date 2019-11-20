"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = require("./../models/post.model");
const authentication_1 = require("./../middlewares/authentication");
const express_1 = require("express");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Get paginated posts
postRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.json({
        ok: true,
        page,
        posts
    });
}));
// Create post
postRoutes.post('/', [authentication_1.verifyToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    const images = fileSystem.imagesTempToPost(req.user._id);
    body.imgs = images;
    post_model_1.Post.create(body).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        yield postDB.populate('user').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Upload file service
postRoutes.post('/upload', [authentication_1.verifyToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No files was uploaded'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            message: 'No files was uploaded!!'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid format'
        });
    }
    yield fileSystem.saveTempImage(file, req.user._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
postRoutes.get('/image/:userId/:img', (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const image = fileSystem.getImageUrl(userId, img);
    res.sendFile(image);
});
exports.default = postRoutes;
