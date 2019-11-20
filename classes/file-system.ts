import { FileUpload } from './../interfaces/file.upload';
import path from 'path';
import fs, { existsSync } from 'fs';
import uniqid from "uniqid";

export default class FileSystem {

    constructor() { };

    saveTempImage(file: FileUpload, userId: string) {

        return new Promise((resolve, reject) => {

            // create folder
            const path = this.createUserFolder(userId);

            // filename
            const fileName = this.generateFileName(file.name);

            // Move file to uploads
            file.mv(`${path}/${fileName}`, (err: any) => {
                if (err) {
                    // cannot move
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private generateFileName(filename: string) {
        // 6.copy.jpg
        //get extension
        const filenameArr = filename.split('.');
        const extension = filenameArr[filenameArr.length - 1];

        // unique id
        const uniqueId = uniqid();

        return `${uniqueId}.${extension}`

    }

    private createUserFolder(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';

        const exist = fs.existsSync(pathUser);
        if (!exist) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;

    }

    imagesTempToPost(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if (!fs.existsSync(pathTemp)) {
            return [];
        }

        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagesTemp = this.getTempImages(userId);

        imagesTemp.forEach(image => {
            fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`)
        });

        return imagesTemp;

    }

    private getTempImages(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        console.log(fs.readdirSync(pathTemp));
        return fs.readdirSync(pathTemp) || [];
    }

    getImageUrl(userId: string, img: string) {

        const imgPath = path.resolve(__dirname, '../uploads', userId, 'posts', img);

        const exist = fs.existsSync(imgPath);
        if (!exist) {
            return path.resolve(__dirname, '../assets/400x250.jpg');
        }

        return imgPath;
    }
}