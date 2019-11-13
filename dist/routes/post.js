"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = require("./../models/post.model");
const authentication_1 = require("./../middlewares/authentication");
const express_1 = require("express");
const postRoutes = express_1.Router();
postRoutes.post('/', [authentication_1.verifyToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
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
exports.default = postRoutes;
