import { Post } from './../models/post.model';
import { verifyToken } from './../middlewares/authentication';
import { Router, Response } from "express";

const postRoutes = Router();

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



export default postRoutes;