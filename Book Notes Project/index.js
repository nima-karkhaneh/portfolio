import express from "express"
import axios from "axios";

const app = express();
const port = process.env.port || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/", (req,res)=>{
    res.render("index.ejs")
})
app.get("/add", (req,res)=>{
    res.render("add.ejs");
})
app.get("/books", (req,res)=>{
    res.render("books.ejs")
})
app.post("/submit",(req,res)=>{
    console.log(req.body);
    console.log(req.body.rate);
    res.render("books.ejs",{
        rate: req.body.rate
    });
})

app.listen(port, () =>{
    console.log(`server is listening on http://localhost:3000/`);
})