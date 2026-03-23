import pool from '../config/db.js';

async function alterDatabase() {
    try {
        // 1. Create SavedRecipes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS SavedRecipes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                recipe_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY user_recipe (user_id, recipe_id),
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE
            )
        `);
        console.log("SavedRecipes table created or already exists.");

        // 2. Alter Ingredients table
        // Add is_approved and requested_by if they don't exist
        const [columns] = await pool.query(`SHOW COLUMNS FROM Ingredients`);
        const colNames = columns.map(c => c.Field);

        if (!colNames.includes('is_approved')) {
            await pool.query(`ALTER TABLE Ingredients ADD COLUMN is_approved BOOLEAN DEFAULT TRUE`);
            console.log("Added 'is_approved' to Ingredients.");
        }

        if (!colNames.includes('requested_by')) {
            await pool.query(`ALTER TABLE Ingredients ADD COLUMN requested_by INT DEFAULT NULL`);
            await pool.query(`ALTER TABLE Ingredients ADD CONSTRAINT fk_ingredient_user FOREIGN KEY (requested_by) REFERENCES Users(id) ON DELETE SET NULL`);
            console.log("Added 'requested_by' to Ingredients.");
        }

        console.log("Database Alteration Complete!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

alterDatabase();
