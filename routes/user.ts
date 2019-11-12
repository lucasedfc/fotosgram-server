import { User } from './../models/user.model';
import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verifyToken } from '../middlewares/authentication';


const userRoutes = Router();
//Login
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body;
    User.findOne({email: body.email}, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'User or Password invalid'
            });
        }

        if( userDB.matchPassword( body.password)) {

            const userToken = Token.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: userToken
            });
        } else {
            res.json({
                ok: false,
                message: 'User or Password invalid ****'
            });
        }
    });

});

// Create user
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    User.create(user).then(userDB => {

        const userToken = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: userToken
        });

    }).catch(err => {
        res.json({
            ok: false,
            err
        })
    });

});


// Update User
userRoutes.post('/update', verifyToken,  (req: any, res: Response) => {

    res.json({
        ok: true,
        user: req.user

    });
});

export default userRoutes;