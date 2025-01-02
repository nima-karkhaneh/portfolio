import express from "express"
import pg from "pg";
import env from "dotenv"

const app = express();
env.config();
const port = process.env.port || 3000;

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

let dataArr = [];
let starDisplay = [];
let condition = true;

// GET ROUTES
app.get("/", (req,res)=>{
    res.render("index.ejs")
})
app.get("/add", (req,res)=>{
    res.render("add.ejs");
})

// DISPLAYING BOOKS VIA BOOKS ROUTE
app.get("/books", async (req,res)=>{
    if (condition) {
        try{
            const book = await db.query("SELECT * FROM library ORDER BY id ASC");
            const rating = await db.query("SELECT * FROM rating")
            dataArr = book.rows;
            starDisplay = rating.rows
            res.render("books.ejs",{
                dataArr: dataArr,
                starDisplay: starDisplay
            })
        }
        catch(err){
            console.log(err.message)
        }
    } else {
        res.render("books.ejs",{
            dataArr: dataArr,
            starDisplay: starDisplay
        })
        condition = true;
    }
})

// POSTING A NEW BOOK
app.post("/submit", async (req, res) =>{
    const title = req.body.title;
    const author = req.body.author;
    const ISBN = req.body.ISBN;
    const date = req.body.date;
    const review = req.body.review;
    const rate = req.body.rate;
    try{
        await db.query("INSERT INTO library (title, author, isbn, date, review, rate) VALUES ($1, $2, $3, $4, $5, $6);", [title, author, ISBN, date, review, rate])
        await db.query("INSERT INTO rating (rate) VALUES ($1);", [rate])
    }
    catch(err){
        console.log(err.message)
    }
    res.redirect("/books")
})

// DELETE ROUTE
app.get("/books/delete/:bookID", async (req,res) =>{
    const foundStarRating = starDisplay.find((d)=> d.id === parseInt(req.params.bookID));
    const foundBook = dataArr.find((d)=> d.id === parseInt(req.params.bookID));
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
    const foundBook = dataArr.find((d) => d.id === parseInt(req.params.bookID));
    res.render("edit.ejs",{
        foundBook: foundBook,
        starDisplay: starDisplay
    })
})

// EDIT ROUTE
app.post("/books/edit/:bookID", async (req, res) =>{
    const foundStarRating = starDisplay.find((d)=> d.id === parseInt(req.params.bookID));
    const foundBook = dataArr.find((d)=> d.id === parseInt(req.params.bookID));
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
                dataArr = result.rows;
                starDisplay = rating.rows;
                condition = false;
            }
            catch(err){
                console.log(err)
            }
            break;
        case "Date Read":
            try{
                const result = await db.query("SELECT * FROM library ORDER BY date DESC");
                const rating = await db.query("SELECT * FROM rating")
                dataArr = result.rows;
                starDisplay = rating.rows;
                condition = false;
            }
            catch (err){
                console.log(err);
            }
            break;
        case "Alphabet":
            try{
                const result = await db.query("SELECT * FROM library ORDER by title ASC");
                const rating = await db.query("SELECT * FROM rating")
                dataArr = result.rows;
                starDisplay = rating.rows;
                condition = false;
            }
            catch(err){
                console.log(err.message)
            }
            break;
    }
    res.redirect("/books");
})

app.listen(port, () =>{
    console.log(`server is listening on http://localhost:3000/`);
})