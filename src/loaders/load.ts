import express from 'express';
import path from 'path';
import cors from 'cors';

export const load = async( app: express.Application ) => {
    app.use(express.json());
    app.use(cors());
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../client/build')));
    return app
}