import express from "express";
import env from "dotenv";
import db from "./db.js";
env.config()

const app = express();
const port = process.env.API_PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
              SELECT 
                library.id,
                library.title,
                library.author,
                library.isbn,
                library.reader_name,
                library.date,
                library.review,
                rating.rate
              FROM library
              LEFT JOIN rating ON library.id = rating.library_id
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


app.post ("/submit", async (req, res) => {
    const { title, author, ISBN, date, review, rate, reader_name } = req.body;

    try  {
        const checkBook = await db.query("SELECT * FROM library WHERE isbn = $1", [ISBN]);
        if (checkBook.rows.length !== 0) {
            return res.status(400).json({ error: "Book already exists in the library." })
        }

        const insertLibraryQuery = `
      INSERT INTO library (title, author, isbn, date, review, reader_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
        const libraryResult = await db.query(insertLibraryQuery, [title, author, ISBN, date, review, reader_name]);

        const newLibraryId = libraryResult.rows[0].id;

        const insertRatingQuery = `
        INSERT INTO rating (rate, library_id) VALUES ($1, $2);
    `;

        await db.query(insertRatingQuery, [rate, newLibraryId]);
        res.status(201).json( {message: "Book added successfully."})

    }

    catch (err) {
        console.log(err.message);
        res.status(500).json( { error: "server error" });
    }
})







app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}/`);
})