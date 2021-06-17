import express from 'express';
import path from 'path';
import cors from 'cors';
import { startSmall, startToday, startFull } from './helpers';

const app = express();

app.use(cors());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
    res.send('Welcome to port 3000');
});

app.get('/start-small', async (req, res) => {
    const data = await startSmall();
    res.json(JSON.stringify(data));
});

app.get('/start-full', async (req, res) => {
    const data = await startFull();
    res.json(JSON.stringify(data));
});

app.get('/start-today', async (req, res) => {
    const data = await startToday();
    res.json(JSON.stringify(data));
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})