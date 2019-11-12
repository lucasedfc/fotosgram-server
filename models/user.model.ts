import { Schema, model, Document } from 'mongoose';

const userSchema = new Schema({
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

interface Iuser extends Document {
    name: string,
    email: string,
    password: string,
    avatar: string
}

export const User = model<Iuser>('User', userSchema);