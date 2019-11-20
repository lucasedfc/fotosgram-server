import { FileUpload } from './../interfaces/file.upload';
import { Post } from './../models/post.model';
import { verifyToken } from './../middlewares/authentication';
import { Router, Response, Request } from "express";
import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();
// Get paginated posts
postRoutes.get('/', async (req: any, res: Response) => {

    let page = Number(req.query.page) || 1;
    let skip = page -1;
    skip = skip * 10;

    const posts = await Post.find()
    .sort({ _id: -1})
    .skip(skip)
    .limit(10)
    .populate('user', '-password')
    .exec();

    
    res.json({
        ok: true,
        page,
        posts
    })

});


// Create post
postRoutes.post('/', [verifyToken], (req: any, res: Response) => {

    const body = req.body;

    body.user = req.user._id;

    const images = fileSystem.imagesTempToPost( req.user._id);
    body.imgs = images;

    Post.create(body).then( async postDB => {

       await postDB.populate('user').execPopulate();
        
        res.json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.json(err);
    });

});

// Upload file service

postRoutes.post('/upload', [verifyToken], async (req: any, res: Response) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No files was uploaded'
        });
    }

    const file: FileUpload = req.files.image;

    if( !file) {
        return res.status(400).json({
            ok: false,
            message: 'No files was uploaded!!'
        });
    }

    if( !file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid format'
        });
    }

    await fileSystem.saveTempImage( file, req.user._id)

    res.json({
        ok: true,
        file: file.mimetype
    })
});

postRoutes.get('/image/:userId/:img', (req: any, res: Response) => {

    const userId = req.params.userId;
    const img = req.params.img;

    const image = fileSystem.getImageUrl( userId, img);


    res.sendFile(image);
});


export default postRoutes;