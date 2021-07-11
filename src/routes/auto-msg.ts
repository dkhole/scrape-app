import express from 'express';
import { initAutoMsg } from '../services/auto-msg';
export const router = express.Router();

// middleware that is specific to this router
router.post('/auto-msg/start', async (req, res) => {
    const data = initAutoMsg();
    res.json(JSON.stringify(data));
});