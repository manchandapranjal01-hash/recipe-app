import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import recipeRoutes from './routes/recipes.js';
import groceryListRoutes from './routes/groceryLists.js';
import reviewRoutes from './routes/reviews.js';
import storeRoutes from './routes/stores.js';
import uploadRoutes from './routes/upload.js';
import ingredientsRoutes from './routes/ingredients.js';
import pricesRoutes from './routes/prices.js';
import nutritionRoutes from './routes/nutrition.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/grocery-lists', groceryListRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/recipes/nutrition', nutritionRoutes);

// Mock sync endpoint
app.post('/api/sync', (req, res) => {
    console.log("Received offline sync data:", req.body);
    res.json({ success: true, message: "State synced successfully." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
