import express from 'express';
import { load } from './loaders/load';
import { routes } from './routes/routes';

const app: express.Application = express();

load(app);
routes(app);

let port = parseInt(process.env.PORT);
if (port == null ) {  port = 8000; }

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})