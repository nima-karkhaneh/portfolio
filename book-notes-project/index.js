import express from "express"
import pg from "pg";
import env from "dotenv"

const app = express();
env.config();
const port = process.env.PORT || 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

let booksArr = [];
let starDisplay = [];
let sortFunctionality = false;

// GET ROUTES
app.get("/", (req,res)=>{
    res.render("index.ejs")
})
app.get("/add", (req,res)=>{
    res.render("add.ejs");
})

// DISPLAYING BOOKS VIA BOOKS ROUTE
app.get("/books", async (req,res)=>{
    if (!sortFunctionality) {
        try{
            const books = await db.query("SELECT * FROM library ORDER BY id ASC");
            const rating = await db.query("SELECT * FROM rating")
            if (books.rows == 0) {
               return res.render("index.ejs", {
                   error: "You don't have any books in your library. Please use the + icon on the top right to add your books!"
               })
            }
            booksArr = books.rows;
            starDisplay = rating.rows
            res.render("books.ejs",{
                booksArr: booksArr,
                starDisplay: starDisplay
            })
        }
        catch(err){
            console.log(err.message)
        }
    } else {
        res.render("books.ejs",{
            booksArr: booksArr,
            starDisplay: starDisplay
        })
        sortFunctionality = false;
    }
})

// POSTING A NEW BOOK
app.post("/submit", validateISBN, async (req, res) =>{
    const title = req.body.title;
    const author = req.body.author;
    const ISBN = req.body.ISBN;
    const date = req.body.date;
    const review = req.body.review;
    const rate = req.body.rate;
    try{
        const checkBook = await db.query("SELECT * FROM library WHERE isbn = $1", [ISBN])
        if (checkBook.rows != 0) {
            return res.render("add.ejs", {
                error:"Book already exists in the library!"
            })
        } else {
            await db.query("INSERT INTO library (title, author, isbn, date, review, rate) VALUES ($1, $2, $3, $4, $5, $6);", [title, author, ISBN, date, review, rate])
            await db.query("INSERT INTO rating (rate) VALUES ($1);", [rate])
        }
    }
    catch(err){
        console.log(err.message)
    }
    res.redirect("/books")
})

// DELETE ROUTE
app.get("/books/delete/:bookID", async (req,res) =>{
    const foundStarRating = starDisplay.find((d)=> d.id === parseInt(req.params.bookID));
    const foundBook = booksArr.find((d)=> d.id === parseInt(req.params.bookID));
    try{
        await db.query("DELETE FROM RATING WHERE id = $1", [foundStarRating.id]);
        await db.query("DELETE FROM library WHERE id = $1", [foundBook.id]);
        res.redirect("/books")
    }
    catch(err){
        console.log(err.message)
    }
})

// GETTING A SPECIFIC BOOK
app.get("/books/edit/:bookID", (req, res)=>{
    const foundBook = booksArr.find((d) => d.id === parseInt(req.params.bookID));
    res.render("edit.ejs",{
        foundBook: foundBook,
        starDisplay: starDisplay
    })
})

// EDIT ROUTE
app.post("/books/edit/:bookID", async (req, res) =>{
    const foundStarRating = starDisplay.find((d)=> d.id === parseInt(req.params.bookID));
    const foundBook = booksArr.find((d)=> d.id === parseInt(req.params.bookID));
    try{
        await db.query("UPDATE rating SET rate = ($1) WHERE id = ($2)", [req.body.rate, foundStarRating.id]);
        await db.query("UPDATE library SET title = ($1), author = ($2), isbn = ($3), date = ($4), review = ($5) , rate = ($6) WHERE id = ($7)", [req.body.title, req.body.author, req.body.ISBN, req.body.date, req.body.review, req.body.rate, foundBook.id]);
        res.redirect("/books")
    }
    catch(err){
        console.log(err.message);
    }
})

// SORT ROUTE
app.post("/sort", async (req, res) =>{
    const sort = req.body.sort;
    switch(sort){
        case "Rating":
            try{
                const result = await db.query("SELECT * FROM library ORDER BY rate DESC");
                const rating = await db.query("SELECT * FROM rating")
                booksArr = result.rows;
                starDisplay = rating.rows;
                sortFunctionality = true;
            }
            catch(err){
                console.log(err)
            }
            break;
        case "Date Read":
            try{
                const result = await db.query("SELECT * FROM library ORDER BY date DESC");
                const rating = await db.query("SELECT * FROM rating")
                booksArr = result.rows;
                starDisplay = rating.rows;
                sortFunctionality = true;
            }
            catch (err){
                console.log(err);
            }
            break;
        case "Alphabet":
            try{
                const result = await db.query("SELECT * FROM library ORDER by title ASC");
                const rating = await db.query("SELECT * FROM rating")
                booksArr = result.rows;
                starDisplay = rating.rows;
                sortFunctionality = true;
            }
            catch(err){
                console.log(err.message)
            }
            break;
    }
    res.redirect("/books");
})


// MIDDLEWARE TO VALIDATE ISBN

const isbn10Regex = /^\d{9}(\d|X)$/; // ISBN-10 format regex
const isbn13Regex = /^\d{13}$/;     // ISBN-13 format regex

function validateISBN(req, res, next) {
    const { ISBN } = req.body;

    // Clean input (remove non-numeric characters except 'X' in ISBN-10)
    const cleanedISBN = ISBN.replace(/[^0-9X]/gi, '').toUpperCase();

    // Check if the ISBN matches the format for ISBN-10 or ISBN-13
    if (isbn10Regex.test(cleanedISBN)) {
        if (isValidISBN10(cleanedISBN)) {
            return next(); // Valid ISBN-10, proceed to the next middleware/handler
        } else {
            return res.status(400).render("add.ejs", {
                error: 'Invalid ISBN-10 checksum' });
        }
    } else if (isbn13Regex.test(cleanedISBN)) {
        if (isValidISBN13(cleanedISBN)) {
            return next(); // Valid ISBN-13, proceed to the next middleware/handler
        } else {
            return res.status(400).render("add.ejs", {
                error: 'Invalid ISBN-13 checksum' });
        }
    }

    return res.status(400).render("add.ejs",{
        error: 'Invalid ISBN format. Please use a valid ISBN!' }); // Invalid format
}

// ISBN-10 Checksum Validation
function isValidISBN10(isbn) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += (isbn.charAt(i) * (10 - i));
    }

    let checksum = isbn.charAt(9);
    if (checksum === 'X') {
        sum += 10; // 'X' is treated as 10 in ISBN-10
    } else {
        sum += parseInt(checksum);
    }

    return (sum % 11 === 0); // ISBN-10 checksum validation
}

// ISBN-13 Checksum Validation
function isValidISBN13(isbn) {
    let sum = 0;
    for (let i = 0; i < 13; i++) {
        let digit = parseInt(isbn.charAt(i));
        sum += (i % 2 === 0) ? digit : digit * 3; // Weighted sum for ISBN-13
    }

    return (sum % 10 === 0); // ISBN-13 checksum validation
}


app.listen(port, () =>{
    console.log(`server is listening on http://localhost:${port}/`);
})