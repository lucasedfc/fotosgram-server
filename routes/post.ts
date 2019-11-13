import { Post } from './../models/post.model';
import { verifyToken } from './../middlewares/authentication';
import { Router, Response } from "express";

const postRoutes = Router();


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