import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

async function connectDB() {
    try {
        await db.connect();
        console.log("Database connected successfully.");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Exit if DB connection fails
    }
}

connectDB();

export default db;
