import express from 'express';
import { load } from './loaders/load';
import { routes } from './routes/routes';
import dotenv from 'dotenv';
dotenv.config();

const app: express.Application = express();

load(app);
routes(app);

const processPort: string = process.env.PORT ?? '3000';
const port: number = parseInt(processPort);

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})