import jwt from 'jsonwebtoken';

export default class Token {
    private static seed: string = 'mySecretKey';
    private static expiration: string = '7d';

    constructor() {}

    static getJwtToken (payload: any): string {
        return jwt.sign({
            user: payload
        }, this.seed, {expiresIn: this.expiration });
    }

    static checkToken ( userToken: string) {

        return new Promise( (resolve, reject ) => {
            jwt.verify( userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                } else {
                    // valid token
                    resolve(decoded);
                }
            })
        });
        
    }
}