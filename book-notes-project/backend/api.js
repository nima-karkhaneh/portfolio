import express from "express";
import env from "dotenv";
import db from "./db.js";
env.config()

const app = express();
const port = process.env.API_PORT || 4000;

app.use(express.json());
app.get("/books", async (req, res) => {
    try {
        const sort = req.query.sort;
        let orderBy;
        switch (sort) {
            case "rating":
                orderBy = "rate DESC";
                break;
            case "date":
                orderBy = "date DESC";
                break;
            case "alphabet":
                orderBy = "title ASC";
                break;
            default:
                orderBy = "id ASC"
        }

        const queryText = `
              SELECT library.id, library.title, library.author, library.isbn, library.date, library.review, rating.rate
              FROM library
              LEFT JOIN rating ON library.id = rating.id
              ORDER BY ${orderBy};
    `;

        const result = await db.query(queryText);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No books found in the library." });
        }

        res.json({ books: result.rows });

    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "server error" })
    }
})