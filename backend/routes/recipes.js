import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all recipes (public cookbook)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Recipes WHERE is_approved = TRUE');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all ingredients (public)
router.get('/ingredients', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Ingredients ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's own recipes
router.get('/my-recipes', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Recipes WHERE author_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's bookmarked recipes
router.get('/my-bookmarks', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.* FROM Recipes r
            JOIN SavedRecipes sr ON r.id = sr.recipe_id
            WHERE sr.user_id = ?
            ORDER BY sr.created_at DESC
        `, [req.user.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bookmark a recipe
router.post('/:id/bookmark', verifyToken, async (req, res) => {
    try {
        await pool.query('INSERT IGNORE INTO SavedRecipes (user_id, recipe_id) VALUES (?, ?)', [req.user.id, req.params.id]);
        res.json({ message: 'Recipe bookmarked' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove bookmark
router.delete('/:id/bookmark', verifyToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM SavedRecipes WHERE user_id = ? AND recipe_id = ?', [req.user.id, req.params.id]);
        res.json({ message: 'Bookmark removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single recipe with mapped ingredients
router.get('/:id', async (req, res) => {
    try {
        const [recipes] = await pool.query(`
            SELECT r.*, u.name as author_name 
            FROM Recipes r 
            LEFT JOIN Users u ON r.author_id = u.id 
            WHERE r.id = ? AND r.is_approved = TRUE
        `, [req.params.id]);

        if (recipes.length === 0) return res.status(404).json({ message: 'Recipe not found' });

        const [ingredients] = await pool.query(`
            SELECT i.id, i.name, i.category, i.unit, ri.quantity
            FROM RecipeIngredients ri
            JOIN Ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?
        `, [req.params.id]);

        res.json({ ...recipes[0], ingredients });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Advanced Recommendation Engine
router.post('/recommendations', async (req, res) => {
    const { selectedIngredients } = req.body;
    try {
        if (!selectedIngredients || selectedIngredients.length === 0) {
            const [all] = await pool.query('SELECT * FROM Recipes ORDER BY created_at DESC LIMIT 10');
            return res.json(all);
        }

        const placeholders = selectedIngredients.map(() => '?').join(',');
        const [recipes] = await pool.query(`
        SELECT r.*, COUNT(ri.ingredient_id) as match_count
        FROM Recipes r
        JOIN RecipeIngredients ri ON r.id = ri.recipe_id
        WHERE ri.ingredient_id IN (${placeholders})
        GROUP BY r.id
        ORDER BY match_count DESC
     `, selectedIngredients);

        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Recipe Creation (UGC)
router.post('/', verifyToken, async (req, res) => {
    const { title, category, description, prep_time, difficulty, image_url, video_link, cultural_origin, servings, instructions, nutrition_info } = req.body;
    try {
        // If admin is creating, aut-approve. Otherwise needs approval.
        const isApproved = req.user.role === 'admin';
        const [result] = await pool.query(
            `INSERT INTO Recipes (title, category, description, prep_time, difficulty, image_url, video_link, cultural_origin, servings, instructions, nutrition_info, author_id, is_approved) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, category, description, prep_time, difficulty, image_url, video_link, cultural_origin, servings, instructions, JSON.stringify(nutrition_info), req.user.id, isApproved]
        );
        res.status(201).json({ id: result.insertId, message: "Recipe created" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get single recipe with ingredients
router.get('/:id', async (req, res) => {
    try {
        const [recipe] = await pool.query('SELECT * FROM Recipes WHERE id = ?', [req.params.id]);
        if (recipe.length === 0) return res.status(404).json({ message: 'Recipe not found' });

        const [ingredients] = await pool.query(`
      SELECT i.id, i.name, i.unit, ri.quantity 
      FROM RecipeIngredients ri 
      JOIN Ingredients i ON ri.ingredient_id = i.id 
      WHERE ri.recipe_id = ?
    `, [req.params.id]);

        res.json({ ...recipe[0], ingredients });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
// Get single recipe with ingredients
router.get('/:id', async (req, res) => {
    try {
        const [recipe] = await pool.query('SELECT * FROM Recipes WHERE id = ?', [req.params.id]);
        if (recipe.length === 0) return res.status(404).json({ message: 'Recipe not found' });

        const [ingredients] = await pool.query(`
      SELECT i.id, i.name, i.unit, ri.quantity 
      FROM RecipeIngredients ri 
      JOIN Ingredients i ON ri.ingredient_id = i.id 
      WHERE ri.recipe_id = ?
    `, [req.params.id]);

        res.json({ ...recipe[0], ingredients });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
