import express from 'express';
import pool from '../config/db.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(verifyToken, requireAdmin);

// --- Users ---
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, profile_image, created_at FROM Users');
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});
router.delete('/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// --- Ingredients ---
// Get all ingredients
router.get('/ingredients', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Ingredients ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get pending ingredients
router.get('/ingredients/pending', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT i.*, u.name as requester_name 
            FROM Ingredients i 
            LEFT JOIN Users u ON i.requested_by = u.id 
            WHERE i.is_approved = FALSE 
            ORDER BY i.id DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve ingredient
router.put('/ingredients/:id/approve', async (req, res) => {
    try {
        await pool.query('UPDATE Ingredients SET is_approved = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Ingredient approved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create ingredient (from admin directly)
router.post('/ingredients', async (req, res) => {
    const { name, category, unit } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Ingredients (name, category, unit) VALUES (?, ?, ?)', [name, category, unit]);
        res.status(201).json({ id: result.insertId, name, category, unit });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
});
router.put('/ingredients/:id', async (req, res) => {
    const { name, category, unit } = req.body;
    try {
        await pool.query('UPDATE Ingredients SET name=?, category=?, unit=? WHERE id=?', [name, category, unit, req.params.id]);
        res.json({ message: 'Updated successfully' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
});
router.delete('/ingredients/:id', async (req, res) => {
    try { await pool.query('DELETE FROM Ingredients WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' }); }
    catch (e) { res.status(500).json({ message: 'Error' }); }
});

// --- Stores ---
router.get('/stores', async (req, res) => {
    try {
        const [stores] = await pool.query('SELECT * FROM GroceryStores');
        res.json(stores);
    } catch (e) { res.status(500).json({ message: 'Error' }); }
});
router.post('/stores', async (req, res) => {
    const { name, type, mobile, address, city, lat, lng } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO GroceryStores (name, type, mobile, address, city, lat, lng) VALUES (?,?,?,?,?,?,?)', [name, type, mobile, address, city, lat, lng]);
        res.status(201).json({ id: result.insertId, name, type, city });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
});
router.put('/stores/:id', async (req, res) => {
    const { name, type, mobile, address, city, lat, lng } = req.body;
    try {
        await pool.query('UPDATE GroceryStores SET name=?, type=?, mobile=?, address=?, city=?, lat=?, lng=? WHERE id=?', [name, type, mobile, address, city, lat, lng, req.params.id]);
        res.json({ message: 'Updated' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
});
router.delete('/stores/:id', async (req, res) => {
    try { await pool.query('DELETE FROM GroceryStores WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' }); }
    catch (e) { res.status(500).json({ message: 'Error' }); }
});

// --- Profile ---
import bcrypt from 'bcryptjs';
router.put('/profile', async (req, res) => {
    const { name, email, profile_image, password } = req.body;
    try {
        if (password) {
            const hash = await bcrypt.hash(password, 10);
            await pool.query('UPDATE Users SET name=?, email=?, profile_image=?, password=? WHERE id=?', [name, email, profile_image, hash, req.user.id]);
        } else {
            await pool.query('UPDATE Users SET name=?, email=?, profile_image=? WHERE id=?', [name, email, profile_image, req.user.id]);
        }
        res.json({ message: 'Profile updated' });
    } catch (e) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// --- Recipes ---
router.get('/recipes', async (req, res) => {
    try {
        const [recipes] = await pool.query(`
            SELECT r.*, u.name as author_name 
            FROM Recipes r 
            LEFT JOIN Users u ON r.author_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(recipes);
    } catch (e) { res.status(500).json({ message: 'Error' }); }
});
router.put('/recipes/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE Recipes SET status = ?, is_approved = ? WHERE id = ?', [status, status === 'approved' ? 1 : 0, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (e) { res.status(500).json({ message: 'Error' }); }
});
router.delete('/recipes/:id', async (req, res) => {
    try { await pool.query('DELETE FROM Recipes WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' }); }
    catch (e) { res.status(500).json({ message: 'Error' }); }
});

export default router;
