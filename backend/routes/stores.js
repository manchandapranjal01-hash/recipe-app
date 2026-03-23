import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all stores (public)
router.get('/', async (req, res) => {
    try {
        const [stores] = await pool.query('SELECT * FROM GroceryStores');
        res.json(stores);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Search via proximity or city
router.get('/search', async (req, res) => {
    const { city } = req.query;
    try {
        let query = 'SELECT * FROM GroceryStores';
        const params = [];
        if (city) {
            query += ' WHERE city LIKE ?';
            params.push(`%${city}%`);
        }
        const [stores] = await pool.query(query, params);
        res.json(stores);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get store inventory with prices
router.get('/:id/inventory', async (req, res) => {
    try {
        const [items] = await pool.query(`
            SELECT si.*, i.name as ingredient_name, i.category, i.unit
            FROM StoreInventory si
            JOIN Ingredients i ON si.ingredient_id = i.id
            WHERE si.store_id = ?
            ORDER BY i.name
        `, [req.params.id]);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Price Comparison Engine
router.post('/compare-prices', async (req, res) => {
    const { ingredientIds } = req.body;
    try {
        if (!ingredientIds || ingredientIds.length === 0) return res.json([]);
        const placeholders = ingredientIds.map(() => '?').join(',');

        const [results] = await pool.query(`
        SELECT s.id, s.name, s.city, s.lat, s.lng, s.address, s.type,
               SUM(si.price) as total_price, 
               COUNT(si.ingredient_id) as items_found,
               GROUP_CONCAT(CONCAT(i.name, ':', si.price) SEPARATOR '|') as price_details
        FROM GroceryStores s
        JOIN StoreInventory si ON s.id = si.store_id
        JOIN Ingredients i ON si.ingredient_id = i.id
        WHERE si.ingredient_id IN (${placeholders}) AND si.in_stock = true
        GROUP BY s.id
        ORDER BY total_price ASC
     `, ingredientIds);

        res.json(results);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add inventory to store (admin)
router.post('/:id/inventory', verifyToken, async (req, res) => {
    const { ingredient_id, price, in_stock } = req.body;
    try {
        await pool.query(
            `INSERT INTO StoreInventory (store_id, ingredient_id, price, in_stock) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE price = VALUES(price), in_stock = VALUES(in_stock)`,
            [req.params.id, ingredient_id, price, in_stock !== false]
        );
        res.status(201).json({ message: 'Inventory updated' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
