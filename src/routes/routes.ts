import express from 'express';
import path from 'path';
import { router as scrape } from './scrape';

export const routes = (app: express.Application) => {
    app.get('/', (req, res) => {
        res.send('Welcome to port 3000');
    });
    
    app.use('/api', scrape);

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });


    return app;
}