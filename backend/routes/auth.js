import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'user']
        );

        const token = jwt.sign({ id: result.insertId, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: result.insertId, name, email, role: 'user' } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get Current User Profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, profile_image, dietary_preferences FROM Users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(users[0]);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
