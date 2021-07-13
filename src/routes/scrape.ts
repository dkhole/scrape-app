import express from 'express';
import { startFull, startSmall, startToday } from '../services/scrape/start';
import { verifyAuth } from '../services/auth/verify';
export const router = express.Router();

// middleware that is specific to this router
router.post('/scrape/start-small', verifyAuth, async (req, res) => {
    const data = await startSmall(req.body.url);
    res.json(JSON.stringify(data));
});

router.post('/scrape/start-today', verifyAuth, async (req, res) => {
    const data = await startToday(req.body.url);
    res.json(JSON.stringify(data));
});

router.post('/scrape/start-full', verifyAuth, async (req, res) => {
    const data = await startFull();
    res.json(JSON.stringify(data));
});