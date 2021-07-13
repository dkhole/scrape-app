import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyAuth = function(req: any, res: any, next: any) {
    const token = req.cookies.token;  
    const secret: string = process.env.SECRET ?? 'nosecret';
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function(err: any) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                next();
            }
        });
    }
};