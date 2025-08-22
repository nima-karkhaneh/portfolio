import express from "express";
import env from "dotenv";
env.config()
import db from "./db.js";
import { validateCreateBook, validateUpdateBook, validateGetAndDeleteBook } from "./helper-functions/validator.js";
import { validationResult } from "express-validator";
import sendError from "./helper-functions/sendError.js";


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
            return sendError(res, 404, "No books found in the library.")
        }

        res.status(200).json({ books: result.rows });

    }
    catch (err) {
        console.log(err.message);
        return sendError(res, 500, "server error");
    }
})


app.post ("/submit", validateCreateBook, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, "Validation failed", errors.array())
    }

    const { title, author, isbn, date, review, rate, reader_name } = req.body;

    try  {
        const checkBook = await db.query("SELECT * FROM library WHERE isbn = $1", [isbn]);
        if (checkBook.rows.length !== 0) {
            return sendError(res, 400, "Book already exists in the library.")
        }

        const insertLibraryQuery = `
      INSERT INTO library (title, author, isbn, date, review, reader_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
        const libraryResult = await db.query(insertLibraryQuery, [title, author, isbn, date, review, reader_name]);

        const newLibraryId = libraryResult.rows[0].id;

        const insertRatingQuery = `
        INSERT INTO rating (rate, library_id) VALUES ($1, $2);
    `;

        await db.query(insertRatingQuery, [rate, newLibraryId]);
        res.status(201).json( { message: "Book added successfully." })

    }

    catch (err) {
        console.log(err.message);
        return sendError(res, 500,  "server error")
    }
})

// GETTING A SPECIFIC BOOK

app.get("/books/:id", validateGetAndDeleteBook, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, "Validation failed.", errors.array())
    }

    const { id } = req.params;

    try {
        const bookResult = await db.query(`
      SELECT l.id, l.title, l.author, l.isbn, l.reader_name, l.date, l.review, r.rate
      FROM library l
      LEFT JOIN rating r ON l.id = r.library_id
      WHERE l.id = $1
    `, [id]);

        if (bookResult.rows.length === 0) {
            return sendError(res, 404, "Book not found.")
        }

        res.status(200).json({ book: bookResult.rows[0] });
    }
    catch (err) {
        console.error(err.message);
        return sendError(res, 500, "Server Error")
    }
});



app.patch("/books/:id", validateUpdateBook, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, "Validation failed", errors.array())
    }

    const { id } = req.params;
    const { date, review, rate } = req.body;

    try {
        const checkBook = await db.query("SELECT * FROM library WHERE id = $1", [id]);
        if (checkBook.rows.length === 0) {
            return sendError(res, 404, "Book not found.")
        }

        // Dynamic SQL for library update

        const libraryUpdates = [];
        const libraryValue = [];
        let valueIndex = 1

        if (date) {
            libraryUpdates.push(`date=$${valueIndex++}`);
            libraryValue.push(date)
        }

        if (review) {
            libraryUpdates.push(`review=$${valueIndex++}`);
            libraryValue.push(review)
        }

        if (libraryUpdates.length > 0) {
            libraryValue.push(id);
            await db.query(
                `UPDATE library SET ${libraryUpdates.join(", ")} WHERE id = $${valueIndex}`,
                libraryValue
            );
        }

    // Update rating table if provided

    if (rate !== undefined) {
        await db.query(
            `UPDATE rating SET rate = $1 WHERE library_id = $2`,
            [rate, id]
        );
    }
    res.status(200).json( { message: "Book updated successfully." })

    }

    catch (err) {
            console.log(err.message)
            return sendError(res, 500, "Server error.")
    }
})


// DELETE ROUTE

app.delete("/books/:id", validateGetAndDeleteBook, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, "Validation failed", errors.array())
    }

    const { id } = req.params;

    try {
        const checkBook = await db.query("SELECT * FROM library WHERE id = $1", [id]);

        if (checkBook.rows.length === 0) {
            return sendError(res, 404, "Book not found.")
        }

        // Relevant row from rating table gets deleted thanks to ON DELETE CASCADE
        await db.query("DELETE FROM library WHERE id = $1", [id]);
        res.status(200).json({ message: "Book deleted successfully."})
    }

    catch (err) {
        console.error(err.message);
        return sendError(res, 500, "Sever error.")
    }
})







app.listen(port, () => {
    console.log(`api is listening on http://localhost:${port}/`);
})