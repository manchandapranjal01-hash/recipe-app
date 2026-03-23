import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

async function initDB() {
  try {
    const dbName = process.env.DB_NAME || 'grocery_finder';
    await pool.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    await pool.query(`CREATE DATABASE \`${dbName}\``);
    await pool.query(`USE \`${dbName}\``);

    // Users
    await pool.query(`
      CREATE TABLE Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        profile_image VARCHAR(255),
        dietary_preferences JSON,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recipes
    await pool.query(`
      CREATE TABLE Recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        prep_time INT,
        difficulty ENUM('Easy', 'Medium', 'Hard'),
        image_url VARCHAR(255),
        video_link VARCHAR(255),
        cultural_origin VARCHAR(100),
        servings INT DEFAULT 2,
        instructions TEXT,
        nutrition_info JSON,
        author_id INT,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES Users(id) ON DELETE SET NULL
      )
    `);

    // Ingredients
    await pool.query(`
      CREATE TABLE Ingredients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(100),
        unit VARCHAR(50)
      )
    `);

    // RecipeIngredients
    await pool.query(`
      CREATE TABLE RecipeIngredients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipe_id INT,
        ingredient_id INT,
        quantity DECIMAL(10, 2),
        FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE CASCADE
      )
    `);

    // GroceryStores
    await pool.query(`
      CREATE TABLE GroceryStores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        mobile VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8)
      )
    `);

    // StoreInventory
    await pool.query(`
      CREATE TABLE StoreInventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        store_id INT,
        ingredient_id INT,
        price DECIMAL(10, 2),
        in_stock BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (store_id) REFERENCES GroceryStores(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) ON DELETE CASCADE,
        UNIQUE KEY store_ingredient (store_id, ingredient_id)
      )
    `);

    // Reviews
    await pool.query(`
      CREATE TABLE Reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipe_id INT,
        user_id INT,
        rating INT CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    // ReviewReplies
    await pool.query(`
      CREATE TABLE ReviewReplies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        review_id INT,
        user_id INT,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES Reviews(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    console.log("Schema created.");

    // === SEED DATA ===

    // Users
    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);
    const user2Pass = await bcrypt.hash('user123', 10);
    await pool.query(`
      INSERT INTO Users (name, email, password, role, dietary_preferences) VALUES
        ('Admin Chef', 'admin@verdant.com', ?, 'admin', '["Mughlai","South Indian"]'),
        ('Priya Sharma', 'user@verdant.com', ?, 'user', '["Vegetarian","Jain"]'),
        ('Rahul Verma', 'rahul@verdant.com', ?, 'user', '["High Protein","Mughlai"]')
    `, [adminPass, userPass, user2Pass]);

    // Ingredients (15 items)
    await pool.query(`
      INSERT INTO Ingredients (name, category, unit) VALUES
        ('Paneer', 'Dairy', 'g'),
        ('Garam Masala', 'Spices', 'tsp'),
        ('Basmati Rice', 'Grains', 'cup'),
        ('Turmeric', 'Spices', 'tsp'),
        ('Chicken Breast', 'Meat', 'g'),
        ('Onions', 'Vegetables', 'pieces'),
        ('Tomatoes', 'Vegetables', 'pieces'),
        ('Garlic', 'Vegetables', 'cloves'),
        ('Ginger', 'Vegetables', 'inch'),
        ('Cumin Seeds', 'Spices', 'tsp'),
        ('Coriander Powder', 'Spices', 'tsp'),
        ('Red Chili Powder', 'Spices', 'tsp'),
        ('Cream', 'Dairy', 'ml'),
        ('Butter', 'Dairy', 'tbsp'),
        ('Lemon', 'Fruits', 'pieces')
    `);

    // Recipes (6 full recipes)
    await pool.query(`INSERT INTO Recipes (title, category, description, prep_time, difficulty, image_url, cultural_origin, servings, instructions, nutrition_info, author_id, is_approved) VALUES
      ('Butter Chicken', 'Non-Veg', 'Creamy, rich tomato-based curry with tender chicken pieces. A North Indian classic loved worldwide.', 45, 'Medium',
       'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600', 'North Indian', 4,
       'Step 1: Marinate chicken with yogurt, turmeric, red chili, and salt for 30 minutes.\\nStep 2: Heat butter in a pan, add onions and sauté until golden.\\nStep 3: Add ginger-garlic paste and cook for 2 minutes.\\nStep 4: Add tomato puree, garam masala, and cook until oil separates.\\nStep 5: Add marinated chicken and cook for 15 minutes.\\nStep 6: Stir in cream, simmer for 5 minutes. Garnish with coriander.',
       '{"calories": "490", "protein": "32g", "carbs": "18g", "fats": "34g"}', 1, true),

      ('Paneer Tikka Masala', 'Vegetarian', 'Smoky grilled paneer cubes in a rich, spiced tomato gravy. Perfect with naan or rice.', 35, 'Easy',
       'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600', 'North Indian', 3,
       'Step 1: Cut paneer into cubes, marinate with yogurt and spices for 20 minutes.\\nStep 2: Grill or pan-fry paneer until charred on edges.\\nStep 3: In a separate pan, sauté onions, tomatoes, ginger-garlic paste.\\nStep 4: Blend into smooth gravy, add garam masala and cream.\\nStep 5: Add grilled paneer cubes to the gravy.\\nStep 6: Simmer for 5 minutes, garnish with kasuri methi.',
       '{"calories": "380", "protein": "22g", "carbs": "15g", "fats": "26g"}', 1, true),

      ('Chicken Biryani', 'Non-Veg', 'Fragrant layered rice with spiced chicken, saffron, and caramelized onions. The king of rice dishes.', 90, 'Hard',
       'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', 'Hyderabadi', 6,
       'Step 1: Marinate chicken with yogurt, biryani masala, ginger-garlic paste for 1 hour.\\nStep 2: Soak basmati rice for 30 minutes, then parboil with whole spices.\\nStep 3: Fry onions until deep golden brown for crispy birista.\\nStep 4: Layer marinated chicken at the bottom of a heavy pot.\\nStep 5: Add rice on top, sprinkle saffron milk and fried onions.\\nStep 6: Seal with dough (dum), cook on low heat for 25 minutes.',
       '{"calories": "650", "protein": "35g", "carbs": "72g", "fats": "22g"}', 1, true),

      ('Dal Tadka', 'Vegetarian', 'Comfort food at its best — yellow lentils tempered with ghee, cumin, garlic, and dried red chilies.', 30, 'Easy',
       'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', 'North Indian', 4,
       'Step 1: Wash and pressure cook toor dal with turmeric and salt for 3 whistles.\\nStep 2: Mash the dal and adjust consistency with water.\\nStep 3: Heat ghee in a small pan for tadka.\\nStep 4: Add cumin seeds, mustard seeds, dried red chilies, garlic.\\nStep 5: Add chopped tomatoes and cook until soft.\\nStep 6: Pour the tadka over the dal, mix and garnish with coriander.',
       '{"calories": "220", "protein": "14g", "carbs": "32g", "fats": "6g"}', 1, true),

      ('Masala Dosa', 'Vegetarian', 'Crispy golden crepe made from fermented rice and lentil batter, stuffed with spiced potato filling.', 40, 'Medium',
       'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600', 'South Indian', 2,
       'Step 1: Soak rice and urad dal separately for 6 hours, grind to smooth batter.\\nStep 2: Ferment overnight until batter doubles in size.\\nStep 3: For filling: boil potatoes, sauté with mustard seeds, turmeric, onions, green chilies.\\nStep 4: Heat a flat griddle (tawa), pour batter in circular motion.\\nStep 5: Drizzle oil, cook until golden and crispy.\\nStep 6: Place potato filling in center, fold dosa. Serve with sambar and chutney.',
       '{"calories": "300", "protein": "8g", "carbs": "48g", "fats": "10g"}', 1, true),

      ('Chole Bhature', 'Vegetarian', 'Spiced chickpea curry served with fluffy deep-fried bread. A beloved Punjabi street food classic.', 60, 'Medium',
       'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600', 'Punjabi', 4,
       'Step 1: Soak chickpeas overnight, pressure cook until tender.\\nStep 2: Prepare the masala: fry onions, add ginger-garlic, tomatoes, and spices.\\nStep 3: Add cooked chickpeas with their water, simmer for 20 minutes.\\nStep 4: For bhature: mix maida, yogurt, salt, sugar, and oil into dough.\\nStep 5: Rest dough for 2 hours, then roll into ovals.\\nStep 6: Deep fry bhature until puffed and golden. Serve with pickled onions.',
       '{"calories": "550", "protein": "18g", "carbs": "65g", "fats": "24g"}', 1, true)
    `);

    // RecipeIngredients mapping
    await pool.query(`INSERT INTO RecipeIngredients (recipe_id, ingredient_id, quantity) VALUES
      (1, 5, 500), (1, 7, 4), (1, 8, 6), (1, 9, 2), (1, 4, 1), (1, 2, 2), (1, 13, 100), (1, 14, 3),
      (2, 1, 300), (2, 7, 3), (2, 8, 4), (2, 6, 2), (2, 2, 1), (2, 13, 50), (2, 4, 1),
      (3, 5, 600), (3, 3, 3), (3, 6, 4), (3, 8, 8), (3, 9, 2), (3, 2, 2), (3, 4, 1),
      (4, 4, 1), (4, 10, 1), (4, 8, 4), (4, 7, 2), (4, 12, 1),
      (5, 6, 2), (5, 4, 1), (5, 8, 3),
      (6, 6, 3), (6, 7, 4), (6, 8, 5), (6, 9, 1), (6, 2, 2), (6, 10, 1), (6, 11, 2), (6, 12, 1)
    `);

    // Grocery Stores (Indian stores in Mumbai)
    await pool.query(`INSERT INTO GroceryStores (name, type, mobile, address, city, lat, lng) VALUES
      ('Reliance Fresh', 'Supermarket', '+91 9876543210', '123 MG Road, Andheri', 'Mumbai', 19.1190, 72.8470),
      ('Natures Basket', 'Organic Store', '+91 9876543211', '456 Linking Road, Bandra', 'Mumbai', 19.0596, 72.8295),
      ('DMart', 'Hypermarket', '+91 9876543212', '789 LBS Marg, Mulund', 'Mumbai', 19.1726, 72.9566),
      ('Big Bazaar', 'Supermarket', '+91 9876543213', '321 Hill Road, Bandra West', 'Mumbai', 19.0544, 72.8266),
      ('Local Kirana Store', 'Local Market', '+91 9876543214', '15 Juhu Lane, Juhu', 'Mumbai', 19.0883, 72.8263)
    `);

    // Store Inventory with realistic Indian prices (INR)
    await pool.query(`INSERT INTO StoreInventory (store_id, ingredient_id, price, in_stock) VALUES
      (1, 1, 80, true), (1, 2, 45, true), (1, 3, 120, true), (1, 4, 30, true), (1, 5, 280, true), (1, 6, 35, true), (1, 7, 40, true), (1, 8, 15, true), (1, 9, 20, true), (1, 10, 25, true), (1, 13, 55, true), (1, 14, 50, true),
      (2, 1, 95, true), (2, 2, 55, true), (2, 3, 140, true), (2, 4, 35, true), (2, 5, 320, true), (2, 6, 40, true), (2, 7, 45, true), (2, 8, 20, true), (2, 13, 65, true), (2, 14, 55, true),
      (3, 1, 70, true), (3, 2, 38, true), (3, 3, 105, true), (3, 4, 25, true), (3, 5, 250, true), (3, 6, 28, true), (3, 7, 32, true), (3, 8, 12, true), (3, 9, 15, true), (3, 10, 20, true), (3, 11, 18, true), (3, 12, 22, true), (3, 13, 48, true), (3, 14, 42, true), (3, 15, 10, true),
      (4, 1, 85, true), (4, 2, 42, true), (4, 3, 115, true), (4, 5, 290, true), (4, 6, 32, true), (4, 7, 38, true), (4, 14, 48, true),
      (5, 1, 75, true), (5, 2, 40, true), (5, 3, 110, true), (5, 4, 28, true), (5, 5, 260, true), (5, 6, 30, true), (5, 7, 35, true), (5, 8, 10, true), (5, 9, 12, true)
    `);

    // Sample Reviews
    await pool.query(`INSERT INTO Reviews (recipe_id, user_id, rating, comment) VALUES
      (1, 2, 5, 'Absolutely delicious! The cream makes it so rich and the flavors are perfectly balanced. My family loved it!'),
      (1, 3, 4, 'Great recipe! I added a bit of kasuri methi at the end which elevated the flavor. Would recommend reducing cream for a lighter version.'),
      (2, 2, 5, 'Best paneer tikka masala I have ever made at home. The grilling step is key for that smoky flavor.'),
      (3, 3, 5, 'Authentic Hyderabadi style! The dum cooking method makes all the difference. Restaurant quality at home.'),
      (4, 2, 4, 'Simple and comforting. I added spinach to make it more nutritious. Perfect for weeknight dinners.'),
      (5, 3, 4, 'Crispy dosa every time! The fermentation tip is a game changer. Took 2 attempts to get it right.')
    `);

    // Sample Review Replies
    await pool.query(`INSERT INTO ReviewReplies (review_id, user_id, comment) VALUES
      (1, 3, 'I agree! Try adding a pinch of sugar to balance the tomato acidity. Works wonders!'),
      (2, 2, 'Great tip on the kasuri methi! I also sometimes add honey for a sweet undertone.'),
      (3, 1, 'Thank you! For extra smokiness, try using a small piece of charcoal in a bowl inside the pot before serving.'),
      (4, 2, 'The dum technique is everything. Make sure the seal is tight — I use wheat flour dough to seal the lid.')
    `);

    console.log("Seed data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initDB();
