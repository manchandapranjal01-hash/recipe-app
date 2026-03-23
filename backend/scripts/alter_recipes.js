import pool from '../config/db.js';

async function migrate() {
    try {
        await pool.query("ALTER TABLE Recipes ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
        await pool.query("UPDATE Recipes SET status = 'approved' WHERE is_approved = TRUE");
        console.log("Migration successful");
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') console.log("Already migrated");
        else console.error(e);
    }
    process.exit(0);
}
migrate();
