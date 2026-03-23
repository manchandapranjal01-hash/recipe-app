import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Request a new ingredient
router.post('/request', verifyToken, async (req, res) => {
    const { name, category, unit } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Ingredients (name, category, unit, is_approved, requested_by) VALUES (?, ?, ?, FALSE, ?)',
            [name, category, unit, req.user.id]
        );
        res.status(201).json({ id: result.insertId, message: "Ingredient requested successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's requested ingredients
router.get('/my-requests', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Ingredients WHERE requested_by = ? ORDER BY id DESC', [req.user.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
