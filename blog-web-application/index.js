import express from "express";
import validator from "./validation-middleware/validator.js";
import {validationResult} from "express-validator";


const app = express();
const port = process.env.PORT || 3000


app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

function getFormattedDate() {
    const now = new Date();
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return now.toLocaleString('en-AU', options).replace(',', '');
}

const posts= [];

// GET routes

app.get("/", (req,res)=>{
    res.render("home.ejs", {
        posts,
        noPosts: req.query.noPosts
    });
})

app.get("/new-posts", (req,res)=>{
    res.render("new-posts.ejs")
})

app.get("/posts", (req, res) => {
    if (posts.length === 0) {
        return res.redirect("/?noPosts=true");
    }
    res.render("posts.ejs", {
        posts,
    });
});


// Submitting a new post

app.post("/submit", validator, (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("new-posts.ejs" , {
            errors: errors.array(),
            postData: req.body
        })
    }
    const post = {
        id: posts.length + 1,
        author: req.body.author,
        title: req.body.title,
        text: req.body.text,
        date: getFormattedDate()
    }
    posts.push(post);
    res.redirect("/posts")
})

// Getting a specific post

app.get("/edit/:postID", (req,res)=>{
    const foundPost = posts.find((p) => p.id === parseInt(req.params.postID));
    res.render("edit-posts.ejs",{
        foundPost: foundPost
    });
})

// Editing/Updating a specific post

app.post("/edit/:postID", validator, (req, res) => {
    const foundIndex = posts.findIndex((p) => p.id === parseInt(req.params.postID));
    if (foundIndex === -1) return res.status(404).send("Post not found.");

    const foundPost = posts[foundIndex];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("edit-posts.ejs", {
            errors: errors.array(),
            postData: req.body,
            foundPost,
        });
    }

    const updatedPost = {
        id: foundPost.id,
        author: req.body.author || foundPost.author,
        title: req.body.title || foundPost.title,
        text: req.body.text || foundPost.text,
        date: getFormattedDate(),
    };

    posts[foundIndex] = updatedPost;

    res.redirect("/posts");
});


// Deleting a specific post

app.get("/posts/delete/:postID", (req,res)=> {
    const foundIndex = posts.findIndex((p) => p.id === parseInt(req.params.postID));
    if (foundIndex !== -1) posts.splice(foundIndex, 1);
    if (posts.length === 0) {
        return res.redirect("/?noPosts=true")
    }
    res.redirect("/posts")
})


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}/`);
})