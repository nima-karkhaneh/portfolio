import express from "express";
import axios from "axios";
import env from "dotenv";
env.config();

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


// GET ROUTES
app.get("/", (req,res)=>{
    res.render("index.ejs")
})


app.get("/books", async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);

        // Checks for undefined or null values at each level
        const booksArr = response?.data?.books ?? [];

        // Build starDisplay array from books data
        const starDisplay = booksArr.map(book => ({
            // ?? only falls back if value is null or undefined, unlike || which treats 0 as falsy.
            library_id: book.id,
            rate: book?.rate ?? 0
        }));

        res.render("books.ejs", {
            booksArr,
            starDisplay
        });
    }
    catch (err) {
        console.error("Error in GET /books:", err.message);

        if (err.response) {
            // API responded but returned an error status
            console.error("API error details:", err.response.data);

            res.status(err.response.status).json({ error: err.response.data?.error || "API request failed." });
        }
        else if (err.request) {
            // No response from API
            console.error("No response from API:", err.request);

            res.status(503).json({ error: "Service unavailable. Please try again later." });
        }
        else {
            // Unexpected server-side error
            res.status(500).json({ error: "Internal server error." });
        }
    }
});


// Adding a new book

app.get("/add", (req,res)=>{
    res.render("add.ejs");
})

app.post("/submit", async (req, res) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/submit`, req.body);

        // Redirect to books page if successful
        res.redirect("/books");
    }
    catch (err) {
        console.error("Error in POST /submit:", err.message);

        if (err.response) {
            // API responded but with an error status (4xx or 5xx)
            console.error("API error details:", err.response.data);

            res.status(err.response.status).json({error: err.response.data?.error || "API request failed."});
        }
        else if (err.request) {
            // No response from API (e.g., network error, API down)
            console.error("No response from API:", err.request);

            res.status(503).json({ error: "Service unavailable. Please try again later." });
        }
        else {
            // Unexpected server-side error (e.g., bad code, runtime bug)
            res.status(500).json({ error: "Internal server error." });
        }
    }
});

// Rendering edit.ejs with prefilled values

app.get("/books/edit/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`${API_BASE_URL}/books/${id}`);

        if (!response?.data?.book) {
            return res.status(404).render("error.ejs", {
                error: "Book not found."
            });
        }

        const foundBook = response.data.book;

        res.render("edit.ejs", { foundBook });
    }
    catch (err) {
        console.error(`Error fetching book with ID ${id}:`, err.message);

        if (err.response) {
            // API responded with error status
            res.status(err.response.status).render("error.ejs", {
                error: err.response.data?.error || "API error fetching book."
            });
        }
        else if (err.request) {
            // No response from API
            res.status(503).render("error.ejs", {
                error: "Service unavailable. Please try again later."
            });
        }
        else {
            // Server-side error
            res.status(500).render("error.ejs", {
                error: "Internal server error."
            });
        }
    }
});


// Delete route
app.post("/books/delete/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const response = await axios.delete(`${API_BASE_URL}/books/${id}`)
        console.log(response.data)
        res.status(200).json( { message: "Book deleted" })
    }

    catch(err) {
        console.error(err.message);
        res.status(500).json({ error: "Unable to delete books. Sever error." })
    }
})





app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}/`);
})