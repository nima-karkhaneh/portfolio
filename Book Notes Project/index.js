import express from "express"
import axios from "axios";

const app = express();
const port = process.env.port || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

let dataArr = [];

app.get("/", (req,res)=>{
    res.render("index.ejs")
})
app.get("/add", (req,res)=>{
    res.render("add.ejs");
})
app.get("/books", (req,res)=> {
    res.render("books.ejs",{
        dataArr: dataArr
    });
});
app.post("/submit",(req,res)=>{
    const data = {
        id: dataArr.length + 1,
        title: req.body.title,
        author: req.body.author,
        review: req.body.review,
        rate: req.body.rate
    }
    dataArr.push(data);
    console.log(dataArr);
    res.redirect("/books");
})

app.listen(port, () =>{
    console.log(`server is listening on http://localhost:3000/`);
})