import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Grocery Lists route working' });
});

export default router;
