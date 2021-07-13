import express from 'express';
import jwt from 'jsonwebtoken';
export const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

// middleware that is specific to this router
router.post('/auth', async(req, res) => {
    const pass = process.env.PASS;
    const secret: string = process.env.SECRET ?? 'nosecret';
    //check password
    //if successful send token otherwise send could not log in
    if(req.body.password === pass) {
        const payload = { };
        const token = jwt.sign(payload, secret, {
          expiresIn: '2h',
        });
        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true})
          .sendStatus(200);
    } else {
        res.status(401).json({
          error: 'Incorrect email or password'
        });
    }
});