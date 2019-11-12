"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    }
});
exports.User = mongoose_1.model('User', userSchema);
