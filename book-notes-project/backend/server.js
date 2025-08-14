import express from "express";
import axios from "axios";
import env from "dotenv";
env.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));


// GET ROUTES
app.get("/", (req,res)=>{
    res.render("index.ejs")
})
app.get("/add", (req,res)=>{
    res.render("add.ejs");
})


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}/`);
})