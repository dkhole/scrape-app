import express from 'express';
import path from 'path';
import { router as scrape } from './scrape';
import { router as autoMsg } from './auto-msg';
import { router as auth } from './auth';
import { verifyAuth } from '../services/auth/verify';

export const routes = (app: express.Application) => {

    app.use(express.static(path.join(__dirname, '..', '..', 'client/build')));
    
    app.use('/api', auth, scrape, autoMsg);

    app.get('/check-auth', verifyAuth, function(req, res) {
        res.sendStatus(200);
    });
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'client/build/index.html'));
    });


    return app;
}