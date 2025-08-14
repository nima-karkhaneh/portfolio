import express from "express";
import axios from "axios";
import env from "dotenv";
env.config();

const app = express();
const port = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL

app.use(express.static("public"));


// GET ROUTES
app.get("/", (req,res)=>{
    res.render("index.ejs")
})
app.get("/add", (req,res)=>{
    res.render("add.ejs");
})

app.get("/books", async(req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`)
        // checks for undefined or null values at each level
        const booksArr = response?.data?.books ?? [];


        // Implicit return using parentheses
        const starDisplay = booksArr.map(book => ({
            // Use ?? instead of || so that valid 0 ratings are preserved.
            // ?? only falls back if value is null or undefined, unlike || which treats 0 as falsy.
            library_id: book.id,
            rate: book?.rate ?? 0
        }))

        res.render("books.ejs", {
            booksArr: booksArr,
            starDisplay: starDisplay
        })
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error. Unable to fetch data" })
    }
})


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}/`);
})