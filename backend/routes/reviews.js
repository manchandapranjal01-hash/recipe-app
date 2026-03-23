import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Give Review
router.post('/', verifyToken, async (req, res) => {
    const { recipe_id, rating, comment } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Reviews (recipe_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [recipe_id, req.user.id, rating, comment]
        );
        res.status(201).json({ message: 'Review successfully submitted!', review_id: result.insertId });
    } catch (e) {
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// Get Reviews for Recipe (with avg rating)
router.get('/recipe/:id', async (req, res) => {
    try {
        const [reviews] = await pool.query(`
      SELECT r.*, u.name, u.profile_image 
      FROM Reviews r 
      JOIN Users u ON r.user_id = u.id 
      WHERE r.recipe_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.id]);

        // Get average rating
        const [avg] = await pool.query(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM Reviews WHERE recipe_id = ?',
            [req.params.id]
        );

        // Get replies for each review
        for (let review of reviews) {
            const [replies] = await pool.query(`
                SELECT rr.*, u.name, u.profile_image 
                FROM ReviewReplies rr 
                JOIN Users u ON rr.user_id = u.id 
                WHERE rr.review_id = ?
                ORDER BY rr.created_at ASC
            `, [review.id]);
            review.replies = replies;
        }

        res.json({
            reviews,
            avg_rating: avg[0].avg_rating ? parseFloat(avg[0].avg_rating).toFixed(1) : null,
            total_reviews: avg[0].total_reviews
        });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Post Reply to a Review
router.post('/:id/replies', verifyToken, async (req, res) => {
    const { comment } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO ReviewReplies (review_id, user_id, comment) VALUES (?, ?, ?)',
            [req.params.id, req.user.id, comment]
        );
        res.status(201).json({ message: 'Reply posted!', reply_id: result.insertId });
    } catch (e) {
        res.status(500).json({ error: 'Failed to post reply' });
    }
});

export default router;
