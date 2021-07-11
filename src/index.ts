import express from 'express';
import { load } from './loaders/load';
import { routes } from './routes/routes';

const app: express.Application = express();

load(app);
routes(app);

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})