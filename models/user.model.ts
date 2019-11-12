import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

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

userSchema.method('matchPassword', function( password: string = '' ): boolean {

    if ( bcrypt.compareSync( password, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface Iuser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;
    matchPassword(password: string): boolean
}

export const User = model<Iuser>('User', userSchema);