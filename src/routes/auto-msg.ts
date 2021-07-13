import express from 'express';
import { launch } from '../services/auto-msg';
import { verifyAuth } from '../services/auth/verify';
export const router = express.Router();

// middleware that is specific to this router
router.post('/auto-msg/start', verifyAuth, async (req, res) => {
    const data = await launch(req.body);
    res.json(JSON.stringify(data));
});