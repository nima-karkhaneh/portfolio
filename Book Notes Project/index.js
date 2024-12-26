import express from "express"
import axios from "axios";

const app = express();
const port = process.env.port || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

let dataArr = [];
let starDisplay = [];

app.get("/", (req,res)=>{
    res.render("index.ejs")
})
app.get("/add", (req,res)=>{
    res.render("add.ejs");
})
app.get("/books", (req,res)=> {
    res.render("books.ejs",{
        dataArr: dataArr,
        starDisplay: starDisplay
    });
});
app.post("/submit", (req,res)=>{
    const data = {
        id: dataArr.length + 1,
        title: req.body.title,
        author: req.body.author,
        ISBN: req.body.ISBN,
        date: req.body.date,
        review: req.body.review,
        rate: req.body.rate
    }
    const starDisplayData = {
        id: starDisplay.length + 1,
        rate: req.body.rate
    }
    dataArr.push(data);
    starDisplay.push(starDisplayData);
    res.redirect("/books");
})

app.get("/books/edit/:bookID", (req, res)=>{
    const foundBook = dataArr.find((d)=>d.id===parseInt(req.params.bookID));
    res.render("edit.ejs",{
        foundBook: foundBook,
        starDisplay: starDisplay

    })
});

app.post("/books/edit/:bookID", (req,res)=>{
    const foundBook = dataArr.find((d) => d.id === parseInt(req.params.bookID));
    const foundStar= starDisplay.find((d)=>d.id===parseInt(req.params.bookID));
    const foundStarIndex = starDisplay.findIndex((d) => d.id === parseInt(req.params.bookID));
    const foundIndex = dataArr.findIndex((d) => d.id === parseInt(req.params.bookID));
    const updatedBook = {
        id: foundIndex+1,
        title: req.body.title || foundBook.title,
        author: req.body.author || foundBook.author,
        ISBN: req.body.ISBN || foundBook.ISBN,
        date: req.body.date || foundBook.date,
        review: req.body.review || foundBook.review,
        rate: req.body.rate || foundBook.rate
    }
    const updatedStarDisplay = {
        id: foundStarIndex + 1,
        rate: req.body.rate || foundStar.id
    }
    dataArr[foundIndex] = updatedBook;
    starDisplay[foundStarIndex] = updatedStarDisplay;
    res.redirect("/books")
})

// DELETING A BOOK
app.get("/books/delete/:bookID", (req,res)=> {
    const foundIndex = dataArr.findIndex((d) => d.id === parseInt(req.params.bookID));
    const foundStarIndex = starDisplay.findIndex((d) => d.id === parseInt(req.params.bookID));
    dataArr.splice(foundIndex, 1);
    starDisplay.splice(foundStarIndex, 1);
    res.redirect("/books")
})

app.listen(port, () =>{
    console.log(`server is listening on http://localhost:3000/`);
})